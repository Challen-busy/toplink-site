import { z } from "zod";

export const chatMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty").max(4000),
  pageUrl: z.string().max(500).optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export const adminReplySchema = z.object({
  content: z.string().min(1, "Reply cannot be empty").max(4000),
});

export type AdminReplyInput = z.infer<typeof adminReplySchema>;
