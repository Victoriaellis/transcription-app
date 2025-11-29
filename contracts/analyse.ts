import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const analyseContract = c.router({
  analyse: {
    method: "POST",
    path: "/api/analyse",
    body: z.object({
      text: z.string().min(10).max(10000, "Text is too long"),
    }),
    responses: {
      200: z.object({
        transcriptId: z.string(),
        analysis: z.object({
          actionItems: z.array(
            z.object({
              description: z.string(),
              owner: z.string().optional(),
              deadline: z.string().optional(),
            })
          ),
          decisions: z.array(z.string()),
          sentiment: z.string().optional(),
        }),
      }),
    },
  },
});
