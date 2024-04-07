import path from "path";
import * as fs from "fs";
import assert from "assert";

const endPoint = "https://open-api.bser.io";


const apiKeyResult = getApiKey();
if (!isApiKey(apiKeyResult)) {
  console.error(apiKeyResult.error);
  process.exit(1);
}
const apiKey = apiKeyResult.data;

function getOneDrivePath() {
  return process.env.OneDriveConsumer;
}

type ApiKeyResult = { error: null; data: string } | { error: unknown; data: null };

function isApiKey(result: ApiKeyResult): result is { error: null; data: string } {
  return result.error === null;
}

/**
 * Gets the API key
 * 
 * @returns On success: { error: null, apiKey: string },
 *          On failure: { error: unknown, apiKey: null }.
 */
function getApiKey(): ApiKeyResult {
  const oneDrivePath = getOneDrivePath();
  if (!oneDrivePath) {
    return { error: new Error("Failed to get OneDrive path"), data: null };
  }

  const apiKeyPath = path.join(oneDrivePath, "Authentication", "eternal-return-open-api.txt");

  try {
    const apiKey = fs.readFileSync(apiKeyPath, "utf8").trim();
    return { error: null, data: apiKey };
  }
  catch (error) {
    return { error, data: null };
  }
}

async function fetchUserByNickname(nickname: string) {
  const path = "/v1/user/nickname";
  const url = endPoint + path + "?query=" + nickname;
  const headers: HeadersInit = {
    "x-api-key": apiKey,
  };
  const options: RequestInit = {
    headers,
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

async function foo() {
  const [error, data] = await tryOperation(fetchUserByNickname("한동그라미"));
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

foo();

/**
 * Wraps a Promise to return an array with the first element as any error and the second as the result ([error, result]).
 * Note: Within this Promise, do not throw `null` as an error. Throwing `null`
 * 
 * @param promise The Promise to be executed.
 * @returns On success: [null, result],
 *          On failure: [error, null].
 */
async function tryOperation<T>(promise: Promise<T>): Promise<[null, any] | [unknown, null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}