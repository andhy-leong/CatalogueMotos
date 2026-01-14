# 🏍️ Catalogue de Motos - Stack Docker NoSQL

Ce projet est une application web de gestion de catalogue de motos utilisant une architecture microservices. Il démontre l'utilisation conjointe de **Cassandra** (orienté colonnes) et **Neo4j** (orienté graphes) pour stocker et manipuler des données.

## 🏗️ Architecture du Projet

Le projet est entièrement conteneurisé avec Docker :

- **Frontend** : Interface utilisateur en HTML/JavaScript servie par Nginx sur le **port 80**.
- **Backend API** : Serveur Node.js (Express) gérant la logique métier sur le **port 3001**.
- **Cassandra DB** : Stockage principal des données techniques des motos.
- **Neo4j DB** : Gestion des relations et des graphes.
- **Data Import** : Service automatique qui peuple les bases de données à partir du fichier `moto.json` au démarrage.

## 🚀 Installation et Démarrage

### Prérequis

- Avoir [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé.

### Lancement

1. Ouvrez un terminal dans le dossier racine `CatalogueMotos`.
2. Lancez la commande suivante :
   ```bash
   docker-compose up --build
   ```
3. Attendez que le message de santé (healthcheck) de Cassandra soit validé pour que l'importation commence.

## 🔗 Accès aux Services

| Service             | URL                                            | Description                           |
| :------------------ | :--------------------------------------------- | :------------------------------------ |
| **Application Web** | [http://localhost](http://localhost)           | Interface de consultation et gestion. |
| **API REST**        | [http://localhost:3001](http://localhost:3001) | Endpoints de l'API Node.js.           |
| **Console Neo4j**   | [http://localhost:7474](http://localhost:7474) | Interface d'exploration des graphes.  |

🛠️ Fonctionnalités
Affichage : Liste dynamique des motos depuis la base de données.

Ajout : Formulaire d'insertion de nouvelles motos.

Suppression : Retrait de références du catalogue.

Recherche : Système de filtrage par critères.

🔑 Identifiants par défaut
Cassandra : admin / admin.

Neo4j : neo4j / neo4jpassword.
