import { z } from "zod";

export const addUserReqValidator = z.object({
  identity: z.string(),
  name: z.string(),
  roomName: z.string().uuid(),
  metadata: z.string().optional(),
  creatorAddress: z.string().optional(),
});

export type AddUserRequest = z.infer<typeof addUserReqValidator>;

export const addUserResValidator = z.object({
  token: z.string(),
  id: z.string(),
});
