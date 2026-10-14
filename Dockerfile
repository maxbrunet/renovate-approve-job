FROM docker.io/library/node:24.22.0-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f

LABEL \
  org.opencontainers.image.source="https://github.com/maxbrunet/renovate-approve-job" \
  org.opencontainers.image.url="https://github.com/maxbrunet/renovate-approve-job" \
  org.opencontainers.image.licenses="ISC"

WORKDIR /opt/app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --production

COPY index.js .

USER 1000:1000

CMD ["index.js"]
