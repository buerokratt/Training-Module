
export default async function base64Decrypt(cipher, isObject) {
    if (!cipher) {
        return {
            error: true,
            message: 'Cipher is missing',
        }
    }

    try {
        return {
            error: false,
            content: !isObject ? atob(cipher) :JSON.parse(atob(cipher))
        }
    } catch (err) {
        return {
            error: true,
            message: 'Base64 Decryption Failed',
        }
    }
}
