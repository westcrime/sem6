const {Typeson, builtin} = require('typeson-registry');

const bits_in_byte = 8;
const bits_in_tetrade = 4;
const key_size_in_bytes = 8;
const value_size_in_bytes = 8;
const round_key_size_in_bytes = 7;
const subkey_size_in_bytes = 6;
const part_size_in_bytes = 4;
const round_count = 16;
const round_shifts = [  1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
const subkey_indexes = [    14, 17, 11, 24, 1,  5,  3,  28, 15, 6,  21, 10, 23, 19, 12, 4, 
                            26, 8,  16, 7,  27, 20, 13, 2,  41, 52, 31, 37, 47, 55, 30, 40,
                            51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32  ];
const S_boxes = [   [   [   14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7    ],
                        [   0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8    ],
                        [   4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0    ],
                        [   15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13    ]    ],
                    [   [   15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10    ],
                        [   3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5    ],
                        [   0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15    ],
                        [   13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9    ]    ],
                    [   [   10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8    ],
                        [   13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1    ],
                        [   13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7    ],
                        [   1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12    ]    ],
                    [   [   7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15    ],
                        [   13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9    ],
                        [   10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4    ],
                        [   3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14    ]    ],
                    [   [   2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9    ],
                        [   14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6    ],
                        [   4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14    ],
                        [   11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3    ]    ],
                    [   [   12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11    ],
                        [   10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8    ],
                        [   9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6    ],
                        [   4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13    ]   ],
                    [   [   4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1    ],
                        [   13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6    ],
                        [   1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2    ],
                        [   6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12    ]    ],
                    [   [   13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7    ],
                        [   1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2    ],
                        [   7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8    ],
                        [   2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11    ]    ]   ];
const P = [ 16, 7, 20, 21, 29, 12, 28, 17,
            1, 15, 23, 26, 5, 18, 31, 10,
            2, 8, 24, 14, 32, 27, 3, 9,
            19, 13, 30, 6, 22, 11, 4, 25    ];
const permutation_indexes = [ 4, 0, 5, 1, 6, 2, 7, 3 ];
const typeson = new Typeson().register([
    builtin
]);



function shiftLeft(bytes, shift) {
    if (shift > bits_in_byte) {
        throw new Error('Invalid shift');
    }
    const ones = 0b11111111;
    const bits_not_remembered = bits_in_byte - shift;
    const remembered_bits = (ones << bits_not_remembered) & ones;
    let tmp = 0;

    for (let i = bytes.length - 1; i >= 0; i--) {
        let new_byte = (bytes[i] << shift) | tmp;
        tmp = (bytes[i] & remembered_bits) >> bits_not_remembered;
        bytes[i] = new_byte;
    }

    bytes[bytes.length - 1] |= tmp;
}


function shiftRight(bytes, shift) {
    if (shift >  bits_in_byte) {
        throw new Error('Invalid shift');
    }
    const ones = 0b11111111;
    const bits_not_remembered = bits_in_byte - shift;
    const remembered_bits = (ones >> bits_not_remembered) & ones;
    let tmp = 0;

    for (let i = 0; i < bytes.length; i++) {
        let new_byte = (bytes[i] >> shift) | tmp;
        tmp = (bytes[i] & remembered_bits) << bits_not_remembered;
        bytes[i] = new_byte;
    }

    bytes[0] |= tmp;
}


function getBit(bytes, index) {
    let bit_pos = index % bits_in_byte;
    let byte_pos = Math.floor(index / bits_in_byte);
    let byte_with_bit_set = 0b10000000 >> bit_pos;
    return !!(bytes[byte_pos] & byte_with_bit_set)
}


function setBit(bytes, index, value) {
    let bit_pos = index % bits_in_byte;
    let byte_pos = Math.floor(index / bits_in_byte);
    let byte_with_bit_set = 0b10000000 >> bit_pos;
    if (value) {
        bytes[byte_pos] |= byte_with_bit_set;
    } else {
        bytes[byte_pos] &= ~byte_with_bit_set;
    }
}


function permutedChoice(key) {
    let byte_with_bit_set = 0b10000000;
    let result = new Uint8Array(round_key_size_in_bytes).fill(0);
    
    for (let i = 0; i < round_key_size_in_bytes; i++)
    {
        for (let j = 0; j < key_size_in_bytes; j++) 
        {
            result[round_key_size_in_bytes - 1 - i] |= ((key[j] & byte_with_bit_set) << i) >> (value_size_in_bytes - 1 - j);
        }
        byte_with_bit_set >>= 1;
    }

    let tmp = result[4];
    result[4] = result[6];
    result[6] = tmp;

    shiftLeft(result.subarray(3, 7), 4);

    return result;
}


function shiftRoundKey(lastKey, shift_size) {
    const D_last_bits = (0b00001111 >> (bits_in_tetrade - shift_size)) << bits_in_tetrade;
    const C_last_bits = 0b11111111 >> (bits_in_byte - shift_size);
    const D_last_byte = 3;
    const C_last_byte = 6;

    shiftLeft(lastKey, shift_size);

    let tmp = lastKey[D_last_byte] & D_last_bits
    lastKey[D_last_byte] = (lastKey[D_last_byte] & ~D_last_bits) | ((lastKey[C_last_byte] & C_last_bits) << bits_in_tetrade);
    lastKey[C_last_byte] = (lastKey[C_last_byte] & ~C_last_bits) | (tmp >> bits_in_tetrade);
}


function getSubKey(roundKey) {
    const round_key_size_in_bits = round_key_size_in_bytes * bits_in_byte;

    let result = new Uint8Array(subkey_size_in_bytes);

    for (let i = 0; i < subkey_size_in_bytes * bits_in_byte; i++)
    {
        let index = (round_key_size_in_bits / 2 + subkey_indexes[i] - 1) % round_key_size_in_bits;
        setBit(result, i, getBit(roundKey, index));
    }

    return result;
}


function expansion(vec32) {
    const block_size_in_bits = 6;
    const left_bits = 0b00111111;
    const right_bits = 0b11111100;

    let leftArr = new Uint8Array(vec32);
    let rightArr = new Uint8Array(vec32);
    shiftLeft(leftArr, 1);
    shiftRight(rightArr, 1);

    let result = new Uint8Array(subkey_size_in_bytes);

    for (let i = 0; i < vec32.length; i++)
    {
        let current_byte = Math.floor(2 * block_size_in_bits * i / bits_in_byte);
        let current_bit = 2 * block_size_in_bits * i % bits_in_byte;
        let left_val = leftArr[i] & left_bits;
        let right_val = rightArr[i] & right_bits;

        if (current_bit === bits_in_tetrade) {
            result[current_byte] |= right_val >> bits_in_tetrade;
            result[current_byte + 1] = (right_val << bits_in_tetrade) | left_val;
        } else {
            result[current_byte] = right_val | (left_val >> bits_in_tetrade);
            result[current_byte + 1] = left_val << bits_in_tetrade;
        }
    }

    return result;
}


function shrinking(vec48) {
    const block_size_in_bits = 6;

    let result = new Uint8Array(part_size_in_bytes);

    for (let i = 0; i < result.length; i++)
    {
        let current_byte = Math.floor(2 * i * block_size_in_bits / bits_in_byte);
        let current_bit = 2 * i * block_size_in_bits % bits_in_byte;
        let first_row;
        let first_col;
        let last_row;
        let last_col;

        if (current_bit === bits_in_tetrade) {
            first_row = ((vec48[current_byte] & 0b00001000) >> 2) | ((vec48[current_byte + 1] & 0b01000000) >> 6);
            first_col = ((vec48[current_byte] & 0b00000111) << 1) | ((vec48[current_byte + 1] & 0b10000000) >> 7);
            last_row = ((vec48[current_byte + 1] & 0b00100000) >> 4) | (vec48[current_byte + 1] & 0b00000001);
            last_col = (vec48[current_byte + 1] & 0b00011110) >> 1;
        } else {
            first_row = ((vec48[current_byte] & 0b10000000) >> 6) | ((vec48[current_byte] & 0b00000100) >> 2);
            first_col = (vec48[current_byte] & 0b01111000) >> 3;
            last_row = (vec48[current_byte] & 0b00000010) | ((vec48[current_byte + 1] & 0b00010000) >> 4);
            last_col = ((vec48[current_byte] & 0b00000001) << 3) | (vec48[current_byte + 1] & 0b11100000) >> 5;
        }

        let first_val = S_boxes[i * 2][first_row][first_col];
        let last_val = S_boxes[i * 2 + 1][last_row][last_col];
        result[i] = (first_val << 4) | last_val;
    }

    return result;
}


function pPermutation(vec32) {
    let result = new Uint8Array(part_size_in_bytes);

    for (let i = 0; i < part_size_in_bytes * bits_in_byte; i++)
    {
        setBit(result, i, getBit(vec32, P[i] - 1));
    }

    return result;
}


function startingPermutation(value) {
    let byte_with_bit_set = 0b10000000;
    let result = new Uint8Array(value_size_in_bytes).fill(0);
    
    for (let i = 0; i < value_size_in_bytes; i++)
    {
        for (let j = 0; j < value_size_in_bytes; j++) 
        {
            result[permutation_indexes[i]] |= ((value[j] & byte_with_bit_set) << i) >> (bits_in_byte - 1 - j);
        }
        byte_with_bit_set >>= 1;
    }

    return result;
}


function endingPermutation(value) {
    let byte_with_bit_set = 0b00000001;
    let result = new Uint8Array(value_size_in_bytes).fill(0);

    for (let i = 0; i < value_size_in_bytes; i++)
    {
        for (let j = 0; j < value_size_in_bytes; j++) 
        {
            result[i] |= ((value[permutation_indexes[j]] & byte_with_bit_set) >> i) << (bits_in_byte - 1 - j);
        }
        byte_with_bit_set <<= 1;
    }

    return result;
}


function xor(vec1, vec2) {
    let result = new Uint8Array(vec1.length);

    for (let i = 0; i < result.length; i++)
    {
        result[i] = vec1[i] ^ vec2[i];
    }

    return result;
}


function feistel(vec32, subkey) {
    let result = expansion(vec32);
    result = xor(result, subkey);
    result = shrinking(result);
    return pPermutation(result);
}


function encrypt_single(value64, subkeys) {
    value64 = startingPermutation(value64);
    let left_part = value64.slice(0, Math.floor(value_size_in_bytes / 2));
    let right_part = value64.slice(Math.floor(value_size_in_bytes / 2), value_size_in_bytes);

    for (let i = 0; i < round_count; i++)
    {
        let tmp = left_part;
        left_part = right_part;
        right_part = xor(tmp, feistel(right_part, subkeys[i]));
    }

    let result = endingPermutation(new Uint8Array([ ...right_part, ...left_part ]));
    return result;
}


function decrypt_single(value64, subkeys) {
    value64 = startingPermutation(value64);
    let left_part = value64.slice(0, Math.floor(value_size_in_bytes / 2));
    let right_part = value64.slice(Math.floor(value_size_in_bytes / 2), value_size_in_bytes);

    for (let i = round_count - 1; i >= 0; i--)
    {
        let tmp = left_part;
        left_part = right_part;
        right_part = xor(tmp, feistel(right_part, subkeys[i]));
    }

    let result = endingPermutation(new Uint8Array([ ...right_part, ...left_part ]));
    return result;
}


function getSubKeys(key) {
    let roundKey = permutedChoice(key);
    let result = new Array(round_count);

    for (let i = 0; i < result.length; i++)
    {
        shiftRoundKey(roundKey, round_shifts[i]);
        result[i] = getSubKey(roundKey);
    }

    return result;
}


function pack(value) {
    value = JSON.stringify(typeson.encapsulate(value));
    value = new TextEncoder().encode(value);
    let additional_bytes_count = Math.ceil((value.length + 1) / value_size_in_bytes) * value_size_in_bytes - value.length - 2;
    let additional_bytes = new Uint8Array(additional_bytes_count).fill(0);
    return new Uint8Array([ value.length / 2**bits_in_byte, value.length, ...value, ...additional_bytes ]);
}


function unpack(value) {
    value = new Uint8Array(value.slice(2, 2 + ((value[0] * 2**bits_in_byte) | value[1])));
    value = new TextDecoder().decode(value);
    return typeson.revive(JSON.parse(value));
}


function encrypt(value, subkeys) {
    if (value.length % value_size_in_bytes != 0) {
        throw new Error('Invalid size');
    }

    let result = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i += value_size_in_bytes) 
    {
        let block = encrypt_single(value.slice(i, i + value_size_in_bytes), subkeys);
        for (let j = 0; j < value_size_in_bytes; j++)
        {
            result[i + j] = block[j];
        }
    }

    return result;
}


function decrypt(value, subkeys) {
    if (value.length % value_size_in_bytes != 0) {
        throw new Error('Invalid size');
    }

    let result = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i += value_size_in_bytes) 
    {
        let block = decrypt_single(value.slice(i, i + value_size_in_bytes), subkeys);
        for (let j = 0; j < value_size_in_bytes; j++)
        {
            result[i + j] = block[j];
        }
    }

    return result;
}


module.exports = { getSubKeys, decrypt, encrypt, pack, unpack, typeson };