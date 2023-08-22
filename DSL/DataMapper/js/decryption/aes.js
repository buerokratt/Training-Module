import crypto from "crypto-js";

export default async function aesDecrypt(cipher, key, isObject) {
    if (!cipher || !key) {
        return {
            error: true,
            message: `${!cipher ? 'Cipher is missing' : 'Key is missing'}`,
        }
    }

    try {
        var bytes = crypto.AES.decrypt(cipher, key)
        return {
            error: false,
            content: !isObject ? bytes.toString(crypto.enc.Utf8) :JSON.parse(bytes.toString(crypto.enc.Utf8))
        }
    } catch (err) {
        return {
            error: true,
            message: 'AES Decryption Failed',
        }
    }
}
