FROM docker.io/library/node:22.17.0-alpine@sha256:0f2b9a8d6a7c915b006beeaf41c5675a3e92d7ba548bb9a42263a3cac1e15867

LABEL \
  org.opencontainers.image.source="https://github.com/maxbrunet/renovate-approve-job" \
  org.opencontainers.image.url="https://github.com/maxbrunet/renovate-approve-job" \
  org.opencontainers.image.licenses="ISC"

WORKDIR /opt/app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --production

COPY index.js .

USER 1000:1000

CMD ["index.js"]
