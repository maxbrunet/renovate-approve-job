FROM docker.io/library/node:24.17.0-alpine@sha256:156b55f92e98ccd5ef49578a8cea0df4679826564bad1c9d4ef04462b9f0ded6

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
