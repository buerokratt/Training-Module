export default function base64ToText(base64String: string): string {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
}
