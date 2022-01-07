# monkecard

`monkecard` is a card memo and a quiz game. Build in mind that the data source can be supplied from other external servers.

Build with Snowpack, ReactJS, tailwindcss and TypeScript.

## Requirements

  - [nodejs](https://nodejs.dev)
  - [pnpm](https://pnpm.io)

## Development

Installs the packages

```
pnpm i
```

Run development server

```
pnpm dev
```

Run tests

```
pnpm test
```

## Production

### Static

Before building run the test script first, build production

```
pnpm build
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

## Planned

  - [ ] Confidence metric
  - [ ] Local data
  - [ ] User dashboard with dataview
  - [ ] Tutorial view
  - [ ] Custom theme
  - [ ] Editor tool for collection and item creation
  - [ ] Server node for data syncing
  - [ ] Language selector
