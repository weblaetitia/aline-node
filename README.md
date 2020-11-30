# Aline back


## Postgres

```sh
# start postgres
docker-compose up --build

# migrate DB
./node_modules/.bin/knex migrate:latest

# stop postgres
docker-compose down

```

## Démarrer l'application

### en local

```sh
# start app
npm start
```

### avec docker

```sh
# build image
docker image build -t aline-back .

# start container
docker run --rm -p 3000:3000 --env-file .env aline-back

```

## Acceder à l'application

http://localhost:3000
