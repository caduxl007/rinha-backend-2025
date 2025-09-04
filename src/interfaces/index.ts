export interface CreatePayment {
  amount: number;
  correlationId: string;
  processor: "default" | "fallback";
}
