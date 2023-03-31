CREATE TABLE utilisateurs(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    surname VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL,
    phone_number VARCHAR(256) NOT NULL,
    create_at TIMESTAMP NOT NULL DEFAULT GETDATE(),
    active BOOL NOT NULL DEFAULT true,
    role ENUM('utilisateur', 'recruteur', 'administrateur') DEFAULT 'utilisateur');

CREATE TABLE organisations(
    siren VARCHAR(256) NOT NULL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    type VARCHAR(256) NOT NULL,
    address VARCHAR(256) NOT NULL 
);

CREATE TABLE workflows(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(256) NOT NULL,
    hours INT NOT NULL,
    remote BOOL NOT NULL,
    day_off INT NOT NULL
);

CREATE TABLE salarys(
   id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
   average_salaray FLOAT NOT NULL,
   min_salaray FLOAT NOT NULL,
   max_salaray FLOAT NOT NULL 
);

CREATE TABLE fiche_postes(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(256) NOT NULL,
    status VARCHAR(256) NOT NULL,
    type VARCHAR(256) NOT NULL,
    address VARCHAR(256) NOT NULL,
    description VARCHAR(256) NOT NULL,
    responsable int NOT NULL,
    workflow int NOT NULL,
    salary int NOT NULL,
    FOREIGN KEY (responsable) REFERENCES utilisateurs(id),
    FOREIGN KEY (workflow) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (salary) REFERENCES salarys(id) ON DELETE CASCADE
);

CREATE TABLE offre_emplois(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    status ENUM('draft', 'published', 'expired') DEFAULT 'draft',
    valid_date TIMESTAMP NOT NULL,
    description TEXT,
    fiche int NOT NULL,
    organisation VARCHAR(256) NOT NULL,
    FOREIGN KEY (fiche) REFERENCES fiche_postes(id),
    FOREIGN KEY (organisation) REFERENCES organisations(siren)
);

CREATE TABLE candidatures(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    date DATETIME NOT NULL,
    user int NOT NULL,
    offre int NOT NULL,
    FOREIGN KEY (user) REFERENCES utilisateurs(id),
    FOREIGN KEY (offre) REFERENCES offre_emplois(id)
);

CREATE TABLE pieces_jointes(
    id int NOT NULL,
    filepath VARCHAR(256) NOT NULL,
    categorie VARCHAR(256) NOT NULL,
    candidature int NOT NULL,
    FOREIGN KEY (candidature) REFERENCES candidatures(id)
);