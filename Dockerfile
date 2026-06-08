FROM node:22-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080

CMD ["node", "src/index.js"]
