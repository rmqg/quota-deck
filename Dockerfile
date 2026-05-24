FROM node:22-alpine

RUN apk add --no-cache ca-certificates
RUN npm install -g @openai/codex@0.133.0

WORKDIR /app

COPY package.json server.js ./
COPY public ./public
COPY data/accounts.example.json ./data/accounts.example.json

ENV NODE_ENV=production
ENV DATA_DIR=/data
ENV PORT=8787

EXPOSE 8787

CMD ["node", "server.js"]
