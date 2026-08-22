FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY api/package*.json ./api/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm ci

COPY api/tsconfig.json ./api/
COPY api/prisma ./api/prisma
COPY api/prisma.config.ts ./api/
COPY api/scripts ./api/scripts
COPY api/src ./api/src
COPY packages/contracts/src ./packages/contracts/src
COPY packages/contracts/tsconfig.json ./packages/contracts/

ENV NODE_ENV=production

ARG DATABASE_URL
RUN DATABASE_URL=$DATABASE_URL npm run build --workspace=@kubechat/contracts && \
    DATABASE_URL=$DATABASE_URL npm run build --workspace=api

EXPOSE 3000

CMD ["npm", "start", "--workspace=api"]
