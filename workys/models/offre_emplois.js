var db = require('./db.js');

module.exports = {
    readAll: function(callback) {
        sql = "SELECT * FROM offre_emplois";
        db.query(sql, db.escape(title), function(err, results) {
            callback(err, results);
        });
    },
    readAllWithExtendedInfos: function(callback) {
        sql = `SELECT offre_emplois.id, offre_emplois.status, offre_emplois.valid_date, offre_emplois.required_documents, fiche_postes.description, 
        fiche_postes.title, fiche_postes.status AS poste_status, fiche_postes.type, fiche_postes.address, 
        fiche_postes.description AS poste_description, fiche_postes.responsable, salarys.max_salary, 
        salarys.min_salary, salarys.average_salary, workflows.hours, workflows.remote, workflows.day_off, 
        organisations.name, organisations.siren
        FROM offre_emplois 
        INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id 
        INNER JOIN salarys ON fiche_postes.salary = salarys.id 
        INNER JOIN workflows ON fiche_postes.workflow = workflows.id 
        INNER JOIN organisations ON fiche_postes.organisation = organisations.siren
        ORDER BY offre_emplois.id DESC`;

        db.query(sql, function(err, results) {
            callback(err, results);
        });
    },
    searchAllWithExtendedInfos: function(query, callback) {
        sql = `SELECT offre_emplois.id, offre_emplois.status, offre_emplois.valid_date, offre_emplois.required_documents, fiche_postes.description, 
        fiche_postes.title, fiche_postes.status AS poste_status, fiche_postes.type, fiche_postes.address, 
        fiche_postes.description AS poste_description, fiche_postes.responsable, salarys.max_salary, 
        salarys.min_salary, salarys.average_salary, workflows.hours, workflows.remote, workflows.day_off,
        organisations.name, organisations.siren
        FROM offre_emplois 
        INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id 
        INNER JOIN salarys ON fiche_postes.salary = salarys.id 
        INNER JOIN workflows ON fiche_postes.workflow = workflows.id 
        INNER JOIN organisations ON fiche_postes.organisation = organisations.siren
        WHERE fiche_postes.title LIKE ?
        OR fiche_postes.description LIKE ?
        ORDER BY offre_emplois.id DESC`;

        db.query(sql, [query, query], function(err, results) {
            callback(err, results);
        });
    },
    read: function(organization, callback) {
        sql = "SELECT offre_emplois.*, fiche_postes.title, fiche_postes.status AS poste_status, fiche_postes.type, fiche_postes.address, fiche_postes.description AS poste_description, fiche_postes.responsable, salarys.max_salary, salarys.min_salary, salarys.average_salary, workflows.hours, workflows.remote, workflows.day_off, organisations.name FROM offre_emplois INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id INNER JOIN salarys ON fiche_postes.salary = salarys.id INNER JOIN workflows ON fiche_postes.workflow = workflows.id INNER JOIN organisations ON fiche_postes.organisation = organisations.siren WHERE offre_emplois.organisation = ?";
        db.query(sql, [organization], function(err, results) {
            callback(err, results);
        });
    },
    readWithExtendedInfos: function(id, callback) {
        sql = "SELECT offre_emplois.*, fiche_postes.title, fiche_postes.status AS poste_status, fiche_postes.type, fiche_postes.address, fiche_postes.description AS poste_description, fiche_postes.responsable, salarys.max_salary, salarys.min_salary, salarys.average_salary, workflows.hours, workflows.remote, workflows.day_off, organisations.name, organisations.siren FROM offre_emplois INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id INNER JOIN salarys ON fiche_postes.salary = salarys.id INNER JOIN workflows ON fiche_postes.workflow = workflows.id INNER JOIN organisations ON fiche_postes.organisation = organisations.siren where offre_emplois.id = ?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    },
    create: function(valid_date, fiche, org_siren, required_documents, callback) {
        sql= "INSERT INTO offre_emplois (valid_date, fiche, organisation, required_documents) VALUES (?, ?, ?,?)";
        db.query(sql, [valid_date, fiche, org_siren, required_documents], function(err, results) {
            callback(err, results);
        });
    },
    update: function(id, valid_date, fiche, required_documents, callback) {
        sql= " UPDATE offre_emplois SET valid_date=?, fiche=?, required_documents=? WHERE id=?";
        db.query(sql, [valid_date, fiche, required_documents, id], function(err, results) {
            callback(err, results);
        });
    },
    setPublished: function(id, callback) {
        sql="UPDATE offre_emplois SET status='published' WHERE id=?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    },
    setDrafted: function(id, callback) {
        sql="UPDATE offre_emplois SET status='draft' WHERE id=?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    },
    getMinMaxIncomes: function(callback) {
        sql="SELECT min(min_salary) AS min, max(max_salary) AS max FROM salarys";
        db.query(sql, function(err, results) {
            callback(err, results);
        });
    },
    delete: function(id, callback) {
        sql="DELETE FROM offre_emplois WHERE id = ?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    }
}