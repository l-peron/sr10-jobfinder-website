var db = require('./db.js');

module.exports = {
    read: function(title, callback) {
        sql = "SELECT * FROM fiche_postes WHERE title LIKE '%?%'";
        db.query(sql, db.escape(title), function(err, results) {
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