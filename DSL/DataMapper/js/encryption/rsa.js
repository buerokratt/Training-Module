import crypto from "crypto";

export default async function rsaEncrypt(content, publicKey) {
  if (!content) {
    return {
      error: true,
      message: "Content is missing",
    };
  }

  try {
    const rsaData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(content)
    );
    return {
      error: false,
      cipher: rsaData.toString("base64"),
    };
  } catch (err) {
    return {
      error: true,
      message: "RSA Encryption Failed",
    };
  }
}
