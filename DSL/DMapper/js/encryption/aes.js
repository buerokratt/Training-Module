import crypto from "crypto-js";

export default async function aesEncrypt(content, key) {
    if (!content || !key) {
        return {
            error: true,
            message: `${!content ? 'Content is missing' : 'Key is missing'}`,
        }
    }

    try {
        return {
            error: false,
            cipher: crypto.AES.encrypt(typeof content === 'string' ? content : JSON.stringify(content), key).toString()
        }
    } catch (err) {
        return {
            error: true,
            message: 'AES Encryption Failed',
        }
    }
}
