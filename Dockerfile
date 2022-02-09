FROM node:17-buster as builder
WORKDIR /app

# production, staging, development
ARG mode=production
ENV MODE=$mode

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile
COPY . .
RUN NODE_ENV=$MODE yarn build
RUN yarn post:build

# Serve with Apache httpd
FROM httpd
COPY --from=builder /app/build/ /usr/local/apache2/htdocs/
