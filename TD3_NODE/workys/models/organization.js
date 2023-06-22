var db = require('./db.js');

module.exports = {
    read: function(siren, callback) {
        sql = "SELECT * FROM organisations WHERE siren LIKE ?";
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
    createOrganization: function(siren, name, type, address, created_by, callback) {
        sql = "INSERT INTO organisations (siren, name, type, address, created_by) VALUES (?, ?, ?, ?, ?)"
        db.query(sql, [siren, name, type, address, created_by], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    modifyOrganization: function(siren, name, type, address, callback) {
        sql = "UPDATE organisations SET name=?, type=?, address=? WHERE siren=?"
        db.query(sql, [name, type, address, siren, id], function(err, results) {
            callback(results);
        });
    },
    deleteOrganization: function(siren, callback) {
        sql = "DELETE FROM organisations WHERE siren=?"
        db.query(sql, [siren], function(err, results) {
            callback(results);
        });
    },
    setStatus: function(siren, status, callback) {
        sql = "UPDATE organisations SET status=? WHERE siren=?"
        db.query(sql, [status, siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    getOrganizationCreator: function(siren, callback) {
        sql = "SELECT utilisateurs.id, utilisateurs.role FROM organisations "
        + "JOIN utilisateurs ON organisations.created_by = utilisateurs.id "
        + "WHERE organisations.siren=?"
        db.query(sql, [siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
}