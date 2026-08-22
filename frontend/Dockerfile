FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm ci

COPY frontend ./frontend
COPY packages/contracts ./packages/contracts

RUN npm run build --workspace=@kubechat/contracts

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN npm run build --workspace=frontend


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/.next ./frontend/.next

WORKDIR /app/frontend

EXPOSE 3000

CMD ["npm", "start"]