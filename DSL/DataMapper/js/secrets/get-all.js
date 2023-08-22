import { getAllFiles, mapSecretToJson } from "../util/utils.js";

const flattenSecrets = (data, path, result) => {
  Object.keys(data).forEach((k) => {
    const secretPath = path.length > 0 ? `${path}.${k}` : k;
    if (typeof data[k] === "object") {
      flattenSecrets(data[k], secretPath, result);
    } else {
      if (!result.includes(secretPath)) result.push(secretPath);
    }
  });
};

export default async function getAllSecrets() {
  const secrets = {
    prod: [],
    test: [],
  };
  flattenSecrets(
    mapSecretToJson(getAllFiles("/secrets/prod")),
    "",
    secrets.prod
  );
  flattenSecrets(
    mapSecretToJson(getAllFiles("/secrets/test")),
    "",
    secrets.test
  );
  return secrets;
}
