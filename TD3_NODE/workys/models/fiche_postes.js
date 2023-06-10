var db = require('./db.js');

module.exports = {
    readByTitle: function(title, callback) {
        sql = "SELECT * FROM fiche_postes WHERE title LIKE '%?%'";
        db.query(sql, db.escape(title), function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readByOrganization: function(org_siren, callback) {
        sql = "SELECT * FROM fiche_postes WHERE organisation = ?";
        db.query(sql, [org_siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM fiche_postes";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    createFichePoste: function(title, status, type, address, description, resp_id, workflow_id, salary_id, org_id, callback) {
        sql = "INSERT INTO fiche_postes (title, status, type, address, description, responsable, workflow, salary, organisation) VALUES (?,?,?,?,?,?,?,?,?)";
        db.query(sql, [title, status, type, address, description, resp_id, workflow_id, salary_id, org_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    }
}