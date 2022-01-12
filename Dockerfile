FROM node:17-buster as builder
WORKDIR /app

ARG mode=production
ENV MODE=$mode

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile
COPY . .
RUN NODE_ENV=$MODE yarn build

# Serve with Apache httpd
FROM httpd
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
