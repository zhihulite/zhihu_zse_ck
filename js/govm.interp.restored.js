// .probe/zsec/vm_interp.decompiled.js 的 AST 美化版（tools/beautify_govm.js）
// 标识符：p0=vm（VM 实例）  p1=acc（当前值/累加器）  l2=fr（帧基址）  l3..l15=r3..r15
// 标签：op<N> = opcode N 的入口（由 $B<label> 经 vm_isa_arms.json 的 switch(p1) 映射）
//       L<N>  = 非 opcode 入口的普通块
//
// VM 结构体字段（vm + 偏移）：
//   +20  pc（每进入一次 handler 自增 1）      +276 压栈类型标签   +280 压栈值
//   +296 操作数栈                            +308/+312 program ptr/len（10565）
//   +320 字符串池（101）                     +376/+380 分派表 ptr/len（8 字节/项）
//   +408 上次运算结果槽
// 压栈类型标签：71680 对象指针 / 71696 整数 / 71712 / 71744 / 71764 / 71780 布尔 /
//              71796 / 71820 / 253228 字符串·切片 / 295153 分隔符
// opcode -> 语义见 docs/GO_VM.md（35 条；js.Value.* 家族 13 条即「H 通道」）
function __main__0oOoOO___00oooO(vm, acc) {
  fr = sp - 3088;
  sp = fr;
  M32[fr + 1548] = 378;
  memFill(fr + 1552, 0, 1512);
  M32[vm + 20] = M32[vm + 20] + 1;
  r13 = M32[315324];
  M32[fr + 1544] = r13;
  M32[315324] = fr + 1544;
  B0: {
    B1: {
      B2: {
        op2: {
          B4: {
            B5: {
              B6: {
                B7: {
                  B8: {
                    B9: {
                      op34: {
                        op33: {
                          op32: {
                            op31: {
                              op30: {
                                op29: {
                                  op28: {
                                    op27: {
                                      op26: {
                                        op25: {
                                          op24: {
                                            op23: {
                                              op22: {
                                                op21: {
                                                  op20: {
                                                    op19: {
                                                      op18: {
                                                        op17: {
                                                          op16: {
                                                            op15: {
                                                              op14: {
                                                                op13: {
                                                                  op12: {
                                                                    op11: {
                                                                      op10: {
                                                                        op9: {
                                                                          op8: {
                                                                            op7: {
                                                                              op6: {
                                                                                op5: {
                                                                                  op4: {
                                                                                    op3: {
                                                                                      op1: {
                                                                                        op0: {
                                                                                          switch (acc) {
                                                                                            case 0:break op0;
                                                                                            case 1:break op1;
                                                                                            case 2:break op2;
                                                                                            case 3:break op3;
                                                                                            case 4:break op4;
                                                                                            case 5:break op5;
                                                                                            case 6:break op6;
                                                                                            case 7:break op7;
                                                                                            case 8:break op8;
                                                                                            case 9:break op9;
                                                                                            case 10:break op10;
                                                                                            case 11:break op11;
                                                                                            case 12:break op12;
                                                                                            case 13:break op13;
                                                                                            case 14:break op14;
                                                                                            case 15:break op15;
                                                                                            case 16:break op16;
                                                                                            case 17:break op17;
                                                                                            case 18:break op18;
                                                                                            case 19:break op19;
                                                                                            case 20:break op20;
                                                                                            case 21:break op21;
                                                                                            case 22:break op22;
                                                                                            case 23:break op23;
                                                                                            case 24:break op24;
                                                                                            case 25:break op25;
                                                                                            case 26:break op26;
                                                                                            case 27:break op27;
                                                                                            case 28:break op28;
                                                                                            case 29:break op29;
                                                                                            case 30:break op30;
                                                                                            case 31:break op31;
                                                                                            case 32:break op32;
                                                                                            case 33:break op33;
                                                                                            case 34:break op34;
                                                                                            default:break op2;
                                                                                          }
                                                                                        }
                                                                                        __main__0oOoOO___0ooO0o(fr + 56, vm);
                                                                                        r10 = M32[fr + 56];
                                                                                        M32[fr + 1552] = r10;
                                                                                        r7 = M32[fr + 60];
                                                                                        __main__0oOoOO___0ooO0o(fr + 48, vm);
                                                                                        r8 = M32[fr + 48];
                                                                                        M32[fr + 1556] = r8;
                                                                                        r3 = M32[vm + 408];
                                                                                        r9 = M32[fr + 52];
                                                                                        acc = 0;
                                                                                        M32[fr + 3064] = 0;
                                                                                        runtime_stringNext(fr + 32, r8, r9, fr + 3064);
                                                                                        if (!M8[fr + 32]) break B4;
                                                                                        if (r7) {
                                                                                          r4 = M32[fr + 40];
                                                                                          r5 = M32[fr + 36];
                                                                                          r11 = r7 === -1;
                                                                                          loop45: while (true) {
                                                                                            r5 = r5 % (r11 ? r5 === -2147483648 ? 1 : r7 : r7);
                                                                                            if (r5 >= r7) break B1;
                                                                                            runtime_stringFromUnicode(fr + 24, r3 ^ M8[r5 + r10] ^ r4);
                                                                                            r3 = M32[fr + 24];
                                                                                            M32[fr + 1560] = r3;
                                                                                            runtime_stringConcat(fr + 16, acc, r6, r3, M32[fr + 28]);
                                                                                            acc = M32[fr + 16];
                                                                                            M32[fr + 1568] = acc;
                                                                                            M32[fr + 1564] = acc;
                                                                                            r6 = M32[fr + 20];
                                                                                            runtime_stringNext(fr, r8, r9, fr + 3064);
                                                                                            r3 = r4;
                                                                                            r4 = M32[fr + 8];
                                                                                            r5 = M32[fr + 4];
                                                                                            if (M8[fr]) continue loop45;
                                                                                          }
                                                                                          break B4;
                                                                                        }
                                                                                        runtime_divideByZeroPanic();
                                                                                        throw new Error("unreachable");
                                                                                      }
                                                                                      __main__0oOoOO___oo0ooo(fr - -64, vm);
                                                                                      acc = M32[fr + 68];
                                                                                      M32[fr + 1612] = acc;
                                                                                      r3 = M32[fr + 64];
                                                                                      M32[fr + 1596] = r3;
                                                                                      M32[fr + 1604] = acc;
                                                                                      M32[fr + 1600] = acc;
                                                                                      if (r3 === 71780) {
                                                                                        M32[vm + 280] = acc;
                                                                                        M32[vm + 276] = 71696;
                                                                                        break op2;
                                                                                      }
                                                                                      if (r3 === 71764) {
                                                                                        acc = acc & 255;
                                                                                        M32[vm + 280] = acc;
                                                                                        M32[vm + 276] = 71696;
                                                                                        M32[fr + 1608] = acc;
                                                                                        break op2;
                                                                                      }
                                                                                      if (r3 !== 71696) break op2;
                                                                                      M32[vm + 280] = acc;
                                                                                      M32[vm + 276] = 71696;
                                                                                      break op2;
                                                                                    }
                                                                                    __main__0oOoOO___oo0ooo(fr + 112, vm);
                                                                                    acc = M32[fr + 116];
                                                                                    M32[fr + 1620] = acc;
                                                                                    r3 = M32[fr + 112];
                                                                                    M32[fr + 1616] = r3;
                                                                                    if (r3 === 71680) {
                                                                                      strconv_ParseUint(fr + 96, M32[acc], M32[acc + 4], 10, 64);
                                                                                      M64[fr + 1624] = M64[fr + 104];
                                                                                      r15 = M64[fr + 96];
                                                                                      acc = runtime_alloc(8);
                                                                                      M64[acc] = r15;
                                                                                      M32[vm + 280] = acc;
                                                                                      M32[vm + 276] = 71712;
                                                                                      M32[fr + 1632] = acc;
                                                                                      M32[fr + 1636] = acc;
                                                                                      break op2;
                                                                                    }
                                                                                    if (r3 !== 71780) break B5;
                                                                                    r3 = runtime_alloc(8);
                                                                                    M64[r3] = BigInt(acc);
                                                                                    M32[vm + 280] = r3;
                                                                                    M32[vm + 276] = 71728;
                                                                                    M32[fr + 1640] = r3;
                                                                                    M32[fr + 1644] = r3;
                                                                                    break op2;
                                                                                  }
                                                                                  __main__0oOoOO___oo0ooo(fr + 120, vm);
                                                                                  acc = M32[fr + 124];
                                                                                  M32[fr + 1652] = acc;
                                                                                  r3 = M32[fr + 120];
                                                                                  M32[fr + 1648] = r3;
                                                                                  if (r3 !== 71680) break B0;
                                                                                  r6 = M32[acc];
                                                                                  r4 = M32[315324];
                                                                                  M32[315324] = fr + 3064;
                                                                                  r3 = M32[acc + 4];
                                                                                  M64[fr + 3076] = 0;
                                                                                  M64[fr + 3068] = 3;
                                                                                  M32[fr + 3064] = r4;
                                                                                  r5 = runtime_alloc(r3);
                                                                                  memCopy(r5, r6, r3);
                                                                                  M32[315324] = r4;
                                                                                  M32[fr + 1656] = r5;
                                                                                  acc = runtime_alloc(12);
                                                                                  M32[acc + 8] = r3;
                                                                                  M32[acc + 4] = r3;
                                                                                  M32[acc] = r5;
                                                                                  M32[vm + 280] = acc;
                                                                                  M32[vm + 276] = 71744;
                                                                                  M32[fr + 1660] = acc;
                                                                                  M32[fr + 1664] = acc;
                                                                                  break op2;
                                                                                }
                                                                                acc = M32[vm + 296];
                                                                                M32[fr + 1668] = acc;
                                                                                M32[fr + 1672] = acc;
                                                                                r3 = M32[vm + 300];
                                                                                if (!r3) break B1;
                                                                                r3 = r3 - 1;
                                                                                r4 = acc + (r3 << 3);
                                                                                r5 = M32[r4];
                                                                                M32[fr + 1676] = r5;
                                                                                r6 = M32[r4 + 4];
                                                                                M32[fr + 1680] = r6;
                                                                                if (r5 === 71796) {
                                                                                  r4 = M32[r6 + 4];
                                                                                  M32[fr + 1684] = acc;
                                                                                  M32[fr + 1688] = acc;
                                                                                  if (r3 > M32[vm + 304]) break B9;
                                                                                  M32[vm + 300] = r3;
                                                                                  M32[vm + 280] = r4;
                                                                                  M32[vm + 276] = 71780;
                                                                                  M32[fr + 1692] = r4;
                                                                                  break op2;
                                                                                }
                                                                                M32[fr + 1700] = acc;
                                                                                M32[fr + 1696] = acc;
                                                                                r5 = M32[r4];
                                                                                M32[fr + 1704] = r5;
                                                                                r4 = M32[r4 + 4];
                                                                                M32[fr + 1708] = r4;
                                                                                if (r5 !== 71744) break op2;
                                                                                r4 = M32[r4 + 4];
                                                                                M32[fr + 1712] = acc;
                                                                                M32[fr + 1716] = acc;
                                                                                if (r3 > M32[vm + 304]) break B9;
                                                                                M32[vm + 300] = r3;
                                                                                M32[vm + 280] = r4;
                                                                                M32[vm + 276] = 71780;
                                                                                M32[fr + 1720] = r4;
                                                                                break op2;
                                                                              }
                                                                              acc = M32[vm + 296];
                                                                              M32[fr + 1724] = acc;
                                                                              M32[fr + 1728] = acc;
                                                                              r3 = M32[vm + 300];
                                                                              if (!r3) break B1;
                                                                              r4 = r3 - 1;
                                                                              r5 = acc + (r4 << 3);
                                                                              r3 = M32[r5];
                                                                              M32[fr + 1732] = r3;
                                                                              r5 = M32[r5 + 4];
                                                                              M32[fr + 1740] = acc;
                                                                              M32[fr + 1736] = r5;
                                                                              M32[fr + 1744] = acc;
                                                                              if (r4 > M32[vm + 304]) break B9;
                                                                              M32[vm + 300] = r4;
                                                                              acc = r5 & 255;
                                                                              M32[fr + 1756] = acc;
                                                                              M32[fr + 1752] = acc;
                                                                              M32[fr + 1748] = acc;
                                                                              if (r3 === 71696) {
                                                                                M32[vm + 280] = acc;
                                                                                M32[vm + 276] = 71764;
                                                                                break op2;
                                                                              }
                                                                              if (r3 === 71764) {
                                                                                M32[vm + 280] = acc;
                                                                                M32[vm + 276] = 71764;
                                                                                break op2;
                                                                              }
                                                                              if (r3 !== 71780) break op2;
                                                                              M32[vm + 280] = acc;
                                                                              M32[vm + 276] = 71764;
                                                                              break op2;
                                                                            }
                                                                            r3 = M32[vm + 296];
                                                                            M32[fr + 1760] = r3;
                                                                            M32[fr + 1764] = r3;
                                                                            r4 = M32[vm + 300];
                                                                            if (r4 < 3) break B1;
                                                                            r9 = r4 - 3;
                                                                            acc = r3 + (r9 << 3);
                                                                            r5 = M32[acc];
                                                                            M32[fr + 1768] = r5;
                                                                            acc = M32[acc + 4];
                                                                            M32[fr + 1780] = r3;
                                                                            M32[fr + 1776] = r3;
                                                                            M32[fr + 1772] = acc;
                                                                            r6 = (r4 << 3) + r3;
                                                                            r4 = r6 - 16;
                                                                            r7 = M32[r4];
                                                                            M32[fr + 1784] = r7;
                                                                            r4 = M32[r4 + 4];
                                                                            M32[fr + 1796] = r3;
                                                                            M32[fr + 1792] = r3;
                                                                            M32[fr + 1788] = r4;
                                                                            r6 = r6 - 8;
                                                                            r8 = M32[r6];
                                                                            M32[fr + 1800] = r8;
                                                                            r6 = M32[r6 + 4];
                                                                            M32[fr + 1808] = r3;
                                                                            M32[fr + 1804] = r6;
                                                                            M32[fr + 1812] = r3;
                                                                            if (r9 > M32[vm + 304]) break B9;
                                                                            M32[vm + 300] = r9;
                                                                            M32[315324] = fr + 3064;
                                                                            M32[fr + 3068] = 4;
                                                                            M32[fr + 3084] = 0;
                                                                            M32[fr + 3080] = 71780;
                                                                            M32[fr + 3076] = r6;
                                                                            M32[fr + 3072] = r8;
                                                                            r3 = fr + 1544;
                                                                            M32[fr + 3064] = r3;
                                                                            M32[315324] = r3;
                                                                            if (runtime_reflectValueEqual(r8, r6, 2, 71780, 0, 2) & 1) {
                                                                              if (r5 === 71744) {
                                                                                if (r7 !== 71764) break B0;
                                                                                M8[fr + 1527] = r4;
                                                                                runtime_sliceAppend(fr + 128, M32[acc], fr + 1527, M32[acc + 4], M32[acc + 8], 1, 1);
                                                                                r3 = M32[fr + 128];
                                                                                M32[fr + 1816] = r3;
                                                                                r15 = M64[fr + 132];
                                                                                acc = runtime_alloc(12);
                                                                                M64[acc + 4] = r15;
                                                                                M32[acc] = r3;
                                                                                M32[vm + 280] = acc;
                                                                                M32[vm + 276] = 71744;
                                                                                M32[fr + 1820] = acc;
                                                                                M32[fr + 1824] = acc;
                                                                                break op2;
                                                                              }
                                                                              if (r5 !== 71796) break op2;
                                                                              if (r7 !== 71696) break B0;
                                                                              M32[fr + 1520] = r4;
                                                                              runtime_sliceAppend(fr + 144, M32[acc], fr + 1520, M32[acc + 4], M32[acc + 8], 1, 4);
                                                                              r3 = M32[fr + 144];
                                                                              M32[fr + 1828] = r3;
                                                                              r15 = M64[fr + 148];
                                                                              acc = runtime_alloc(12);
                                                                              M64[acc + 4] = r15;
                                                                              M32[acc] = r3;
                                                                              M32[vm + 280] = acc;
                                                                              M32[vm + 276] = 71796;
                                                                              M32[fr + 1832] = acc;
                                                                              M32[fr + 1836] = acc;
                                                                              break op2;
                                                                            }
                                                                            r3 = sp - 32;
                                                                            sp = r3;
                                                                            M32[r3 + 12] = 4;
                                                                            M32[r3 + 28] = 1;
                                                                            M32[r3 + 24] = 71780;
                                                                            M32[r3 + 20] = r6;
                                                                            M32[r3 + 16] = r8;
                                                                            r9 = M32[315324];
                                                                            M32[315324] = r3 + 8;
                                                                            M32[r3 + 8] = r9;
                                                                            M32[315324] = r9;
                                                                            sp = r3 + 32;
                                                                            if (!(runtime_reflectValueEqual(r8, r6, 2, 71780, 1, 2) & 1)) break op2;
                                                                            if (r5 === 71744) {
                                                                              if (r7 !== 71744) break B0;
                                                                              runtime_sliceAppend(fr + 160, M32[acc], M32[r4], M32[acc + 4], M32[acc + 8], M32[r4 + 4], 1);
                                                                              r3 = M32[fr + 160];
                                                                              M32[fr + 1840] = r3;
                                                                              r15 = M64[fr + 164];
                                                                              acc = runtime_alloc(12);
                                                                              M64[acc + 4] = r15;
                                                                              M32[acc] = r3;
                                                                              M32[vm + 280] = acc;
                                                                              M32[vm + 276] = 71744;
                                                                              M32[fr + 1844] = acc;
                                                                              M32[fr + 1848] = acc;
                                                                              break op2;
                                                                            }
                                                                            if (r5 === 71796) {
                                                                              if (r7 !== 71796) break B0;
                                                                              runtime_sliceAppend(fr + 176, M32[acc], M32[r4], M32[acc + 4], M32[acc + 8], M32[r4 + 4], 4);
                                                                              r3 = M32[fr + 176];
                                                                              M32[fr + 1852] = r3;
                                                                              r15 = M64[fr + 180];
                                                                              acc = runtime_alloc(12);
                                                                              M64[acc + 4] = r15;
                                                                              M32[acc] = r3;
                                                                              M32[vm + 280] = acc;
                                                                              M32[vm + 276] = 71796;
                                                                              M32[fr + 1856] = acc;
                                                                              M32[fr + 1860] = acc;
                                                                              break op2;
                                                                            }
                                                                            if (r5 !== 295176) break op2;
                                                                            break B0;
                                                                          }
                                                                          acc = M32[vm + 296];
                                                                          M32[fr + 1864] = acc;
                                                                          M32[fr + 1868] = acc;
                                                                          r3 = M32[vm + 300];
                                                                          if (r3 < 3) break B1;
                                                                          r6 = r3 - 3;
                                                                          r4 = acc + (r6 << 3);
                                                                          r7 = M32[r4];
                                                                          M32[fr + 1872] = r7;
                                                                          r4 = M32[r4 + 4];
                                                                          M32[fr + 1884] = acc;
                                                                          M32[fr + 1880] = acc;
                                                                          M32[fr + 1876] = r4;
                                                                          r5 = (r3 << 3) + acc;
                                                                          r3 = r5 - 16;
                                                                          r8 = M32[r3];
                                                                          M32[fr + 1888] = r8;
                                                                          r3 = M32[r3 + 4];
                                                                          M32[fr + 1892] = r3;
                                                                          if (r8 !== 71696) break B0;
                                                                          M32[fr + 1900] = acc;
                                                                          M32[fr + 1896] = acc;
                                                                          r5 = r5 - 8;
                                                                          r8 = M32[r5];
                                                                          M32[fr + 1904] = r8;
                                                                          r5 = M32[r5 + 4];
                                                                          M32[fr + 1908] = r5;
                                                                          if (r8 !== 71696) break B0;
                                                                          if (r7 !== 71744) break op2;
                                                                          r7 = M32[r4 + 8];
                                                                          r4 = M32[r4];
                                                                          M32[fr + 1912] = acc;
                                                                          M32[fr + 1916] = acc;
                                                                          if (r6 > M32[vm + 304]) break B9;
                                                                          M32[vm + 300] = r6;
                                                                          if (r3 > r5 | r5 > r7) break B9;
                                                                          acc = runtime_alloc(12);
                                                                          M32[acc + 8] = r7 - r3;
                                                                          M32[acc + 4] = r5 - r3;
                                                                          M32[acc] = r3 + r4;
                                                                          M32[vm + 280] = acc;
                                                                          M32[vm + 276] = 71744;
                                                                          M32[fr + 1920] = acc;
                                                                          M32[fr + 1924] = acc;
                                                                          break op2;
                                                                        }
                                                                        acc = M32[vm + 296];
                                                                        M32[fr + 1928] = acc;
                                                                        M32[fr + 1932] = acc;
                                                                        r3 = M32[vm + 300];
                                                                        if (r3 < 2) break B1;
                                                                        r3 = (r3 << 3) + acc;
                                                                        r4 = r3 - 16;
                                                                        r5 = M32[r4];
                                                                        M32[fr + 1936] = r5;
                                                                        r4 = M32[r4 + 4];
                                                                        M32[fr + 1940] = r4;
                                                                        if (r5 !== 71780) break B0;
                                                                        M32[fr + 1948] = acc;
                                                                        M32[fr + 1944] = acc;
                                                                        acc = r3 - 8;
                                                                        r3 = M32[acc];
                                                                        M32[fr + 1952] = r3;
                                                                        acc = M32[acc + 4];
                                                                        M32[fr + 1956] = acc;
                                                                        if (r3 !== 71780) break B0;
                                                                        B56: {
                                                                          B57: {
                                                                            switch (r4) {
                                                                              case 0:break B57;
                                                                              case 1:break B56;
                                                                              default:break op2;
                                                                            }
                                                                          }
                                                                          if (acc < 0) break B9;
                                                                          r4 = runtime_alloc(acc);
                                                                          M32[fr + 1960] = r4;
                                                                          r3 = runtime_alloc(12);
                                                                          M32[r3 + 8] = acc;
                                                                          M32[r3 + 4] = acc;
                                                                          M32[r3] = r4;
                                                                          M32[vm + 280] = r3;
                                                                          M32[vm + 276] = 71744;
                                                                          M32[fr + 1964] = r3;
                                                                          M32[fr + 1968] = r3;
                                                                          break op2;
                                                                        }
                                                                        if (acc > 1073741823) break B9;
                                                                        r4 = runtime_alloc(acc << 2);
                                                                        M32[fr + 1972] = r4;
                                                                        r3 = runtime_alloc(12);
                                                                        M32[r3 + 8] = acc;
                                                                        M32[r3 + 4] = acc;
                                                                        M32[r3] = r4;
                                                                        M32[vm + 280] = r3;
                                                                        M32[vm + 276] = 71796;
                                                                        M32[fr + 1976] = r3;
                                                                        M32[fr + 1980] = r3;
                                                                        break op2;
                                                                      }
                                                                      acc = M32[vm + 296];
                                                                      M32[fr + 1984] = acc;
                                                                      M32[fr + 1988] = acc;
                                                                      r3 = M32[vm + 300];
                                                                      if (!r3) break B1;
                                                                      r4 = r3 - 1;
                                                                      r3 = acc + (r4 << 3);
                                                                      r5 = M32[r3];
                                                                      M32[fr + 1992] = r5;
                                                                      r3 = M32[r3 + 4];
                                                                      M32[fr + 2000] = acc;
                                                                      M32[fr + 1996] = r3;
                                                                      M32[fr + 2004] = acc;
                                                                      if (r4 > M32[vm + 304]) break B9;
                                                                      M32[vm + 300] = r4;
                                                                      if (r5 === 71696) {
                                                                        runtime_stringFromUnicode(fr + 192, r3);
                                                                        r3 = M32[fr + 192];
                                                                        M32[fr + 2008] = r3;
                                                                        r4 = M32[fr + 196];
                                                                        acc = runtime_alloc(8);
                                                                        M32[acc + 4] = r4;
                                                                        M32[acc] = r3;
                                                                        M32[vm + 280] = acc;
                                                                        M32[vm + 276] = 71680;
                                                                        M32[fr + 2012] = acc;
                                                                        M32[fr + 2016] = acc;
                                                                        break op2;
                                                                      }
                                                                      if (r5 !== 71764) break op2;
                                                                      runtime_stringFromUnicode(fr + 200, i8(r3));
                                                                      r3 = M32[fr + 200];
                                                                      M32[fr + 2020] = r3;
                                                                      r4 = M32[fr + 204];
                                                                      acc = runtime_alloc(8);
                                                                      M32[acc + 4] = r4;
                                                                      M32[acc] = r3;
                                                                      M32[vm + 280] = acc;
                                                                      M32[vm + 276] = 71680;
                                                                      M32[fr + 2024] = acc;
                                                                      M32[fr + 2028] = acc;
                                                                      break op2;
                                                                    }
                                                                    __main__0oOoOO___0ooO0o(fr + 272, vm);
                                                                    r5 = M32[fr + 272];
                                                                    M32[fr + 2032] = r5;
                                                                    r6 = M32[fr + 276];
                                                                    __main__0oOoOO___0ooO0o(fr + 264, vm);
                                                                    acc = M32[fr + 264];
                                                                    M32[fr + 2036] = acc;
                                                                    r3 = M32[vm + 400];
                                                                    M32[fr + 2040] = r3;
                                                                    _syscall_js_Value__Get(fr + 248, M64[vm + 392], r3, acc, M32[fr + 268]);
                                                                    r3 = M32[fr + 256];
                                                                    M32[fr + 2080] = r3;
                                                                    M32[fr + 2060] = r3;
                                                                    M32[fr + 2044] = r3;
                                                                    r15 = M64[fr + 248];
                                                                    __main__0oOoOO___0ooO0o(fr + 240, vm);
                                                                    r4 = M32[fr + 240];
                                                                    M32[fr + 2048] = r4;
                                                                    r7 = M32[fr + 244];
                                                                    acc = runtime_alloc(8);
                                                                    M32[acc + 4] = r7;
                                                                    M32[acc] = r4;
                                                                    M32[fr + 2052] = acc;
                                                                    M32[fr + 2056] = acc;
                                                                    r4 = _syscall_js_Value__Type(r15);
                                                                    if ((r4 & 6) !== 6) break B8;
                                                                    syscall_js_ValueOf(fr + 224, 71680, acc);
                                                                    r4 = M32[fr + 232];
                                                                    M32[fr + 2092] = r4;
                                                                    M32[fr + 2072] = r4;
                                                                    l16 = M64[fr + 224];
                                                                    acc = runtime_alloc(8);
                                                                    l17 = r15 - 1022;
                                                                    M64[acc] = l17;
                                                                    M32[fr + 2076] = acc;
                                                                    syscall_js_copyBytesToGo(fr + 208, 1022, l17, l16, r5, r6, 0, acc, 1, 1, 315320, 0, 0, fr);
                                                                    acc = runtime_alloc(16);
                                                                    M64[acc] = r15;
                                                                    M32[acc + 8] = r3;
                                                                    M32[fr + 2084] = acc;
                                                                    M32[fr + 2088] = acc;
                                                                    acc = runtime_alloc(16);
                                                                    M64[acc] = l16;
                                                                    M32[acc + 8] = r4;
                                                                    M32[fr + 2096] = acc;
                                                                    M32[fr + 2100] = acc;
                                                                    break op2;
                                                                  }
                                                                  __main__0oOoOO___0ooO0o(fr + 328, vm);
                                                                  acc = M32[fr + 328];
                                                                  M32[fr + 2104] = acc;
                                                                  r3 = M32[fr + 332];
                                                                  __main__0oOoOO___0ooO0o(fr + 320, vm);
                                                                  r4 = M32[fr + 320];
                                                                  M32[fr + 2108] = r4;
                                                                  r5 = M32[vm + 400];
                                                                  M32[fr + 2112] = r5;
                                                                  _syscall_js_Value__Get(fr + 304, M64[vm + 392], r5, r4, M32[fr + 324]);
                                                                  r4 = M32[fr + 312];
                                                                  M32[fr + 2116] = r4;
                                                                  _syscall_js_Value__Get(fr + 288, M64[fr + 304], r4, acc, r3);
                                                                  acc = M32[fr + 296];
                                                                  M32[fr + 2120] = acc;
                                                                  _syscall_js_Value__String(fr + 280, M64[fr + 288], acc);
                                                                  r3 = M32[fr + 280];
                                                                  M32[fr + 2124] = r3;
                                                                  r4 = M32[fr + 284];
                                                                  acc = runtime_alloc(8);
                                                                  M32[acc + 4] = r4;
                                                                  M32[acc] = r3;
                                                                  M32[vm + 280] = acc;
                                                                  M32[vm + 276] = 71680;
                                                                  M32[fr + 2128] = acc;
                                                                  M32[fr + 2132] = acc;
                                                                  break op2;
                                                                }
                                                                acc = M32[vm + 296];
                                                                M32[fr + 2136] = acc;
                                                                M32[fr + 2140] = acc;
                                                                r3 = M32[vm + 300];
                                                                if (!r3) break B1;
                                                                r3 = r3 - 1;
                                                                r4 = acc + (r3 << 3);
                                                                r8 = M32[r4];
                                                                M32[fr + 2144] = r8;
                                                                r7 = M32[r4 + 4];
                                                                M32[fr + 2152] = acc;
                                                                M32[fr + 2148] = r7;
                                                                M32[fr + 2156] = acc;
                                                                if (r3 > M32[vm + 304]) break B9;
                                                                M32[vm + 300] = r3;
                                                                if (M8[315136]) break B7;
                                                                M8[315136] = 1;
                                                                M32[fr + 3064] = 0;
                                                                M32[fr + 1536] = 315136;
                                                                B59: {
                                                                  if (M8[315132]) {
                                                                    __sync_Mutex__Unlock(315136);
                                                                    break B59;
                                                                  }
                                                                  r3 = 0;
                                                                  M8[315132] = 1;
                                                                  r6 = runtime_alloc(8192);
                                                                  M32[fr + 2160] = r6;
                                                                  M32[fr + 2164] = r6;
                                                                  loop61: while (true) {
                                                                    r4 = 8;
                                                                    acc = r3;
                                                                    loop62: while (true) {
                                                                      r5 = acc >>> 1;
                                                                      acc = acc & 1 ? r5 ^ -306674912 : r5;
                                                                      r4 = r4 - 1;
                                                                      if (r4) continue loop62;
                                                                    }
                                                                    M32[r6 + (r3 << 2)] = acc;
                                                                    r3 = r3 + 1;
                                                                    if (r3 !== 256) continue loop61;
                                                                  }
                                                                  r3 = 0;
                                                                  r5 = r6;
                                                                  loop63: while (true) {
                                                                    acc = M32[r6 + (r3 << 2)];
                                                                    r4 = 1024;
                                                                    loop64: while (true) {
                                                                      acc = M32[r6 + ((acc & 255) << 2)] ^ acc >>> 8;
                                                                      M32[r4 + r5] = acc;
                                                                      r4 = r4 + 1024;
                                                                      if (r4 !== 8192) continue loop64;
                                                                    }
                                                                    r5 = r5 + 4;
                                                                    r3 = r3 + 1;
                                                                    if (r3 !== 256) continue loop63;
                                                                  }
                                                                  M32[315128] = 105;
                                                                  M32[315120] = r6;
                                                                  r4 = fr + 1536;
                                                                  r5 = fr + 3064;
                                                                  loop65: while (true) {
                                                                    acc = M32[r5];
                                                                    __sync_Mutex__Unlock(M32[r4]);
                                                                    r5 = acc + 4;
                                                                    r4 = acc + 8;
                                                                    if (acc) continue loop65;
                                                                  }
                                                                }
                                                                r3 = runtime_alloc(8);
                                                                M32[r3 + 4] = 313220;
                                                                M32[r3] = 0;
                                                                M32[fr + 2176] = r3;
                                                                M32[fr + 2180] = r3;
                                                                M32[fr + 2172] = r3;
                                                                M32[fr + 2168] = r3;
                                                                if (r8 !== 71680) break B0;
                                                                r6 = M32[r7];
                                                                r4 = M32[315324];
                                                                M32[315324] = fr + 3064;
                                                                r5 = M32[r7 + 4];
                                                                M64[fr + 3076] = 0;
                                                                M64[fr + 3068] = 3;
                                                                M32[fr + 3064] = r4;
                                                                acc = runtime_alloc(r5);
                                                                memCopy(acc, r6, r5);
                                                                M32[315324] = r4;
                                                                M32[fr + 2184] = acc;
                                                                r6 = M32[r3 + 4];
                                                                M32[fr + 2196] = r6;
                                                                M32[fr + 2188] = r6;
                                                                B66: {
                                                                  if (r6 === 313220) {
                                                                    r4 = M32[315128];
                                                                    M32[fr + 2192] = r4;
                                                                    if (!r4) break B2;
                                                                    break B66;
                                                                  }
                                                                  r3 = M32[r3];
                                                                  if (r5 <= 0) break B66;
                                                                  if (!r6) break B2;
                                                                  r4 = r3 ^ -1;
                                                                  loop68: while (true) {
                                                                    r4 = M32[r6 + (((M8[acc] ^ r4) & 255) << 2)] ^ r4 >>> 8;
                                                                    acc = acc + 1;
                                                                    r5 = r5 - 1;
                                                                    if (r5) continue loop68;
                                                                  }
                                                                }
                                                                acc = r4 ^ -1;
                                                                M32[hash_crc32_ieeeInit$1(M32[r3], acc, r5, r5, fr)] = acc;
                                                                strconv_FormatInt(fr + 344, BigInt(acc), 16);
                                                                acc = M32[fr + 344];
                                                                M32[fr + 2204] = acc;
                                                                M32[fr + 2200] = acc;
                                                                r4 = M32[fr + 348];
                                                                if (8 - r4 > 0) {
                                                                  r5 = 9 - r4;
                                                                  loop70: while (true) {
                                                                    runtime_stringConcat(fr + 336, 253248, 1, acc, r4);
                                                                    acc = M32[fr + 336];
                                                                    M32[fr + 2212] = acc;
                                                                    M32[fr + 2208] = acc;
                                                                    r4 = M32[fr + 340];
                                                                    r5 = r5 - 1;
                                                                    if (r5 > 1) continue loop70;
                                                                  }
                                                                }
                                                                r3 = runtime_alloc(8);
                                                                M32[r3 + 4] = r4;
                                                                M32[r3] = acc;
                                                                M32[vm + 280] = r3;
                                                                M32[vm + 276] = 71680;
                                                                M32[fr + 2216] = r3;
                                                                M32[fr + 2220] = r3;
                                                                break op2;
                                                              }
                                                              __main__0oOoOO___0ooO0o(fr + 408, vm);
                                                              acc = M32[fr + 408];
                                                              M32[fr + 2224] = acc;
                                                              r3 = M32[fr + 412];
                                                              __main__0oOoOO___0ooO0o(fr + 400, vm);
                                                              r4 = M32[fr + 400];
                                                              M32[fr + 2228] = r4;
                                                              r5 = M32[vm + 400];
                                                              M32[fr + 2232] = r5;
                                                              _syscall_js_Value__Get(fr + 384, M64[vm + 392], r5, r4, M32[fr + 404]);
                                                              r4 = M32[fr + 392];
                                                              M32[fr + 2236] = r4;
                                                              _syscall_js_Value__Call(fr + 368, M64[fr + 384], r4, acc, r3, 0, 0);
                                                              acc = M32[fr + 376];
                                                              M32[fr + 2240] = acc;
                                                              _syscall_js_Value__String(fr + 360, M64[fr + 368], acc);
                                                              acc = M32[fr + 360];
                                                              M32[fr + 2244] = acc;
                                                              strings_Replace(fr + 352, acc, M32[fr + 364], 71816);
                                                              r3 = M32[fr + 352];
                                                              M32[fr + 2252] = r3;
                                                              M32[fr + 2248] = r3;
                                                              r4 = M32[fr + 356];
                                                              acc = runtime_alloc(8);
                                                              M32[acc + 4] = r4;
                                                              M32[acc] = r3;
                                                              M32[vm + 280] = acc;
                                                              M32[vm + 276] = 71680;
                                                              M32[fr + 2256] = acc;
                                                              M32[fr + 2260] = acc;
                                                              break op2;
                                                            }
                                                            __main__0oOoOO___0ooO0o(fr + 480, vm);
                                                            acc = M32[fr + 480];
                                                            M32[fr + 2264] = acc;
                                                            r3 = M32[fr + 484];
                                                            __main__0oOoOO___0ooO0o(fr + 472, vm);
                                                            r4 = M32[fr + 472];
                                                            M32[fr + 2268] = r4;
                                                            r5 = M32[vm + 400];
                                                            M32[fr + 2272] = r5;
                                                            _syscall_js_Value__Get(fr + 456, M64[vm + 392], r5, r4, M32[fr + 476]);
                                                            r4 = M32[fr + 464];
                                                            M32[fr + 2276] = r4;
                                                            _syscall_js_Value__Get(fr + 440, M64[fr + 456], r4, acc, r3);
                                                            r4 = M32[fr + 448];
                                                            M32[fr + 2280] = r4;
                                                            _syscall_js_Value__Call(fr + 424, M64[fr + 440], r4, acc, r3, 0, 0);
                                                            acc = M32[fr + 432];
                                                            M32[fr + 2284] = acc;
                                                            _syscall_js_Value__String(fr + 416, M64[fr + 424], acc);
                                                            r3 = M32[fr + 416];
                                                            M32[fr + 2288] = r3;
                                                            r4 = M32[fr + 420];
                                                            acc = runtime_alloc(8);
                                                            M32[acc + 4] = r4;
                                                            M32[acc] = r3;
                                                            M32[vm + 280] = acc;
                                                            M32[vm + 276] = 71680;
                                                            M32[fr + 2292] = acc;
                                                            M32[fr + 2296] = acc;
                                                            break op2;
                                                          }
                                                          acc = M32[vm + 296];
                                                          M32[fr + 2300] = acc;
                                                          M32[fr + 2304] = acc;
                                                          r3 = M32[vm + 300];
                                                          if (r3 < 2) break B1;
                                                          r4 = r3 - 2;
                                                          r5 = acc + (r4 << 3);
                                                          r6 = M32[r5];
                                                          M32[fr + 2308] = r6;
                                                          r5 = M32[r5 + 4];
                                                          M32[fr + 2312] = r5;
                                                          if (r6 !== 71680) break B0;
                                                          r6 = M32[r5 + 4];
                                                          M32[fr + 2320] = acc;
                                                          M32[fr + 2316] = acc;
                                                          r3 = (r3 << 3) + acc - 8;
                                                          r7 = M32[r3];
                                                          M32[fr + 2324] = r7;
                                                          r3 = M32[r3 + 4];
                                                          M32[fr + 2328] = r3;
                                                          if (r7 !== 71680) break B0;
                                                          r7 = M32[r3 + 4];
                                                          r3 = M32[r3];
                                                          M32[fr + 2332] = acc;
                                                          M32[fr + 2336] = acc;
                                                          if (r4 > M32[vm + 304]) break B9;
                                                          M32[vm + 300] = r4;
                                                          acc = strings_Index(M32[r5], r6, r3, r7);
                                                          M32[vm + 276] = 71820;
                                                          acc = (acc ^ -1) >>> 31;
                                                          M32[vm + 280] = acc;
                                                          M32[fr + 2340] = acc;
                                                          break op2;
                                                        }
                                                        __main__0oOoOO___0ooO0o(fr + 584, vm);
                                                        r5 = M32[fr + 584];
                                                        M32[fr + 2344] = r5;
                                                        r6 = M32[fr + 588];
                                                        __main__0oOoOO___0ooO0o(fr + 576, vm);
                                                        r7 = M32[fr + 576];
                                                        M32[fr + 2348] = r7;
                                                        r8 = M32[fr + 580];
                                                        __main__0oOoOO___0ooO0o(fr + 568, vm);
                                                        r9 = M32[fr + 568];
                                                        M32[fr + 2352] = r9;
                                                        acc = M32[vm + 412];
                                                        M32[fr + 2356] = acc;
                                                        r10 = M32[fr + 572];
                                                        __encoding_base64_Encoding__DecodeString(fr + 544, acc, 71836, 181388);
                                                        M64[fr + 2364] = M64[fr + 556];
                                                        r11 = M32[fr + 544];
                                                        M32[fr + 2360] = r11;
                                                        r12 = vm + 400;
                                                        r14 = M32[r12];
                                                        M32[fr + 2372] = r14;
                                                        acc = M32[315324];
                                                        M32[315324] = fr + 3064;
                                                        r15 = M64[vm + 392];
                                                        r3 = M32[fr + 548];
                                                        M64[fr + 3076] = 0;
                                                        M64[fr + 3068] = 3;
                                                        M32[fr + 3064] = acc;
                                                        r4 = runtime_alloc(r3);
                                                        memCopy(r4, r11, r3);
                                                        M32[315324] = acc;
                                                        M32[fr + 2376] = r4;
                                                        acc = runtime_alloc(8);
                                                        M32[acc + 4] = r3;
                                                        M32[acc] = r4;
                                                        M32[fr + 2380] = acc;
                                                        M32[fr + 2384] = acc;
                                                        M32[fr + 1516] = acc;
                                                        M32[fr + 1512] = 71680;
                                                        _syscall_js_Value__Call(fr + 528, r15, r14, r9, r10, fr + 1512, 1);
                                                        M32[fr + 2388] = M32[fr + 536];
                                                        acc = M32[r12];
                                                        M32[fr + 2392] = acc;
                                                        _syscall_js_Value__Get(fr + 512, M64[vm + 392], acc, r7, r8);
                                                        acc = M32[fr + 520];
                                                        M32[fr + 2396] = acc;
                                                        _syscall_js_Value__Get(fr + 496, M64[fr + 512], acc, r5, r6);
                                                        acc = M32[fr + 504];
                                                        M32[fr + 2400] = acc;
                                                        _syscall_js_Value__String(fr + 488, M64[fr + 496], acc);
                                                        r3 = M32[fr + 488];
                                                        M32[fr + 2404] = r3;
                                                        r4 = M32[fr + 492];
                                                        acc = runtime_alloc(8);
                                                        M32[acc + 4] = r4;
                                                        M32[acc] = r3;
                                                        M32[vm + 280] = acc;
                                                        M32[vm + 276] = 71680;
                                                        M32[fr + 2408] = acc;
                                                        M32[fr + 2412] = acc;
                                                        break op2;
                                                      }
                                                      acc = M32[vm + 296];
                                                      M32[fr + 2416] = acc;
                                                      M32[fr + 2420] = acc;
                                                      r3 = M32[vm + 300];
                                                      if (!r3) break B1;
                                                      r4 = r3 - 1;
                                                      r3 = acc + (r4 << 3);
                                                      r5 = M32[r3];
                                                      M32[fr + 2424] = r5;
                                                      r3 = M32[r3 + 4];
                                                      M32[fr + 2432] = acc;
                                                      M32[fr + 2428] = r3;
                                                      M32[fr + 2436] = acc;
                                                      if (r4 > M32[vm + 304]) break B9;
                                                      M32[vm + 300] = r4;
                                                      if (r5 !== 71680) break B0;
                                                      __encoding_base64_Encoding__DecodeString(fr + 592, 312892, M32[r3], M32[r3 + 4]);
                                                      M64[fr + 2444] = M64[fr + 604];
                                                      r5 = M32[fr + 592];
                                                      M32[fr + 2440] = r5;
                                                      acc = M32[315324];
                                                      M32[315324] = fr + 3064;
                                                      r3 = M32[fr + 596];
                                                      M64[fr + 3076] = 0;
                                                      M64[fr + 3068] = 3;
                                                      M32[fr + 3064] = acc;
                                                      r4 = runtime_alloc(r3);
                                                      memCopy(r4, r5, r3);
                                                      M32[315324] = acc;
                                                      M32[fr + 2452] = r4;
                                                      acc = runtime_alloc(8);
                                                      M32[acc + 4] = r3;
                                                      M32[acc] = r4;
                                                      M32[vm + 280] = acc;
                                                      M32[vm + 276] = 71680;
                                                      M32[fr + 2456] = acc;
                                                      M32[fr + 2460] = acc;
                                                      break op2;
                                                    }
                                                    __main__0oOoOO___0ooO0o(fr + 632, vm);
                                                    acc = M32[fr + 632];
                                                    M32[fr + 2464] = acc;
                                                    strings_Split(fr + 616, acc, M32[fr + 636], 253224);
                                                    r3 = M32[fr + 616];
                                                    M32[fr + 2468] = r3;
                                                    r15 = M64[fr + 620];
                                                    acc = runtime_alloc(12);
                                                    M64[acc + 4] = r15;
                                                    M32[acc] = r3;
                                                    M32[vm + 280] = acc;
                                                    M32[vm + 276] = 253228;
                                                    M32[fr + 2472] = acc;
                                                    M32[fr + 2476] = acc;
                                                    break op2;
                                                  }
                                                  acc = M32[vm + 296];
                                                  M32[fr + 2480] = acc;
                                                  M32[fr + 2484] = acc;
                                                  r3 = M32[vm + 300];
                                                  if (!r3) break B1;
                                                  r3 = r3 - 1;
                                                  r4 = acc + (r3 << 3);
                                                  r5 = M32[r4];
                                                  M32[fr + 2488] = r5;
                                                  r4 = M32[r4 + 4];
                                                  M32[fr + 2492] = r4;
                                                  if (r5 !== 71680) break B0;
                                                  r7 = M32[r4 + 4];
                                                  r8 = M32[r4];
                                                  M32[fr + 2496] = acc;
                                                  M32[fr + 2500] = acc;
                                                  if (r3 > M32[vm + 304]) break B9;
                                                  M32[vm + 300] = r3;
                                                  if (r7 >= 4) {
                                                    acc = runtime_alloc(8);
                                                    M32[acc + 4] = 4;
                                                    M32[acc] = r8;
                                                    M32[vm + 280] = acc;
                                                    M32[vm + 276] = 71680;
                                                    M32[fr + 2504] = acc;
                                                    M32[fr + 2508] = acc;
                                                    break op2;
                                                  }
                                                  r9 = fr + 648;
                                                  acc = sp + -64;
                                                  sp = acc;
                                                  M32[acc + 4] = 13;
                                                  memFill(acc + 8, 0, 52);
                                                  r10 = M32[315324];
                                                  M32[acc] = r10;
                                                  M32[315324] = acc;
                                                  B72: {
                                                    r6 = 4 - r7;
                                                    if (r6 >= 0) {
                                                      r3 = runtime_alloc(16);
                                                      M32[acc + 8] = r3;
                                                      __strings_Builder__Grow(r3, r6);
                                                      __strings_Builder__WriteString(r3, 253248, 1);
                                                      M64[acc + 12] = 0;
                                                      r4 = M32[r3 + 4];
                                                      M32[acc + 20] = r4;
                                                      B74: {
                                                        B75: {
                                                          r5 = M32[r3 + 8];
                                                          if (r5 >= r6) break B75;
                                                          r11 = r6 >>> 1;
                                                          loop76: while (true) {
                                                            B77: {
                                                              M32[acc + 28] = r4;
                                                              M32[acc + 24] = r4;
                                                              if (r5 > r11) break B77;
                                                              __strings_Builder__WriteString(r3, r4, r5);
                                                              M64[acc + 32] = 0;
                                                              r4 = M32[r3 + 4];
                                                              M32[acc + 40] = r4;
                                                              r5 = M32[r3 + 8];
                                                              if (r5 < r6) continue loop76;
                                                              break B75;
                                                            }
                                                          }
                                                          M32[acc + 44] = r4;
                                                          r5 = r6 - r5;
                                                          if (r5 < r5) break B74;
                                                          __strings_Builder__WriteString(r3, r4, r5);
                                                          r5 = M32[r3 + 8];
                                                          r4 = M32[r3 + 4];
                                                        }
                                                        M32[315324] = r10;
                                                        M32[r9 + 4] = r5;
                                                        M32[r9] = r4;
                                                        sp = acc - -64;
                                                        break B72;
                                                      }
                                                      runtime_slicePanic();
                                                      throw new Error("unreachable");
                                                    }
                                                    runtime__panic(71680, 70760);
                                                    throw new Error("unreachable");
                                                  }
                                                  acc = M32[fr + 648];
                                                  M32[fr + 2512] = acc;
                                                  if (r7 < 4) break B9;
                                                  runtime_stringConcat(fr + 640, acc, M32[fr + 652], r8, 4);
                                                  r3 = M32[fr + 640];
                                                  M32[fr + 2516] = r3;
                                                  r4 = M32[fr + 644];
                                                  acc = runtime_alloc(8);
                                                  M32[acc + 4] = r4;
                                                  M32[acc] = r3;
                                                  M32[vm + 280] = acc;
                                                  M32[vm + 276] = 71680;
                                                  M32[fr + 2520] = acc;
                                                  M32[fr + 2524] = acc;
                                                  break op2;
                                                }
                                                acc = M32[vm + 296];
                                                M32[fr + 2528] = acc;
                                                M32[fr + 2532] = acc;
                                                r3 = M32[vm + 300];
                                                if (!r3) break B1;
                                                r3 = r3 - 1;
                                                r4 = acc + (r3 << 3);
                                                r5 = M32[r4];
                                                M32[fr + 2536] = r5;
                                                r4 = M32[r4 + 4];
                                                M32[fr + 2540] = r4;
                                                if (r5 !== 71680) break B0;
                                                r5 = M32[r4 + 4];
                                                r4 = M32[r4];
                                                M32[fr + 2544] = acc;
                                                M32[fr + 2548] = acc;
                                                if (r3 > M32[vm + 304]) break B9;
                                                M32[vm + 300] = r3;
                                                if (r5 < 4) break B9;
                                                acc = runtime_alloc(8);
                                                M32[acc + 4] = 4;
                                                M32[vm + 280] = acc;
                                                M32[vm + 276] = 71680;
                                                M32[acc] = r4 + r5 - 4;
                                                M32[fr + 2552] = acc;
                                                M32[fr + 2556] = acc;
                                                break op2;
                                              }
                                              __main__0oOoOO___0ooO0o(fr + 760, vm);
                                              r3 = M32[fr + 760];
                                              M32[fr + 2560] = r3;
                                              r5 = M32[fr + 764];
                                              __main__0oOoOO___0ooO0o(fr + 752, vm);
                                              r6 = M32[fr + 752];
                                              M32[fr + 2564] = r6;
                                              r7 = M32[fr + 756];
                                              __main__0oOoOO___0ooO0o(fr + 744, vm);
                                              r8 = M32[fr + 744];
                                              M32[fr + 2568] = r8;
                                              r9 = M32[fr + 748];
                                              __main__0oOoOO___0ooO0o(fr + 736, vm);
                                              r10 = M32[fr + 736];
                                              M32[fr + 2572] = r10;
                                              r11 = M32[fr + 740];
                                              __main__0oOoOO___0ooO0o(fr + 728, vm);
                                              acc = M32[fr + 728];
                                              M32[fr + 2576] = acc;
                                              r12 = M32[vm + 400];
                                              M32[fr + 2580] = r12;
                                              _syscall_js_Value__Get(fr + 712, M64[vm + 392], r12, acc, M32[fr + 732]);
                                              r12 = M32[fr + 720];
                                              M32[fr + 2584] = r12;
                                              r15 = M64[fr + 712];
                                              acc = runtime_alloc(8);
                                              M32[acc + 4] = r9;
                                              M32[acc] = r8;
                                              M32[fr + 2588] = acc;
                                              M32[fr + 2592] = acc;
                                              M32[fr + 1508] = acc;
                                              M32[fr + 1504] = 71680;
                                              _syscall_js_Value__Call(fr + 696, r15, r12, r10, r11, fr + 1504, 1);
                                              acc = M32[fr + 704];
                                              M32[fr + 2596] = acc;
                                              r15 = M64[fr + 696];
                                              if (_syscall_js_Value__Length(r15, acc) <= 0) {
                                              } else {
                                                _syscall_js_Value__Index(fr + 680, r15, acc);
                                                acc = M32[fr + 688];
                                                M32[fr + 2600] = acc;
                                                _syscall_js_Value__Get(fr + 664, M64[fr + 680], acc, r6, r7);
                                                acc = M32[fr + 672];
                                                M32[fr + 2604] = acc;
                                                _syscall_js_Value__String(fr + 656, M64[fr + 664], acc);
                                                r4 = M32[fr + 656];
                                                M32[fr + 2608] = r4;
                                              }
                                              acc = M32[fr + 660];
                                              M32[fr + 2612] = r4;
                                              acc = strings_Index(r4, acc, r3, r5);
                                              M32[vm + 276] = 71820;
                                              acc = (acc ^ -1) >>> 31;
                                              M32[vm + 280] = acc;
                                              M32[fr + 2616] = acc;
                                              break op2;
                                            }
                                            acc = M32[vm + 296];
                                            M32[fr + 2620] = acc;
                                            M32[fr + 2624] = acc;
                                            r3 = M32[vm + 300];
                                            if (!r3) break B1;
                                            r3 = r3 - 1;
                                            r4 = acc + (r3 << 3);
                                            r5 = M32[r4];
                                            M32[fr + 2628] = r5;
                                            r4 = M32[r4 + 4];
                                            M32[fr + 2632] = r4;
                                            if (r5 !== 71680) break B0;
                                            r7 = M32[r4 + 4];
                                            r8 = M32[r4];
                                            M32[fr + 2636] = acc;
                                            M32[fr + 2640] = acc;
                                            if (r3 > M32[vm + 304]) break B9;
                                            M32[vm + 300] = r3;
                                            acc = 0;
                                            M32[fr + 1536] = 0;
                                            r4 = -4;
                                            loop79: while (true) {
                                              runtime_stringNext(fr + 816, r8, r7, fr + 1536);
                                              r4 = r4 + 4;
                                              acc = acc + 1;
                                              if (M8[fr + 816]) continue loop79;
                                            }
                                            r3 = acc - 1;
                                            if (r3 > 1073741823) break B9;
                                            r5 = runtime_alloc(r4);
                                            M32[fr + 2644] = r5;
                                            M32[fr + 2648] = r5;
                                            M32[fr + 3064] = 0;
                                            runtime_stringNext(fr + 800, r8, r7, fr + 3064);
                                            if (M8[fr + 800]) {
                                              r9 = M32[fr + 808];
                                              r6 = r5;
                                              loop81: while (true) {
                                                acc = acc - 1;
                                                if (!acc) break B1;
                                                M32[r6] = r9;
                                                runtime_stringNext(fr + 784, r8, r7, fr + 3064);
                                                r9 = M32[fr + 792];
                                                r6 = r6 + 4;
                                                if (M8[fr + 784]) continue loop81;
                                              }
                                            }
                                            acc = runtime_alloc(r4);
                                            M32[fr + 2652] = acc;
                                            M32[fr + 2656] = acc;
                                            B82: {
                                              if (r3 <= 0) {
                                                r4 = 0;
                                                break B82;
                                              }
                                              r4 = r3;
                                              loop84: while (true) {
                                                M32[fr + 1500] = M32[r5];
                                                runtime_sliceAppend(fr + 768, acc, fr + 1500, r10, r4, 1, 4);
                                                acc = M32[fr + 768];
                                                M32[fr + 2664] = acc;
                                                M32[fr + 2660] = acc;
                                                r5 = r5 + 4;
                                                r4 = M32[fr + 776];
                                                r10 = M32[fr + 772];
                                                r3 = r3 - 1;
                                                if (r3) continue loop84;
                                              }
                                            }
                                            r3 = runtime_alloc(12);
                                            M32[r3 + 8] = r4;
                                            M32[r3 + 4] = r10;
                                            M32[r3] = acc;
                                            M32[vm + 280] = r3;
                                            M32[vm + 276] = 71796;
                                            M32[fr + 2668] = r3;
                                            M32[fr + 2672] = r3;
                                            break op2;
                                          }
                                          __main__0oOoOO___0ooO0o(fr + 832, vm);
                                          r4 = M32[fr + 832];
                                          M32[fr + 2676] = r4;
                                          if (M32[fr + 836] !== 64) break B6;
                                          acc = 0;
                                          loop85: while (true) {
                                            B86: {
                                              B87: {
                                                switch (M8[acc + r4] - 10) {
                                                  case 0:break B87;
                                                  case 1:break B86;
                                                  case 2:break B86;
                                                  case 3:break B87;
                                                  default:break B86;
                                                }
                                              }
                                              runtime__panic(71680, 70528);
                                              throw new Error("unreachable");
                                            }
                                            acc = acc + 1;
                                            if (acc !== 64) continue loop85;
                                          }
                                          r3 = runtime_alloc(328);
                                          M32[r3 + 320] = 61;
                                          M32[fr + 2680] = r3;
                                          M32[fr + 2684] = r3;
                                          memCopy(r3, r4, 64);
                                          memFill(r3 - -64, 255, 256);
                                          acc = 0;
                                          loop88: while (true) {
                                            M8[r3 + M8[acc + r4] - -64] = acc;
                                            acc = acc + 1;
                                            if (acc !== 64) continue loop88;
                                          }
                                          M32[vm + 412] = r3;
                                          break op2;
                                        }
                                        __main__0oOoOO___0ooO0o(fr + 880, vm);
                                        acc = M32[fr + 880];
                                        M32[fr + 2688] = acc;
                                        r3 = M32[fr + 884];
                                        __main__0oOoOO___0ooO0o(fr + 872, vm);
                                        r4 = M32[fr + 872];
                                        M32[fr + 2692] = r4;
                                        r5 = M32[vm + 400];
                                        M32[fr + 2696] = r5;
                                        _syscall_js_Value__Get(fr + 856, M64[vm + 392], r5, r4, M32[fr + 876]);
                                        r4 = M32[fr + 864];
                                        M32[fr + 2700] = r4;
                                        _syscall_js_Value__Get(fr + 840, M64[fr + 856], r4, acc, r3);
                                        acc = M32[fr + 848];
                                        M32[fr + 2704] = acc;
                                        acc = _syscall_js_Value__Length(M64[fr + 840], acc);
                                        M32[vm + 280] = acc;
                                        M32[vm + 276] = 71780;
                                        M32[fr + 2708] = acc;
                                        break op2;
                                      }
                                      __main__0oOoOO___0ooO0o(fr + 976, vm);
                                      acc = M32[fr + 976];
                                      M32[fr + 2712] = acc;
                                      r3 = M32[fr + 980];
                                      __main__0oOoOO___0ooO0o(fr + 968, vm);
                                      r4 = M32[fr + 968];
                                      M32[fr + 2716] = r4;
                                      r5 = M32[fr + 972];
                                      __main__0oOoOO___0ooO0o(fr + 960, vm);
                                      r6 = M32[fr + 960];
                                      M32[fr + 2720] = r6;
                                      r7 = M32[vm + 400];
                                      M32[fr + 2724] = r7;
                                      _syscall_js_Value__Get(fr + 944, M64[vm + 392], r7, r6, M32[fr + 964]);
                                      r6 = M32[fr + 952];
                                      M32[fr + 2728] = r6;
                                      _syscall_js_Value__Get(fr + 928, M64[fr + 944], r6, r4, r5);
                                      r4 = M32[fr + 936];
                                      M32[fr + 2732] = r4;
                                      _syscall_js_Value__Index(fr + 912, M64[fr + 928], r4);
                                      r4 = M32[fr + 920];
                                      M32[fr + 2736] = r4;
                                      _syscall_js_Value__Get(fr + 896, M64[fr + 912], r4, acc, r3);
                                      acc = M32[fr + 904];
                                      M32[fr + 2740] = acc;
                                      _syscall_js_Value__String(fr + 888, M64[fr + 896], acc);
                                      r3 = M32[fr + 888];
                                      M32[fr + 2744] = r3;
                                      r4 = M32[fr + 892];
                                      acc = runtime_alloc(8);
                                      M32[acc + 4] = r4;
                                      M32[acc] = r3;
                                      M32[vm + 280] = acc;
                                      M32[vm + 276] = 71680;
                                      M32[fr + 2748] = acc;
                                      M32[fr + 2752] = acc;
                                      break op2;
                                    }
                                    acc = M32[vm + 296];
                                    M32[fr + 2756] = acc;
                                    M32[fr + 2760] = acc;
                                    r3 = M32[vm + 300];
                                    if (!r3) break B1;
                                    r3 = r3 - 1;
                                    r4 = acc + (r3 << 3);
                                    r5 = M32[r4];
                                    M32[fr + 2764] = r5;
                                    r4 = M32[r4 + 4];
                                    M32[fr + 2772] = acc;
                                    M32[fr + 2768] = r4;
                                    M32[fr + 2776] = acc;
                                    if (r3 > M32[vm + 304]) break B9;
                                    M32[vm + 300] = r3;
                                    if (r5 !== 71696) break B0;
                                    strconv_FormatInt(fr + 984, BigInt(r4), 16);
                                    r3 = M32[fr + 984];
                                    M32[fr + 2780] = r3;
                                    r4 = M32[fr + 988];
                                    acc = runtime_alloc(8);
                                    M32[acc + 4] = r4;
                                    M32[acc] = r3;
                                    M32[vm + 280] = acc;
                                    M32[vm + 276] = 71680;
                                    M32[fr + 2784] = acc;
                                    M32[fr + 2788] = acc;
                                    break op2;
                                  }
                                  __main__0oOoOO___0ooO0o(fr + 1056, vm);
                                  acc = M32[fr + 1056];
                                  M32[fr + 2792] = acc;
                                  r3 = M32[fr + 1060];
                                  __main__0oOoOO___0ooO0o(fr + 1048, vm);
                                  r4 = M32[fr + 1048];
                                  M32[fr + 2796] = r4;
                                  r5 = M32[vm + 400];
                                  M32[fr + 2800] = r5;
                                  _syscall_js_Value__Get(fr + 1032, M64[vm + 392], r5, r4, M32[fr + 1052]);
                                  r4 = M32[fr + 1040];
                                  M32[fr + 2804] = r4;
                                  _syscall_js_Value__Get(fr + 1016, M64[fr + 1032], r4, acc, r3);
                                  acc = M32[fr + 1024];
                                  M32[fr + 2808] = acc;
                                  _syscall_js_Value__Invoke(fr + 1000, M64[fr + 1016], acc);
                                  acc = M32[fr + 1008];
                                  M32[fr + 2812] = acc;
                                  _syscall_js_Value__String(fr + 992, M64[fr + 1000], acc);
                                  r3 = M32[fr + 992];
                                  M32[fr + 2816] = r3;
                                  r4 = M32[fr + 996];
                                  acc = runtime_alloc(8);
                                  M32[acc + 4] = r4;
                                  M32[acc] = r3;
                                  M32[vm + 280] = acc;
                                  M32[vm + 276] = 71680;
                                  M32[fr + 2820] = acc;
                                  M32[fr + 2824] = acc;
                                  break op2;
                                }
                                __main__0oOoOO___0ooO0o(fr + 1136, vm);
                                acc = M32[fr + 1136];
                                M32[fr + 2828] = acc;
                                r3 = M32[fr + 1140];
                                __main__0oOoOO___0ooO0o(fr + 1128, vm);
                                r4 = M32[fr + 1128];
                                M32[fr + 2832] = r4;
                                r5 = M32[fr + 1132];
                                __main__0oOoOO___0ooO0o(fr + 1120, vm);
                                r6 = M32[fr + 1120];
                                M32[fr + 2836] = r6;
                                r7 = M32[vm + 400];
                                M32[fr + 2840] = r7;
                                _syscall_js_Value__Get(fr + 1104, M64[vm + 392], r7, r6, M32[fr + 1124]);
                                r6 = M32[fr + 1112];
                                M32[fr + 2844] = r6;
                                _syscall_js_Value__Get(fr + 1088, M64[fr + 1104], r6, r4, r5);
                                r4 = M32[fr + 1096];
                                M32[fr + 2848] = r4;
                                _syscall_js_Value__Call(fr + 1072, M64[fr + 1088], r4, acc, r3, 0, 0);
                                acc = M32[fr + 1080];
                                M32[fr + 2852] = acc;
                                _syscall_js_Value__String(fr + 1064, M64[fr + 1072], acc);
                                r3 = M32[fr + 1064];
                                M32[fr + 2856] = r3;
                                r4 = M32[fr + 1068];
                                acc = runtime_alloc(8);
                                M32[acc + 4] = r4;
                                M32[acc] = r3;
                                M32[vm + 280] = acc;
                                M32[vm + 276] = 71680;
                                M32[fr + 2860] = acc;
                                M32[fr + 2864] = acc;
                                break op2;
                              }
                              __main__0oOoOO___0ooO0o(fr + 1224, vm);
                              r3 = M32[fr + 1224];
                              M32[fr + 2868] = r3;
                              r4 = M32[fr + 1228];
                              __main__0oOoOO___0ooO0o(fr + 1216, vm);
                              r5 = M32[fr + 1216];
                              M32[fr + 2872] = r5;
                              r6 = M32[fr + 1220];
                              __main__0oOoOO___0ooO0o(fr + 1208, vm);
                              r7 = M32[fr + 1208];
                              M32[fr + 2876] = r7;
                              r8 = M32[fr + 1212];
                              __main__0oOoOO___0ooO0o(fr + 1200, vm);
                              acc = M32[fr + 1200];
                              M32[fr + 2880] = acc;
                              r9 = M32[vm + 400];
                              M32[fr + 2884] = r9;
                              _syscall_js_Value__Get(fr + 1184, M64[vm + 392], r9, acc, M32[fr + 1204]);
                              r9 = M32[fr + 1192];
                              M32[fr + 2888] = r9;
                              r15 = M64[fr + 1184];
                              acc = runtime_alloc(8);
                              M32[acc + 4] = r6;
                              M32[acc] = r5;
                              M32[fr + 2892] = acc;
                              M32[fr + 2896] = acc;
                              M32[fr + 1492] = acc;
                              M32[fr + 1488] = 71680;
                              _syscall_js_Value__Call(fr + 1168, r15, r9, r7, r8, fr + 1488, 1);
                              acc = M32[fr + 1176];
                              M32[fr + 2900] = acc;
                              _syscall_js_Value__Call(fr + 1152, M64[fr + 1168], acc, r3, r4, 0, 0);
                              acc = M32[fr + 1160];
                              M32[fr + 2904] = acc;
                              _syscall_js_Value__String(fr + 1144, M64[fr + 1152], acc);
                              r3 = M32[fr + 1144];
                              M32[fr + 2908] = r3;
                              r4 = M32[fr + 1148];
                              acc = runtime_alloc(8);
                              M32[acc + 4] = r4;
                              M32[acc] = r3;
                              M32[vm + 280] = acc;
                              M32[vm + 276] = 71680;
                              M32[fr + 2912] = acc;
                              M32[fr + 2916] = acc;
                              break op2;
                            }
                            __main__0oOoOO___0ooO0o(fr + 1296, vm);
                            r3 = M32[fr + 1296];
                            M32[fr + 2920] = r3;
                            r4 = M32[fr + 1300];
                            __main__0oOoOO___0ooO0o(fr + 1288, vm);
                            acc = M32[fr + 1288];
                            M32[fr + 2924] = acc;
                            r5 = M32[vm + 400];
                            M32[fr + 2928] = r5;
                            _syscall_js_Value__Get(fr + 1272, M64[vm + 392], r5, acc, M32[fr + 1292]);
                            r5 = M32[fr + 1280];
                            M32[fr + 2932] = r5;
                            r15 = M64[fr + 1272];
                            acc = runtime_alloc(8);
                            M32[acc + 4] = r4;
                            M32[acc] = r3;
                            M32[fr + 2936] = acc;
                            M32[fr + 2940] = acc;
                            M32[fr + 1532] = acc;
                            M32[fr + 1528] = 71680;
                            _syscall_js_Value__New(fr + 1256, r15, r5, fr + 1528, 1);
                            acc = M32[fr + 1264];
                            M32[fr + 2944] = acc;
                            _syscall_js_Value__Invoke(fr + 1240, M64[fr + 1256], acc);
                            acc = M32[fr + 1248];
                            M32[fr + 2948] = acc;
                            _syscall_js_Value__String(fr + 1232, M64[fr + 1240], acc);
                            r3 = M32[fr + 1232];
                            M32[fr + 2952] = r3;
                            r4 = M32[fr + 1236];
                            acc = runtime_alloc(8);
                            M32[acc + 4] = r4;
                            M32[acc] = r3;
                            M32[vm + 280] = acc;
                            M32[vm + 276] = 71680;
                            M32[fr + 2956] = acc;
                            M32[fr + 2960] = acc;
                            break op2;
                          }
                          __main__0oOoOO___0ooO0o(fr + 1352, vm);
                          acc = M32[fr + 1352];
                          M32[fr + 2964] = acc;
                          r3 = M32[fr + 1356];
                          __main__0oOoOO___0ooO0o(fr + 1344, vm);
                          r4 = M32[fr + 1344];
                          M32[fr + 2968] = r4;
                          r5 = M32[vm + 400];
                          M32[fr + 2972] = r5;
                          _syscall_js_Value__Get(fr + 1328, M64[vm + 392], r5, r4, M32[fr + 1348]);
                          r4 = M32[fr + 1336];
                          M32[fr + 2976] = r4;
                          _syscall_js_Value__Call(fr + 1312, M64[fr + 1328], r4, acc, r3, 0, 0);
                          acc = M32[fr + 1320];
                          M32[fr + 2980] = acc;
                          _syscall_js_Value__String(fr + 1304, M64[fr + 1312], acc);
                          r3 = M32[fr + 1304];
                          M32[fr + 2984] = r3;
                          r4 = M32[fr + 1308];
                          acc = runtime_alloc(8);
                          M32[acc + 4] = r4;
                          M32[acc] = r3;
                          M32[vm + 280] = acc;
                          M32[vm + 276] = 71680;
                          M32[fr + 2988] = acc;
                          M32[fr + 2992] = acc;
                          break op2;
                        }
                        __main__0oOoOO___0ooO0o(fr + 1464, vm);
                        acc = M32[fr + 1464];
                        M32[fr + 2996] = acc;
                        r3 = M32[fr + 1468];
                        __main__0oOoOO___0ooO0o(fr + 1456, vm);
                        r4 = M32[fr + 1456];
                        M32[fr + 3000] = r4;
                        r5 = M32[fr + 1460];
                        __main__0oOoOO___0ooO0o(fr + 1448, vm);
                        r6 = M32[fr + 1448];
                        M32[fr + 3004] = r6;
                        r7 = vm + 400;
                        r8 = M32[r7];
                        M32[fr + 3008] = r8;
                        _syscall_js_Value__Get(fr + 1432, M64[vm + 392], r8, r6, M32[fr + 1452]);
                        r6 = M32[fr + 1440];
                        M32[fr + 3012] = r6;
                        _syscall_js_Value__New(fr + 1416, M64[fr + 1432], r6, 0, 0);
                        M32[fr + 1484] = 295144;
                        M32[fr + 1480] = 71680;
                        M32[fr + 1476] = 251;
                        M32[fr + 1472] = 71780;
                        r6 = M32[fr + 1424];
                        M32[fr + 3016] = r6;
                        _syscall_js_Value__Call(fr + 1400, M64[fr + 1416], r6, 295152, 1, fr + 1472, 2);
                        M32[fr + 3020] = M32[fr + 1408];
                        r6 = M32[r7];
                        M32[fr + 3024] = r6;
                        _syscall_js_Value__Get(fr + 1384, M64[vm + 392], r6, r4, r5);
                        r4 = M32[fr + 1392];
                        M32[fr + 3028] = r4;
                        _syscall_js_Value__Get(fr + 1368, M64[fr + 1384], r4, acc, r3);
                        acc = M32[fr + 1376];
                        M32[fr + 3032] = acc;
                        _syscall_js_Value__String(fr + 1360, M64[fr + 1368], acc);
                        r3 = M32[fr + 1360];
                        M32[fr + 3036] = r3;
                        r4 = M32[fr + 1364];
                        acc = runtime_alloc(8);
                        M32[acc + 4] = r4;
                        M32[acc] = r3;
                        M32[vm + 280] = acc;
                        M32[vm + 276] = 71680;
                        M32[fr + 3040] = acc;
                        M32[fr + 3044] = acc;
                        break op2;
                      }
                      __main__0oOoOO___0ooO0o(fr + 88, vm);
                      acc = M32[fr + 88];
                      M32[fr + 3048] = acc;
                      strings_Split(fr + 72, acc, M32[fr + 92], 295153);
                      r3 = M32[fr + 72];
                      M32[fr + 3052] = r3;
                      r15 = M64[fr + 76];
                      acc = runtime_alloc(12);
                      M64[acc + 4] = r15;
                      M32[acc] = r3;
                      M32[vm + 280] = acc;
                      M32[vm + 276] = 253228;
                      M32[fr + 3056] = acc;
                      M32[fr + 3060] = acc;
                      break op2;
                    }
                    runtime_slicePanic();
                    throw new Error("unreachable");
                  }
                  vm = runtime_alloc(12);
                  M32[vm + 8] = r4;
                  M32[vm + 4] = 9;
                  M32[vm] = 71400;
                  M32[fr + 2064] = vm;
                  M32[fr + 2068] = vm;
                  runtime__panic(312832, vm);
                  throw new Error("unreachable");
                }
                M32[315096] = M32[315140];
                M32[315140] = 315096;
                runtime_runtimePanic(66704, 21);
                throw new Error("unreachable");
              }
              runtime__panic(71680, 70472);
              throw new Error("unreachable");
            }
            M32[vm + 280] = acc;
            M32[vm + 276] = r3;
            break op2;
          }
          M32[vm + 408] = r3;
          M32[fr + 1572] = acc;
          r3 = runtime_alloc(8);
          M32[r3 + 4] = r6;
          M32[r3] = acc;
          M32[vm + 280] = r3;
          M32[vm + 276] = 71680;
          M32[fr + 1576] = r3;
          M32[fr + 1580] = r3;
        }
        acc = M32[vm + 376];
        M32[fr + 1584] = acc;
        r3 = M32[vm + 20];
        if (r3 >= M32[vm + 312]) break B1;
        r3 = M32[M32[vm + 308] + (r3 << 2)];
        if (r3 >= M32[vm + 380]) break B1;
        vm = acc + (r3 << 3);
        acc = M32[vm];
        M32[fr + 1588] = acc;
        vm = M32[vm + 4];
        M32[fr + 1592] = vm;
        if (!vm) break B2;
        M32[315324] = r13;
        sp = fr + 3088;
        return callIndirect();
      }
      runtime_nilPanic();
      throw new Error("unreachable");
    }
    runtime_lookupPanic();
    throw new Error("unreachable");
  }
  runtime_runtimePanic(70873, 18);
  throw new Error("unreachable");
}