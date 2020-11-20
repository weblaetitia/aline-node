# type d'image docker
FROM node:12-alpine

# nom du dossier courant
WORKDIR /app

# dans l'ordre d'exectuion
# copier tous les fichiers dont on a besoin, insatler les dépendances
# on passe pas .env
COPY package.json /app
COPY package-lock.json /app
RUN npm i
COPY bin /app/bin/
COPY models /app/models/
COPY public /app/public/
COPY routes /app/routes/
COPY views /app/views/
COPY app.js /app

# demarer le serveur
ENTRYPOINT [ "npm", "start" ]
