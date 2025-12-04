// src/api/processApi.ts
// import { httpClient } from "./httpClient";
// import type { Process } from "../store/processStore";

// export const processApi = {
//   getAll: () => httpClient.get<Process[]>("/processes"),

//   start: (name: string) =>
//     httpClient.post(`/processes/${name}/start`),

//   stop: (name: string) =>
//     httpClient.post(`/processes/${name}/stop`),

//   startAll: () =>
//     httpClient.post("/processes/start-all"),

//   stopAll: () =>
//     httpClient.post("/processes/stop-all"),
// };

// src/api/processApi.ts
import { mockApi } from "./mockApi";

export const processApi = {
  getAll: () => mockApi.getProcesses(),
  start: (name: string) => mockApi.startProcess(name),
  stop: (name: string) => mockApi.stopProcess(name),
  startAll: () => mockApi.startAll(),
  stopAll: () => mockApi.stopAll(),
};
