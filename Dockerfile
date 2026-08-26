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
# nginx's stock mime.types has no entry for .mjs (e.g. pdfjs-dist's worker
# chunk), so it falls back to application/octet-stream — which browsers
# reject for module scripts/workers ("Failed to load module script: ...
# non-JavaScript MIME type"). Map it alongside .js.
RUN sed -i '/application\/javascript *js;/a\    application/javascript                           mjs;' /etc/nginx/mime.types
EXPOSE 80
