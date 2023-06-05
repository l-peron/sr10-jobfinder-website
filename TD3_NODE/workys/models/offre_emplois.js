var db = require('./db.js');

module.exports = {
    readAll: function(callback) {
        sql = "SELECT * FROM offre_emplois";
        db.query(sql, db.escape(title), function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readAllWithExtendedInfos: function(callback) {
        sql = "SELECT offre_emplois.id, offre_emplois.status, offre_emplois.valid_date, offre_emplois.description, fiche_postes.title, fiche_postes.status AS poste_status, fiche_postes.type, fiche_postes.address, fiche_postes.description AS poste_description, fiche_postes.responsable, salarys.max_salary, salarys.min_salary, salarys.average_salary, workflows.hours, workflows.remote, workflows.day_off, organisations.name FROM offre_emplois INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id INNER JOIN salarys ON fiche_postes.salary = salarys.id INNER JOIN workflows ON fiche_postes.workflow = workflows.id INNER JOIN organisations ON fiche_postes.organisation = organisations.siren";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    read: function(organization, callback) {
        sql = "SELECT * FROM offre_emplois WHERE organisation = ?";
        db.query(sql, [organization], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    create: function(valid_date, description, fiche, org_siren, callback) {
        sql= "INSERT INTO offre_emplois (valid_date, description, fiche, organisation) VALUES (?, ?, ?, ?)";
        db.query(sql, [valid_date, description, fiche, org_siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    }
}