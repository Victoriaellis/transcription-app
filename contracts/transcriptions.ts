import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const c = initContract();

export const transcriptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
  analysis: z.object({
    actionItems: z.array(
      z.object({
        description: z.string(),
        owner: z.string().optional(),
        deadline: z.string().optional(),
      })
    ),
    decisions: z.array(z.string()),
  }),
});

export const transcriptionsContract = c.router({
  list: {
    method: "GET",
    path: "/api/transcriptions",
    responses: {
      200: z.object({
        transcriptions: z.array(transcriptionSchema),
      }),
    },
  },
  get: {
    method: "GET",
    path: "/api/transcriptions/:id",
    responses: {
      200: transcriptionSchema,
      404: z.object({
        error: z.string(),
      }),
    },
  },
});
