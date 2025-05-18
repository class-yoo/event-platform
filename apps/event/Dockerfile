FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter event build

EXPOSE 3000

CMD ["node", "dist/apps/event/src/main"]
