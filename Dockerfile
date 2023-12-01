FROM docker.io/library/node:20.10.0-alpine@sha256:9f36e59f46436d29f82b1d35aa5889ea00207dbc735ef154364ac4605797108f

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
