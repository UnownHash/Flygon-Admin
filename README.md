# Flygon Admin

## Pre Requisites

1. [Go 1.20](https://go.dev/doc/install)
2. [Node 18](https://nodejs.org/en/download)
3. [Yarn 1.22](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
4. [Flygon](https://github.com/UnownHash/Flygon)
5. [Golbat](https://github.com/UnownHash/Golbat) (Optional)

## Standard Setup

1. Clone Repo

```bash
git clone https://github.com/UnownHash/Flygon-Admin.git`
```

2. Create the config file

```bash
cp config.toml.example config.toml
```

3. Fill out the config file

```bash
nano config.toml
```

4. Compile the client

```bash
cd client
yarn install
yarn build
```

5. Compile the server

```bash
cd ../server
go build
```

6. Run server

```bash
./server
```

### Updating

1. Pull repo

```bash
git pull
```

2. Repeat steps 4-6 from the [standard setup](#standard-setup)

## PM2 Setup

1. Install PM2

```bash
npm install pm2 -g
```

2. Follow steps 1-5 from the [standard setup](#standard-setup)
3. From the `server` directory, add to PM2:

```bash
pm2 start server --name "Flygon-Admin"
```

4. Save PM2 processes

```bash
pm2 save
```

### Updating

1. Follow steps 4-5 from the [standard setup](#standard-setup)
2. Restart PM2 process

```bash
pm2 restart Flygon-Admin
```

## Docker Setup

1. Copy docker-compose file

```bash
cp docker-compose.yml docker-compose.override.yml
```

2. Fill out the docker-compose.override.yml file, not the docker-compose.yml file

```bash
nano docker-compose.override.yml
```

3. Run docker-compose

```bash
docker-compose up -d
```

### Updating

```bash
docker-compose pull
docker-compose down
docker-compose up -d
```

## Development

### Pre Requisites

1. Same as above
2. [gow](https://github.com/bmatzelle/gow) (Recommended)

### Terminal 1

Run the client in dev mode with hot reloading

```bash
cd client
yarn install
yarn dev
```

### Terminal 2

Run the server in dev mode with file watching

```bash
cd server
gow run . # or go run .
```
