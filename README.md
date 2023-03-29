# Flygon Admin

## Production

### Pre Requisites

1. [Go 1.20](https://go.dev/doc/install)
2. [Node 18](https://nodejs.org/en/download)
3. [Yarn 1.22](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
4. [Flygon](https://github.com/UnownHash/Flygon)
5. [Golbat](https://github.com/UnownHash/Golbat) (Optional)

### Base Setup

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

**Updating** 
1. Pull repo
```bash
git pull
```
2. Repeat steps 4-6 above

### Docker Setup

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
`docker-compose up -d`
```

**Updating**
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

## Config.toml

```toml
[general]
host = "0.0.0.0"        # host address
port = 9003             # host port
username = "admin"      # username for login
password = "password"   # password for login

[flygon]                # Flygon API Settings
api_endpoint = "http://127.0.0.1:9002"
api_secret = ""

[golbat]                # Golbat API Settings
api_endpoint = "http://127.0.0.1:9001"
api_secret = ""
```
