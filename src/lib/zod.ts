import z from "zod";

export const createPaymentSchema = z.object({
  amount: z.coerce.number(),
  correlationId: z.string(),
});

export const getPaymentsSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});