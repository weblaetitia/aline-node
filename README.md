# Aline back
## Lancer l'application avec docker
```sh
# build image
docker image build -t aline-back .

# start container
docker run --rm -p 3000:3000 --env-file .env aline-back

```

## Acceder à l'application
http://localhost:3000