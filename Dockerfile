# Migration image
FROM node:24-bookworm-slim  AS migration

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src

CMD ["npm", "run", "migrate:up"]

# Production image
FROM node:24-bookworm-slim  AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
