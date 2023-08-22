import crypto from "crypto";

export default async function rsaDecrypt(cipher, privateKey) {
  if (!cipher) {
    return {
      error: true,
      message: "Cipher is missing",
    };
  }

  try {
    const rsaDecryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer(cipher, "base64")
    );
    return {
      error: false,
      content: rsaDecryptedData.toString(),
    };
  } catch (err) {
    console.log(err);
    return {
      error: true,
      message: "RSA Decryption Failed",
    };
  }
}
