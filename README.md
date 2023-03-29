# FlyGOn Admin

## Production

### Pre Requisites

1. [Go 1.20](https://go.dev/doc/install)
2. [Node 18](https://nodejs.org/en/download)
3. [Yarn 1.22](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

### Base Setup

1. `cp config.toml.example config.toml`
2. Fill out the config.toml file
3. `cd client && yarn install && yarn build`
4. `cd ../server && go build`
5. `./server`

### Docker Setup

1. `cp docker-compose.yml docker-compose.override.yml`
2. Fill out the docker-compose.override.yml file
3. `docker-compose up -d`

## Development

### Pre Requisites

1. Same as above
2. Recommended: [gow](https://github.com/bmatzelle/gow)

### Terminal 1

1. `cd client && yarn install && yarn dev`

### Terminal 2

1. `cd server && gow run .`

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
