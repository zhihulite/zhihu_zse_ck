// zseenv.cc —— 补环境用的原生 addon（纯 JS 补不了的两件事）
//
// ① [[IsHTMLDDA]]：`typeof obj === "undefined"`，但对象仍然可调用 / 可索引。
//    这是 `document.all` 在真浏览器里的语义。站点的环境检测会读
//    `typeof document.all` 与 `typeof (new XHR()).all`，纯 JS 无法让 typeof 返回 "undefined"。
//
//    Node 25 的 V8 已移除 `v8::Object::SetIsHtmlDDA`，但 `ObjectTemplate` 仍有
//    `MarkAsUndetectable()` + `SetCallAsFunctionHandler()` —— 两者叠起来就是该语义
//    （与 sdenv 的 `bin/documentAll.cc` 同一做法）。
//
// ② `Function.prototype.toString` 的原生形态：站点会校验
//    `String(setTimeout).indexOf("native")` 与 `Function.prototype.toString.call(fn)`。
//    自有 toString 会被 `.call(fn)` 绕过，所以在原生侧替换 toString。
#include <node.h>
#include <v8.h>
#include <string>
#include <vector>

namespace zseenv {

using v8::Array;
using v8::Context;
using v8::External;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

// 隐藏键：把「伪原生源码」挂在函数对象上
static v8::Global<v8::Symbol> g_key;
static v8::Global<Function> g_orig_toString;
static v8::Global<v8::Symbol> g_tag;
static bool g_installed = false;

// 每个 undetectable 模板持有其目标对象的强引用（回调 data 只能放 POD，所以用 External 包一层）
struct TplData {
  v8::Global<Value> target;
};
static std::vector<TplData*>* g_data = nullptr;

// own toString 回调：返回存在隐藏键里的 tag 串
static void TaggedToString(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  Local<Context> ctx = iso->GetCurrentContext();
  Local<Value> tag;
  if (args.This()->IsObject() &&
      args.This().As<Object>()->Get(ctx, g_tag.Get(iso)).ToLocal(&tag) && tag->IsString()) {
    args.GetReturnValue().Set(tag);
    return;
  }
  args.GetReturnValue().Set(String::NewFromUtf8Literal(iso, "[object Object]"));
}
static void UndetectableCall(const FunctionCallbackInfo<Value>& args);

// 造一个空的 undetectable 对象（typeof === "undefined"，但仍是对象、可调用）
static Local<Object> NewUndetectable(Isolate* iso, Local<Context> ctx) {
  Local<ObjectTemplate> tpl = ObjectTemplate::New(iso);
  tpl->MarkAsUndetectable();
  tpl->SetCallAsFunctionHandler(UndetectableCall);
  return tpl->NewInstance(ctx).ToLocalChecked();
}

// 被当函数调用时：返回**目标对象**（真机的 `document.all()` 返回对象，不是 undefined / null）。
static void UndetectableCall(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  if (args.Data()->IsExternal()) {
    TplData* d = static_cast<TplData*>(args.Data().As<External>()->Value());
    if (d && !d->target.IsEmpty()) {
      args.GetReturnValue().Set(d->target.Get(iso));
      return;
    }
  }
  args.GetReturnValue().Set(NewUndetectable(iso, iso->GetCurrentContext()));
}

// makeUndetectable(target, name?, proto?) -> undetectable 对象
//   · typeof 为 "undefined"、可调用（调用返回 target）、可索引（target 的属性已拷过来）
static void MakeUndetectable(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  Local<Context> ctx = iso->GetCurrentContext();
  if (args.Length() < 1 || !args[0]->IsObject()) {
    args.GetReturnValue().Set(args[0]);
    return;
  }
  Local<Object> target = args[0].As<Object>();

  Local<ObjectTemplate> tpl = ObjectTemplate::New(iso);
  tpl->MarkAsUndetectable();  // typeof -> "undefined"

  TplData* d = new TplData();
  d->target.Reset(iso, target);
  if (!g_data) g_data = new std::vector<TplData*>();
  g_data->push_back(d);
  tpl->SetCallAsFunctionHandler(UndetectableCall, External::New(iso, d));

  Local<Object> o = tpl->NewInstance(ctx).ToLocalChecked();

  // 原型：显式给的第 3 参优先，否则沿用 target 的原型
  Local<Value> proto = (args.Length() >= 3 && args[2]->IsObject()) ? args[2] : target->GetPrototype();
  if (proto->IsObject()) o->SetPrototype(ctx, proto).FromJust();

  // Symbol.toStringTag = name ⇒ `Object.prototype.toString` 给 `[object <name>]`
  // （站点会检 `document.all.toString().indexOf("HTMLAllCollection")`）
  if (args.Length() >= 2 && args[1]->IsString()) {
    std::string nm(*String::Utf8Value(iso, args[1]));
    std::string tagged = "[object " + nm + "]";
    o->Set(ctx, v8::Symbol::GetToStringTag(iso), args[1]).FromJust();
    o->Set(ctx, g_tag.Get(iso), String::NewFromUtf8(iso, tagged.c_str()).ToLocalChecked()).FromJust();
    Local<Function> ts = Function::New(ctx, TaggedToString).ToLocalChecked();
    ts->SetName(String::NewFromUtf8Literal(iso, "toString"));
    o->Set(ctx, String::NewFromUtf8Literal(iso, "toString"), ts).FromJust();
  }
  // 把 target 的属性（含原型链，length 在内）拷过去
  Local<Array> keys;
  if (target->GetPropertyNames(ctx).ToLocal(&keys)) {
    for (uint32_t i = 0; i < keys->Length(); i++) {
      Local<Value> k, v;
      if (!keys->Get(ctx, i).ToLocal(&k)) continue;
      if (target->Get(ctx, k).ToLocal(&v)) o->Set(ctx, k, v).FromJust();
    }
  }
  // `document.all.length` 必须是数字
  {
    Local<Value> len;
    if (!(o->Get(ctx, String::NewFromUtf8Literal(iso, "length")).ToLocal(&len) && len->IsNumber())) {
      o->Set(ctx, String::NewFromUtf8Literal(iso, "length"), v8::Integer::New(iso, 0)).FromJust();
    }
  }
  args.GetReturnValue().Set(o);
}

// registerNative(fn, name) —— 登记该函数的「伪原生源码」
static void RegisterNative(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  Local<Context> ctx = iso->GetCurrentContext();
  if (args.Length() < 2 || !args[0]->IsFunction() || !args[1]->IsString()) return;
  std::string name(*String::Utf8Value(iso, args[1]));
  std::string src = "function " + name + "() { [native code] }";
  args[0]
      .As<Object>()
      ->Set(ctx, g_key.Get(iso), String::NewFromUtf8(iso, src.c_str()).ToLocalChecked())
      .FromJust();
}

// 原生 toString：先查隐藏键，否则走原始实现
static void NativeToString(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  Local<Context> ctx = iso->GetCurrentContext();
  Local<Value> self = args.This();
  if (self->IsObject()) {
    Local<Value> v;
    if (self.As<Object>()->Get(ctx, g_key.Get(iso)).ToLocal(&v) && v->IsString()) {
      args.GetReturnValue().Set(v);
      return;
    }
  }
  Local<Value> r;
  if (!g_orig_toString.IsEmpty() &&
      g_orig_toString.Get(iso)->Call(ctx, self, 0, nullptr).ToLocal(&r)) {
    args.GetReturnValue().Set(r);
  }
}

// installNativeToString(Function.prototype)
static void InstallNativeToString(const FunctionCallbackInfo<Value>& args) {
  Isolate* iso = args.GetIsolate();
  Local<Context> ctx = iso->GetCurrentContext();
  if (args.Length() < 1 || !args[0]->IsObject()) return;
  Local<Object> proto = args[0].As<Object>();
  if (!g_installed) {
    Local<Value> cur;
    if (proto->Get(ctx, String::NewFromUtf8Literal(iso, "toString")).ToLocal(&cur) && cur->IsFunction()) {
      g_orig_toString.Reset(iso, cur.As<Function>());
    }
    g_installed = true;
  }
  Local<Function> fn = Function::New(ctx, NativeToString).ToLocalChecked();
  fn->SetName(String::NewFromUtf8Literal(iso, "toString"));
  proto->Set(ctx, String::NewFromUtf8Literal(iso, "toString"), fn).FromJust();
}

static void Init(Local<Object> exports) {
  Isolate* iso = exports->GetIsolate();
  g_key.Reset(iso, v8::Symbol::New(iso, String::NewFromUtf8Literal(iso, "zseenv.nativeSrc")));
  g_tag.Reset(iso, v8::Symbol::New(iso, String::NewFromUtf8Literal(iso, "zseenv.taggedToString")));
  NODE_SET_METHOD(exports, "makeUndetectable", MakeUndetectable);
  NODE_SET_METHOD(exports, "registerNative", RegisterNative);
  NODE_SET_METHOD(exports, "installNativeToString", InstallNativeToString);
  // isolate 销毁前释放静态 Global 与 TplData，否则退出时会崩
  node::AddEnvironmentCleanupHook(
      iso,
      [](void*) {
        g_key.Reset();
        g_tag.Reset();
        g_orig_toString.Reset();
        if (g_data) {
          for (TplData* d : *g_data) { d->target.Reset(); delete d; }
          delete g_data;
          g_data = nullptr;
        }
      },
      nullptr);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
}  // namespace zseenv
