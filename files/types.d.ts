import fastify from 'fastify';

declare module 'fastify' {
  interface FastifyInstance extends (typeof fastify) {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
