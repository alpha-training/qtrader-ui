import { mockWsClient } from "./mockWsClient";
import type { IWebSocketClient } from "./IWebSocketClient";

export const wsClient: IWebSocketClient = mockWsClient;
// Later: swap to real client
// export const wsClient: IWebSocketClient = realWsClient;
