import re, glob, os

for f in sorted(glob.glob('zse_ck_*.restored.js')):
    d = open(f, encoding='utf8', errors='replace').read()
    # find "var _X=_DECODER;" aliases where _DECODER is a bare identifier that is not defined in this file
    removed = 0
    for m in list(re.finditer(r'var\s+(_[A-Za-z0-9_$]+)\s*=\s*(_[A-Za-z0-9_$]+)\s*;', d)):
        alias, target = m.group(1), m.group(2)
        # is target defined in this file?
        defined = re.search(r'function\s+' + re.escape(target) + r'\s*\(', d) or \
                  re.search(r'\bvar\s+' + re.escape(target) + r'\b', d) or \
                  re.search(r'\b' + re.escape(target) + r'\s*=\s*function', d)
        if defined:
            continue
        # is the alias used anywhere besides its own declaration?
        uses = len(re.findall(r'\b' + re.escape(alias) + r'\b', d))
        if uses <= 1:
            d = d.replace(m.group(0), '', 1)
            removed += 1
    open(f, 'w', encoding='utf8').write(d)
    print('%-40s removed dead aliases: %d' % (f, removed))
