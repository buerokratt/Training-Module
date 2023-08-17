import crypto from "crypto-js";

export default async function tripleDesEncrypt(content, key) {
    if (!content || !key) {
        return {
            error: true,
            message: `${!content ? 'Content is missing' : 'Key is missing'}`,
        }
    }

    try {
        return {
            error: false,
            cipher: crypto.TripleDES.encrypt(typeof content === 'string' ? content : JSON.stringify(content), key).toString()
        }
    } catch (err) {
        return {
            error: true,
            message: 'Triple Des Encryption Failed',
        }
    }
}
