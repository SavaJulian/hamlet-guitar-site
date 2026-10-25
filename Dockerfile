FROM node:22.22.3 AS build
WORKDIR /app
RUN corepack enable
COPY --from=oven/bun:1.3.14 /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG SITE_URL
ARG BASE_PATH=/
RUN SITE_URL="$SITE_URL" BASE_PATH="$BASE_PATH" bun run build

FROM nginx:stable-alpine AS deploy
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
