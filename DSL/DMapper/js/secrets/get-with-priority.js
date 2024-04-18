import { getAllFiles, mapSecretToJson } from "../util/utils.js";

export default async function getSecretsWithPriority(priority) {
  const prodSecrets = mapSecretToJson(getAllFiles("/secrets/prod"));
  const testSecrets = mapSecretToJson(getAllFiles("/secrets/test"));

  const mergeSecrets = (secrets, result, isProdSecrets, isProdPriority) => {
    Object.keys(secrets).forEach((k) => {
      if (typeof secrets[k] === "object") {
        if (!Object.keys(result).includes(k)) result[k] = {};
        return mergeSecrets(
          secrets[k],
          result[k],
          isProdSecrets,
          isProdPriority
        );
      }
      if (
        !Object.keys(result).includes(k) ||
        (!isProdSecrets && !isProdPriority)
      )
        result[k] = secrets[k];
    });
    return result;
  };
  const result = {};
  mergeSecrets(prodSecrets, result, true, priority !== "test");
  mergeSecrets(testSecrets, result, false, priority !== "test");
  return result;
}
