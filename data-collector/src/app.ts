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

type ApiKeyResult =
  | { error: null; data: string }
  | { error: unknown; data: null };

function isApiKey(
  result: ApiKeyResult
): result is { error: null; data: string } {
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

  const apiKeyPath = path.join(
    oneDrivePath,
    "Authentication",
    "eternal-return-open-api.txt"
  );

  try {
    const apiKey = fs.readFileSync(apiKeyPath, "utf8").trim();
    return { error: null, data: apiKey };
  } catch (error) {
    return { error, data: null };
  }
}

async function fetchMetaType(metaType: string) {
  const path = "/v2/data/" + metaType;
  const url = endPoint + path;
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

enum MatchingMode {
  Normal = "2",
  Rank = "3",
}

async function fetchFreeCharacters(matchingMode: MatchingMode) {
  const path = `/v1/freeCharacters/${matchingMode}`;
  const url = endPoint + path;
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

type FullSupportLanguage =
  | "Korean"
  | "English"
  | "Japanese"
  | "ChineseSimplified"
  | "ChineseTraditional";
type PartialSupportLanguage =
  | "French"
  | "Spanish"
  | "SpanishLatin"
  | "Portuguese"
  | "PortugueseLatin"
  | "Indonesian"
  | "German"
  | "Russian"
  | "Thai"
  | "Vietnamese";
type SupportLanguage = FullSupportLanguage | PartialSupportLanguage;

async function fetchL10n(language: SupportLanguage) {
  const path = "/v1/l10n/" + language;
  const url = endPoint + path;
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

async function fetchGame(gameId: number) {
  const path = `/v1/games/${gameId.toString()}`;
  const url = endPoint + path;
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

enum MatchingTeamMode {
  solo = 1,
  duo = 2,
  squad = 3,
}

async function fetchRankers(
  seasonId: number,
  matchingTeamMode: MatchingTeamMode
) {
  const path = `/v1/rank/top/${seasonId.toString()}/${matchingTeamMode}`;
  const url = endPoint + path;
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

async function fetchUserRank(
  userNum: number,
  seasonId: number,
  matchingTeamMode: MatchingTeamMode
) {
  const path = `/v1/rank/${userNum.toString()}/${seasonId.toString()}/${matchingTeamMode}`;
  const url = endPoint + path;
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

async function fetchUserGames(userNum: number, next: number | null = null) {
  const path = `/v1/user/games/${userNum.toString()}`;
  const url = endPoint + path + (next ? `?next=${next.toString()}` : "");
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

async function fetchUserStats(userNum: number, seasonId: number) {
  const path = `/v1/user/stats/${userNum.toString()}/${seasonId.toString()}`;
  const url = endPoint + path;
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
  const [error, data] = await tryOperation(
    // fetchMetaType("hash")
    // fetchL10n("Korean")
    // fetchGame(33788791)
    fetchGame(33788795) // not found
    // fetchFreeCharacters(MatchingMode.Normal)
    // fetchRankers(3, MatchingTeamMode.squad)
    // fetchUserGames(1177444)
    // fetchUserGames(1177444, 33703474)
    // fetchUserByNickname("핵사용자")
    // fetchUserStats(1177444, 18)
  );
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);

  // for (let i = 0; i < 10; ++i) {
  //   const [error, data] = await tryOperation(fetchGame(33788791 + i));
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }

  //   console.log(data);
  // }

  // if (error) {
  //   console.error(error);
  // } else {
  //   console.log(data);
  // }

  console.log("Done");
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
async function tryOperation<T>(
  promise: Promise<T>
): Promise<[null, any] | [unknown, null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}
