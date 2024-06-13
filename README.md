## Description

This app is a betting odds aggregator REST API. Currently it only supports Flashscore.pl as a data provider.

## Installation

### Docker compose

1. Pull this repository
2. Navigate to root folder
3. Run

```bash
$ docker compose up
```

4. Application should be listening on port `3000`.

### Manual installation

1. Pull this repository
2. Navigate to root folder
3. Set your `DATABASE_URL` in .env file
4. Run

```bash
$ npm i
```

5. Run

```bash
$ npm run prisma:migrate
```

6. To start the app run:

```bash
$ npm run start:dev
```

## Test

Run

```bash
$ npm run test
```
