# WORKYS README.md

Un projet par <b>Léo Peron</b> et <b>Eugène Valty</b>, dans le cadre de l'UV <b>SR10</b>

## Structure du projet

Les sources du projet sont disponibles sous `/workys`

- Le dossier `/workys/models` contient les modèles JavaScript représentant les modèles. Ils sont responsables des communications avec la base de donnée.
- Le dossier `/workys/private` contient tous les fichiers privés (comme par exemple `/workys/private/files` qui contient tous les fichiers déposé sur le site)
- Le dossier `/workys/public` contient tous les fichiers accessibles sur le site (images publiques, scripts JavaScript, stylesheets, ...)
- Le dossier `/workys/routes` contient tous les fichiers JavaScript gérant le routage. Le routage est découpé en sous module (selon les sous routes. Par exemple `http://domain/recruiter` est routé par `/workys/routes/recruiter.js`).
- Le dossier `/workys/tests` contient les tests unitaire sur le site. Cette partie possède un unique test (comme vu dans le TD5), mais ne va pas plus loin.
- Le dossier `/workys/views` contient tous les fichiers templates `.ejs`, étant rendu par les routes. Les templates `.ejs` sont arrangés en sous dossier respectant l'architecture des URL. Par exemple, `http://domain/recruiter/requests/list` représente le template `/workys/views/recruiter/requests/list.ejs`
- Le fichier `/workys/.env` gère l'environnement (les credentials de DB, les variables d'environnement (comme le nombre d'annonce par page), ...). Il n'est pas déposé sur le repo, mais un exemple `/workys/.env.example` est versionné pour permettre l'intégration par n'importe quel développeur.
- Le fichier `/workys/app.js` contient le "coeur" de l'application. Il route le serveur vers toutes les sous routes, gère les dépendances, etc...

### Modélisation

1. UML
    L'UML définit au début du projet est disponible sous `/ressources/UML.png`
2. MLD
    Le MLD définit au début du projet est disponible sous `/ressources/MLD.md`
3. SQL
    - Le SQL définit au début du projet est disponible sous `/sql/start`
    - Le projet ayant subit des évolutions lors de la conception, le SQL final a été exporté et est disponible sous `/sql/final`
4. Carte du site
    - La carte du site est disponible sous `/ressources/diagramme_cas.png`

## Comment le lancer

Le projet (si bien configuré) peut être lancé par n'importe qui

### Dépendances

Le projet requiert `Node`.
Pour installer les dépendances il faut éxecuter `npm install`

### Lancement

Le projet est lançable via `npm start`