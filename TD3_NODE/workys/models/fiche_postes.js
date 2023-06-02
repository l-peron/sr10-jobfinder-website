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
}