import { getApiKey } from "./api";
import { ApiClient, MatchingMode, MatchingTeamMode } from "./api-client";
import fs from "fs";
import * as bson from "bson";

const endPoint = "https://open-api.bser.io";

const apiKey = getApiKey();
if (!apiKey) {
  process.exit(1);
}

const apiClient = new ApiClient(apiKey, endPoint, 50);

// apiClient.fetchMetaType("hash").then((data) => {
//   console.log(`fetchMetaType("hash") resolved`);
// });
// apiClient.fetchL10n("Korean").then((data) => {
//   console.log(`fetchL10n("Korean") resolved`);
// });
// apiClient.fetchGame(33788791).then((data) => {
//   console.log(`fetchGame(33788791) resolved`);
// });
// apiClient.fetchGame(33788795, true).then((data) => {
//   console.log(`fetchGame(33788795) resolved`);
// }); // 404
// apiClient.fetchFreeCharacters(MatchingMode.Normal).then((data) => {
//   console.log(`fetchFreeCharacters(MatchingMode.Normal) resolved`);
// });
// apiClient.fetchRankers(3, MatchingTeamMode.squad).then((data) => {
//   console.log(`fetchRankers(3, MatchingTeamMode.squad) resolved`);
// });
// apiClient.fetchUserGames(1177444).then((data) => {
//   console.log(`fetchUserGames(1177444) resolved`);
// });
// apiClient.fetchUserGames(1177444, 33703474).then((data) => {
//   console.log(`fetchUserGames(1177444, 33703474) resolved`);
// });
apiClient.fetchUserByNickname("핵사용자", true).then((data) => {
  if (data.code === 200) {
    // const fileName = `data/user-v1/${data.user.userNum}.bson`;
    // // convert js object to bson
    // const newData = bson.serialize(data);
    // if (!fs.existsSync(fileName)) {
    //   if (!fs.existsSync("data/user-v1")) {
    //     fs.mkdirSync("data/user-v1", { recursive: true });
    //   }
    // } else {
    //   // 중복된 데이터인지 확인
    //   const oldData = readFile(fileName);
    //   if (oldData === null) {
    //     return;
    //   }
    //   if (oldData.equals(newData)) {
    //     console.log("Data is already saved.");
    //     return;
    //   }
    // }
    // writeFile(fileName, newData);
  }
});

function readFile(fileName: string) {
  try {
    return fs.readFileSync(fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function writeFile(fileName: string, data: any) {
  try {
    fs.writeFileSync(fileName, data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// apiClient.fetchUserStats(1177444, 0).then((data) => {
//   console.log(`fetchUserStats(1177444, ${0}) resolved`);
//   console.log(data);
// });

// 0만 조회됨..
// for (let i = 0; i < 30; ++i) {
//   apiClient.fetchUserStats(1177444, i).then((data) => {
//     console.log(`fetchUserStats(1177444, ${i}) resolved`);
//     if (data.code !== 404) {
//       console.log(data);
//     }
//   });
// }

// /**
//  * Wraps a Promise to return an array with the first element as any error and the second as the result ([error, result]).
//  * Note: Within this Promise, do not throw `null` as an error. Throwing `null`
//  *
//  * @param promise The Promise to be executed.
//  * @returns On success: [null, result],
//  *          On failure: [error, null].
//  */
// async function tryOperation<T>(
//   promise: Promise<T>
// ): Promise<[null, any] | [unknown, null]> {
//   try {
//     const data = await promise;
//     return [null, data];
//   } catch (error) {
//     return [error, null];
//   }
// }
