import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getPayments } from "../storage/redis";
import { CreatePayment } from "../interfaces";
import { getPaymentsSchema } from "../lib/zod";

export const getPaymentsByPeriod: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/payments-summary",
    {
      schema: {
        querystring: getPaymentsSchema,
      },
    },
    async (request, reply) => {
      const from = request.query.from
        ? new Date(request.query.from)
        : undefined;
      const to = request.query.to ? new Date(request.query.to) : undefined;

      const { payments } = await getPayments(from, to);

      const mapperPayments = payments.map((payment) => {
        const { amount, correlationId, processor } = JSON.parse(
          payment
        ) as CreatePayment;
        return {
          amount,
          correlationId,
          processor,
        };
      });

      const data = mapperPayments.reduce(
        (acc, payment) => {
          if (acc[payment.processor]) {
            acc[payment.processor].totalRequests += 1;
            acc[payment.processor].totalAmount += payment.amount;
          } else {
            acc[payment.processor] = {
              totalRequests: 1,
              totalAmount: payment.amount,
            };
          }
          return acc;
        },
        {
          default: {
            totalRequests: 0,
            totalAmount: 0,
          },
          fallback: {
            totalRequests: 0,
            totalAmount: 0,
          },
        }
      );

      return reply.status(200).send(data);
    }
  );
};
