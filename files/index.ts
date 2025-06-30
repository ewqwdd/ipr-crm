import dotenv from 'dotenv';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import path from 'path';
import fs from 'fs';
import multipart, { MultipartFile } from '@fastify/multipart';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';

dotenv.config();

const app = Fastify({
  logger:
    process.env.NODE_ENV === 'production'
      ? true
      : {
          level: 'info',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        },
});

app.register(multipart);
app.register(cookie);
app.register(jwt, {
  secret: process.env.JWT_SECRET!,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
});

const UPLOAD_DIR = path.join(process.cwd(), '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.register(fastifyStatic, {
  root: path.join(UPLOAD_DIR),
  maxAge: '1h',
});

app.decorate(
  'authenticate',
  async function (req: FastifyRequest, reply: FastifyReply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  },
);

app.post(
  '/upload',
  { preHandler: [app.authenticate] },
  async (req: FastifyRequest, reply: FastifyReply) => {
    const data: MultipartFile = await (req as any).file();
    const filePath = path.join(UPLOAD_DIR, data.filename);

    await fs.promises.writeFile(filePath, await data.toBuffer());
    reply.send({ success: true, filename: data.filename });
  },
);

app.get(
  '/uploads/*',
  { preHandler: [app.authenticate] },
  async (req: FastifyRequest, reply: FastifyReply) => {
    const fileName = (req.params as any)['*'];
    const filePath = path.join(UPLOAD_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return reply.code(404).send({ error: 'Not found' });
    }

    return reply.sendFile(fileName);
  },
);

app.listen({ port: Number(process.env.PORT) || 3005 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
