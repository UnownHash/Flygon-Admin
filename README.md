# Flygon Admin

[![Discord](https://img.shields.io/discord/1083029607919386654.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/Vjze47qchG)

## Pre Requisites

1. [Go 1.20](https://go.dev/doc/install)
2. [Node 18](https://nodejs.org/en/download)
3. [Yarn 1.22](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
4. [Flygon](https://github.com/UnownHash/Flygon)
5. [Golbat](https://github.com/UnownHash/Golbat) (Optional)

## Standard Setup

1. Clone Repo

   ```bash
   git clone https://github.com/UnownHash/Flygon-Admin.git
   ```

1. Change Directory to the Repo

   ```bash
   cd Flygon-Admin
   ```

1. Create the config file

   ```bash
   cp config.toml.example config.toml
   ```

1. Fill out the config file

   ```bash
   nano config.toml
   ```

1. Install dependencies

   ```bash
   yarn install
   ```

1. Compile the client and server

   ```bash
   yarn build
   ```

1. Run

   ```bash
   yarn start
   ```

### Updating

1. Pull repo

   ```bash
   git pull
   ```

1. Repeat steps 5-7 from the [standard setup](#standard-setup)

## PM2 Setup

1. Install PM2

   ```bash
   npm install pm2 -g
   ```

1. Follow steps 1-6 from the [standard setup](#standard-setup)
1. From the `root` directory, add to PM2:

   ```bash
   pm2 start "yarn start" --name "Flygon-Admin"
   ```

1. Save PM2 processes

   ```bash
   pm2 save
   ```

### Updating

1. Follow steps 5-6 from the [standard setup](#standard-setup)
1. Restart PM2 process

   ```bash
   pm2 restart Flygon-Admin
   ```

## Docker Setup

1. Clone Repo

   ```bash
   git clone https://github.com/UnownHash/Flygon-Admin.git
   ```

1. Change Directory to the Repo

   ```bash
   cd Flygon-Admin
   ```

1. Copy docker-compose file

   ```bash
   cp docker-compose.yml docker-compose.override.yml
   ```

1. Fill out the docker-compose.override.yml file, not the docker-compose.yml file

   ```bash
   nano docker-compose.override.yml
   ```

1. Run docker-compose

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
1. [gow](https://github.com/bmatzelle/gow) (Recommended)

Run the client in dev mode with hot reloading

```bash
yarn install
yarn dev
```
