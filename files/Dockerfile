FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S fastify -u 1001

RUN chown -R fastify:nodejs /app
USER fastify

EXPOSE 3000

CMD ["npm", "start"]