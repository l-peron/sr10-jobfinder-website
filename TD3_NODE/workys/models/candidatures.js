var db = require('./db.js');

module.exports = {
    apply: function(offre, user_id, callback) {
        sql = "INSERT INTO candidatures (`user`, `offre`) VALUES (?, ?)";
        db.query(sql, [user_id, offre], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },

    addPiece: function(candidature_id, filepath, type, callback) {
        sql = "INSERT INTO pieces_jointes (`candidature`, `filepath`, `categorie`) VALUES (?, ?, ?)";
        db.query(sql, [candidature_id, filepath, type], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
}