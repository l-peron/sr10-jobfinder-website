Utilisateur(<ins>id</ins>,name, surname, email, password, phone_number, create_at, status)

Recruteur(<ins>#user_id</ins>) 
<br />#user_id: PK ET FK **Utilisateur**

Administrateur(<ins>#user_id</ins>) 
<br />#user_id: PK ET FK **Utilisateur**

Orgnisation(<ins>siren</ins>, name, type, location)

OffreEmploi(<ins>id</ins>, status, valid_date, description, #fiche_id, #organisation _id) 
<br />#fiche_id: FK **FichePoste** 
<br />#organisation_id: FK **Organisation**

FichePoste(<ins>id</ins>, title, status, responsable, type, location, description, #workflow_id, #salaire_id)
<br />#workflow_id: FK **Workflow** 
<br />#salaire_id: FK **Salaire**

Workflow(<ins>id</ins>, description, hours, remote, day_off)

Salaire(<ins>id</ins>, average_salary, min_salaray, max_salary)

Candidature(<ins>id</ins>, date, #user_id, #offre_id)
<br />#user_id: FK **Utilisateur**
<br />#offre_id: FK **OffreEmploi**

PiecesJointes(<ins>id</ins>, filepath, categorie, #candidature_id)
#candidature_id: FK **Candidature**

