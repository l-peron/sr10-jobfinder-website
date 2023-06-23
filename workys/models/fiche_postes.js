var db = require('./db.js');

module.exports = {
    readByTitle: function(title, callback) {
        sql = "SELECT * FROM fiche_postes WHERE title LIKE '%?%'";
        db.query(sql, db.escape(title), function(err, results) {
            callback(err, results);
        });
    },
    readById: function(id, callback) {
        sql = "SELECT * FROM fiche_postes WHERE id = ?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    },
    readByOrganization: function(org_siren, callback) {
        sql = "SELECT * FROM fiche_postes WHERE organisation = ?";
        db.query(sql, [org_siren], function(err, results) {
            callback(err, results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM fiche_postes";
        db.query(sql, function(err, results) {
            callback(err, results);
        });
    },
    createFichePoste: function(title, status, type, address, description, resp_id, workflow_id, salary_id, org_id, callback) {
        sql = "INSERT INTO fiche_postes (title, status, type, address, description, responsable, workflow, salary, organisation) VALUES (?,?,?,?,?,?,?,?,?)";
        db.query(sql, [title, status, type, address, description, resp_id, workflow_id, salary_id, org_id], function(err, results) {
            callback(err, results);
        });
    },
    updateFichePoste: function(id, title, status, type, address, description, resp_id, callback) {
        sql = "UPDATE fiche_postes SET title=?, status=?, type=?, address=?, description=?, responsable=? WHERE id=?";
        db.query(sql, [title, status, type, address, description, resp_id, id], function(err, results) {
            callback(err, results);
        });
    },
}