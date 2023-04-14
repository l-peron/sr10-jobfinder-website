var db = require('./db.js');

module.exports = {
    read: function(siren, callback) {
        sql = "SELECT * FROM utilisateurs WHERE siren = ?";
        db.query(sql, siren, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM organisations";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    createOrganisation: function(siren, name, type, address, callback) {
        sql = "INSERT INTO organisations VALUES (?, ?, ?, ?)"
        db.query(sql, [siren, name, type, address], function(err, results) {
            callback(results);
        });
    },
    modifyOrganisation: function(siren, name, type, address, callback) {
        sql = "UPDATE organisations SET name=?, type=?, address=? WHERE siren=?"
        db.query(sql, [name, type, address, siren, id], function(err, results) {
            callback(results);
        });
    },
    deleteOrganisation: function(siren, callback) {
        sql = "DELETE FROM organisations WHERE siren=?"
        db.query(sql, [siren], function(err, results) {
            callback(results);
        });
    },
}