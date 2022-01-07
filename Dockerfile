FROM node:17-buster as builder
WORKDIR /app

ARG mode=production
ENV MODE=$mode

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm i --shamefully-hoist --frozen-lockfile
COPY . .
RUN NODE_ENV=$MODE pnpm build

# Serve with nginx
FROM httpd
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
