FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY scripts ./scripts
COPY src ./src

ENV NODE_ENV=production

ARG DATABASE_URL
RUN DATABASE_URL=$DATABASE_URL npm run build

EXPOSE 3000

CMD ["npm", "start"]
