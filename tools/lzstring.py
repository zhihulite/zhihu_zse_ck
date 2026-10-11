#!/usr/bin/env python3
# LZ-string (decompressFromBase64) 的 Python 实现，用于解开 JS 字符串表里的压缩 blob
import sys

KEY_STR_BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="


def get_base_value(alphabet, ch):
    return alphabet.index(ch)


def decompress_from_base64(inp):
    return _decompress(len(inp), 32, lambda i: get_base_value(KEY_STR_BASE64, inp[i]))


def _decompress(length, reset_value, get_next_value):
    dictionary = [0, 1, 2]
    enlarge_in = 4
    dict_size = 4
    num_bits = 3
    entry = ""
    result = []

    data_val = get_next_value(0)
    data_position = reset_value
    data_index = 1

    def read_bits(nbits):
        nonlocal data_val, data_position, data_index
        bits = 0
        maxpower = 1 << nbits
        power = 1
        while power != maxpower:
            resb = data_val & data_position
            data_position >>= 1
            if data_position == 0:
                data_position = reset_value
                data_val = get_next_value(data_index)
                data_index += 1
            bits |= (1 if resb > 0 else 0) * power
            power <<= 1
        return bits

    c = read_bits(2)
    if c == 0:
        c = chr(read_bits(8))
    elif c == 1:
        c = chr(read_bits(16))
    elif c == 2:
        return ""

    dictionary.append(c)
    dictionary[3] = c
    w = c
    result.append(c)

    while True:
        if data_index > length:
            return ""
        c = read_bits(num_bits)
        if c == 0:
            dictionary.append(chr(read_bits(8)))
            c = dict_size
            dict_size += 1
            enlarge_in -= 1
        elif c == 1:
            dictionary.append(chr(read_bits(16)))
            c = dict_size
            dict_size += 1
            enlarge_in -= 1
        elif c == 2:
            return "".join(result)

        if enlarge_in == 0:
            enlarge_in = 1 << num_bits
            num_bits += 1

        if c < len(dictionary) and dictionary[c] is not None and c < dict_size:
            entry = dictionary[c]
        elif c == dict_size:
            entry = w + w[0]
        else:
            return None

        result.append(entry)
        dictionary.append(w + entry[0])
        dict_size += 1
        enlarge_in -= 1
        w = entry

        if enlarge_in == 0:
            enlarge_in = 1 << num_bits
            num_bits += 1


if __name__ == '__main__':
    blob = open(sys.argv[1] if len(sys.argv) > 1 else '.probe/zsec/js_blob.txt', encoding='utf-8').read()
    out = decompress_from_base64(blob)
    if out is None:
        print('解压失败（返回 null）')
    else:
        print('解压成功: %d 字符' % len(out))
        print('前 400:', repr(out[:400]))
        open('.probe/zsec/js_blob_dec.txt', 'w', encoding='utf-8').write(out)
        print('已存 .probe/zsec/js_blob_dec.txt')
