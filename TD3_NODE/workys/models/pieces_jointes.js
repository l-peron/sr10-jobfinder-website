var db = require('./db.js');

module.exports = {
    read: function(piece_id, callback) {
        sql = "SELECT * FROM pieces_jointes WHERE id = ?";
        db.query(sql, [piece_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readByCandidatureId: function(candidature_id, callback) {
        sql = "SELECT * FROM pieces_jointes WHERE candidature = ?";
        db.query(sql, [candidature_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    add: function(candidature_id, filename, original_filename, type, callback) {
        sql = "INSERT INTO pieces_jointes (`candidature`, `filename`, `original_filename`, `categorie`) VALUES (?, ?, ?, ?)";
        db.query(sql, [candidature_id, filename, original_filename, type], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    delete: function(piece_id, callback) {
        sql = "DELETE FROM pieces_jointes WHERE id = ?";
        db.query(sql, [piece_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    }
}