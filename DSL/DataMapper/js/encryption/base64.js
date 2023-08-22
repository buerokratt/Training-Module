export default async function base64Encrypt(content) {
    if (!content) {
        return {
            error: true,
            message: 'Content is missing',
        }
    }

    try {
        return {
            error: false,
            cipher: btoa(typeof content === 'string' ? content : JSON.stringify(content))
        }
    } catch (err) {
        return {
            error: true,
            message: 'Base64 Encryption Failed',
        }
    }
}
