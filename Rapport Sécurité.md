# Liste des failles de sécurité qui auraient pu être exploitées mais ont été sécurisées

## Injection SQL

Depuis la création du site, il a été choisi que les requêtes soient paramétrées. Ainsi, les utilisateurs malicieux ne pourront pas utiliser les différentes entrées de texte afin d'injecter du code SQL. Par exemple, il n'est pas possible dans la page de connexion d'utiliser une requête afin de récupérer tous les comptes utilisateurs.

## Cross site scripting (XSS)

On despécialise les caractères donc il n'est pas possible d'éxecuter de script. Donc si on tappe une instrution JS dans les inputs du site il ne se passera rien.

## Violation de contrôle d'accès

Afin de contrôler les violations d'URLs, nous avons instauré un middleware s'éxécutant sur l'ensemble des routes. Ainsi, même si un utilisateur connaîtrait une URL qui permettrait d'accéder à des informations auxquels il n'a pas accès, le middleware permettra d'empêcher l'exécution de la route concernée. Nous avons procédé à cette implémentation dès le début car nous avions déjà entendu parler du problème.

![](images/middleware.png)

## Violation de gestion de session

La session est retournée par cookie et non dans l'URL donc il n'est pas possible pour un pirate de recupérer la session d'un utilisateur via une URL volée. Cependant le cookie n'est pas encrypté, cette protection a lors ses failles dès lors d'un pirate réussit à récupérer le cookie de session d'un utilisateur.

## Chiffrement des données sensibles

Afin de protéger les données sensibles, les mots de passes sont stockées sous forme de hash et ne sont donc pas récupérables. Ainsi, si nous subissons une faille d'accès SQL, les mots de passes seront quand même sécurisés.

![](images/hash.png)

## Scripts de redirection

Les scripts de redirection essaient d'inclure des URLs malicieuses à l'aide de script JS. Afin de contrer ce problème, nous avons codé toutes nos redirections en dur afin qu'il ne soit pas possible de générer une redirection non contrôlée.

![](images/redirection.png)