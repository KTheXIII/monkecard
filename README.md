# monkecard

`monkecard` is a card memo and a quiz game. Build in mind that the data source can be supplied from other external servers.

Build with Snowpack, ReactJS, tailwindcss and TypeScript.

## Requirements

  - [nodejs](https://nodejs.dev)

## Development

Installs the packages

```
yarn
```

Run development server

```
yarn dev
```

Run tests

```
yarn test
```

## Production

### Static

Before building run the test script first, build production

```
yarn build
```

### Docker

Build with docker with `production` enviroment

```
docker build --build-arg mode=production -t monkecard .
```

Run docker image

```
docker run -d --name container_name -p port_bind:80 monkecard
```
