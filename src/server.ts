import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

async function start() {
  try {
    await server.listen({ port: 9090 });

    server.log.info('server runner');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
