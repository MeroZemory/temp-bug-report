import { RequestManager } from "./request-manager";

interface APIRequest {
  input: string | URL | globalThis.Request;
  init?: RequestInit | undefined;
}

export type Json = any;

export enum MatchingMode {
  Normal = "2",
  Rank = "3",
}

export type FullSupportLanguage =
  | "Korean"
  | "English"
  | "Japanese"
  | "ChineseSimplified"
  | "ChineseTraditional";
export type PartialSupportLanguage =
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
export type SupportLanguage = FullSupportLanguage | PartialSupportLanguage;

export enum MatchingTeamMode {
  solo = 1,
  duo = 2,
  squad = 3,
}

export class ApiClient {
  private apiKey: string;
  private endPoint: string;
  private requestManager: RequestManager<APIRequest, Json>;

  constructor(apiKey: string, endPoint: string, rpmLimit: number) {
    this.apiKey = apiKey;
    this.endPoint = endPoint;
    this.requestManager = new RequestManager(this.requestHandler, rpmLimit);
  }

  private request(request: APIRequest, isUrgent = false) {
    if (!request.init) {
      request.init = {};
    }

    if (!request.init.headers) {
      request.init.headers = {};
    }

    (request.init.headers as Record<string, string>)["x-api-key"] = this.apiKey;

    return this.requestManager.addRequest(request, isUrgent);
  }

  private async requestHandler(request: APIRequest): Promise<Json> {
    const response = await fetch(request.input, request.init);
    const data = await response.json();
    return data;
  }

  async fetchMetaType(metaType: string, isUrgent = false) {
    const request = {
      input: new URL(`/v2/data/${metaType}`, this.endPoint),
    };

    return this.request(request, isUrgent);
  }

  async fetchFreeCharacters(matchingMode: MatchingMode, isUrgent = false) {
    const request = {
      input: new URL(`/v1/freeCharacters/${matchingMode}`, this.endPoint),
    };
    return this.request(request, isUrgent);
  }

  async fetchL10n(language: SupportLanguage, isUrgent = false) {
    const request = {
      input: new URL(`/v1/l10n/${language}`, this.endPoint),
    };
    return this.request(request, isUrgent);
  }

  async fetchGame(gameId: number, isUrgent = false) {
    const request = {
      input: new URL(`/v1/games/${gameId.toString()}`, this.endPoint),
    };
    return this.request(request, isUrgent);
  }

  async fetchRankers(
    seasonId: number,
    matchingTeamMode: MatchingTeamMode,
    isUrgent = false
  ) {
    const request = {
      input: new URL(
        `/v1/rank/top/${seasonId.toString()}/${matchingTeamMode}`,
        this.endPoint
      ),
    };
    return this.request(request, isUrgent);
  }

  async fetchUserRank(
    userNum: number,
    seasonId: number,
    matchingTeamMode: MatchingTeamMode,
    isUrgent = false
  ) {
    const request = {
      input: new URL(
        `/v1/rank/${userNum.toString()}/${seasonId.toString()}/${matchingTeamMode}`,
        this.endPoint
      ),
    };
    return this.request(request, isUrgent);
  }

  async fetchUserGames(
    userNum: number,
    next: number | null = null,
    isUrgent = false
  ) {
    const request = {
      input: new URL(`/v1/user/games/${userNum.toString()}`, this.endPoint),
    };

    if (next) {
      request.input.searchParams.append("next", next.toString());
    }

    return this.request(request, isUrgent);
  }

  async fetchUserByNickname(nickname: string, isUrgent = false) {
    const request = {
      input: new URL(`/v1/user/nickname?query=${nickname}`, this.endPoint),
    };
    return this.request(request, isUrgent);
  }

  async fetchUserStats(userNum: number, seasonId: number, isUrgent = false) {
    const request = {
      input: new URL(
        `/v1/user/stats/${userNum.toString()}/${seasonId.toString()}`,
        this.endPoint
      ),
    };
    return this.request(request, isUrgent);
  }
}
