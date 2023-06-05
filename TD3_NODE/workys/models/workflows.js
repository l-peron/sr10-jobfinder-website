var db = require('./db.js');

module.exports = {
    read: function(id, callback) {
        sql = "SELECT * FROM workflows WHERE id = ?";
        db.query(sql, id, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM workflows";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    createWorkflow: function(hours, remote, dayOff, callback) {
        sql = "INSERT INTO workflows (hours, remote, day_off) VALUES (?, ?, ?)"
        db.query(sql, [hours, remote, dayOff], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    modifyWorkflow: function(id, hours, remote, dayOff, callback) {
        sql = "UPDATE workflows SET hours=?, remote=?, day_off=? WHERE id=?"
        db.query(sql, [hours, remote, dayOff, id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    deleteWorkflow: function(id, callback) {
        sql = "DELETE FROM workflows WHERE id=?"
        db.query(sql, id, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
}