import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { FetchResponse } from "openapi-fetch";
import { MediaType } from "openapi-typescript-helpers";
import z from "zod";

export const access_token_zod = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.literal("Bearer"),
  scope: z.any().optional(),
  refresh_token: z.string(),
  user_id: z.number().optional(),
});

export function fetchRespWarp<
  T extends Record<string | number, any>,
  O,
  M extends MediaType
>(resp: FetchResponse<T, O, M>): CallToolResult | Promise<CallToolResult> {
  if (resp.response.status === 204)
    return {
      content: [
        {
          type: "text",
          text: "success!",
        },
      ],
    };
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(resp.data ?? resp.error),
      },
    ],
  };
}
