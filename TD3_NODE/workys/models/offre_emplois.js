var db = require('./db.js');

module.exports = {
    readAll: function(callback) {
        sql = "SELECT * FROM offre_emplois";
        db.query(sql, db.escape(title), function(err, results) {
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
}