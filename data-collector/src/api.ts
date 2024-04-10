import * as fs from "fs";
import path from "path";
// import { ApiClient } from "./api-client";

/**
 * Gets the API key
 *
 * @returns On success: { error: null, apiKey: string },
 *          On failure: { error: unknown, apiKey: null }.
 */
export function getApiKey(): string | null {
  const oneDrivePath = process.env.OneDriveConsumer;
  if (!oneDrivePath) {
    console.error("OneDriveConsumer environment variable is not set.");
    return null;
  }

  const apiKeyPath = path.join(
    oneDrivePath,
    "Authentication",
    "eternal-return-open-api.txt"
  );

  try {
    const apiKey = fs.readFileSync(apiKeyPath, "utf8").trim();
    return apiKey;
  } catch (error) {
    console.error(error);
    return null;
  }
}
