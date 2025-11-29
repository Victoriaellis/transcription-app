import { initClient } from "@ts-rest/core";
import { appContract } from "../contracts";

export const client = initClient(appContract, {
  baseUrl: "http://localhost:3000",
  baseHeaders: {},
});
