import { initContract } from "@ts-rest/core";
import { analyseContract } from "./analyse";
import { transcriptionsContract } from "./transcriptions";

export const c = initContract();

export const appContract = c.router({
  analyse: analyseContract,
  transcripts: transcriptionsContract,
});
