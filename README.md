# P7 OpenClassrooms - Groupomania

Créer un réseau social d'entreprise.
Technologies utilisées :

- Vue 3.2 + Pinia + Vue Router + Sass
- Node.js + Express.js + Sequelize + MySQL

## BDD MySQL

Créez un fichier `.env` à la racine du dossier backend, copiez-collez ce qui suit en y ajoutant vos informations :

    DB_HOST=""
    DB_PORT=""
    DB_USER=""
    DB_PASSWORD=""
    DB_NAME=""
    API_PORT="8000"

Les tables se créeront automatiquement lors du lancement du backend

Si `API_PORT` est modifié, veillez à également modifier cette ligne dans le fichier `vite.config.js` qui se trouve à la racine du dossier frontend

> "/api": "http://localhost:8000",

## Frontend

Ouvrir le dossier Frontend dans le terminal de votre éditeur, puis exécuter la commande :

    npm install

Si le navigateur ne s'ouvre pas automatiquement, allez à :

- http://localhost:3000/

## Backend

Ouvrir le dossier Backend dans le terminal de votre éditeur, ensuite exécuter la commande :

    npm install

Ensuite

    npm start

Pour exécuter le frontend et le backend simultanément
