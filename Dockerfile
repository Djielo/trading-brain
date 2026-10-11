FROM node:20-slim
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copier d'abord le package.json du sous-paquet
COPY package.json ./

# Installer les dépendances, incluant brain-core depuis npm
RUN npm install --production

# Copier le code déjà compilé
COPY dist ./dist

# Créer le répertoire de données
RUN mkdir -p /data
ENV TRADING_BRAIN_DATA_DIR=/data

EXPOSE 7779 7780

CMD ["node", "dist/index.js", "daemon"]