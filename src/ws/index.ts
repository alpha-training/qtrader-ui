import { config } from "../config";
import { mockWsClient } from "./mockWsClient";
import { wsClient as realWsClient } from "./wsProvider";

export const wsClient =
  config.apiMode === "real" ? realWsClient : mockWsClient;

console.log("WS client:", config.apiMode === "real" ? "REAL" : "MOCK");
