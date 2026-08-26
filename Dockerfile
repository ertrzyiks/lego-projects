# Builds the static site and serves it with nginx. Deployed to Dokku as a
# pre-built image (see .github/workflows/dokku-deploy.yml) — Dokku doesn't
# build this itself, it just runs whatever image CI hands it.

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack install
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
