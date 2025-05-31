FROM docker.io/library/node:22.16.0-alpine@sha256:d0baf824e0a29bc98d01988ba32505cf58dc09ccb90cace4e067a8001611262f

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
