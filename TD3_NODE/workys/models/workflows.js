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
    createWorkflow: function(description, hours, remote, dayOff, callback) {
        sql = "INSERT INTO workflows (description, hours, remote, day_off) VALUES (?, ?, ?, ?)"
        db.query(sql, description, hours, remote, dayOff, function(err, results) {
            callback(results);
        });
    },
    modifyWorkflow: function(id, description, hours, remote, dayOff, callback) {
        sql = "UPDATE workflows set description=?, hours=?, remote=?, day_off=? WHERE id=?"
        db.query(sql, description, hours, remote, dayOff, id, function(err, results) {
            callback(results);
        });
    },
    deleteWorkflow: function(id, callback) {
        sql = "DELETE FROM workflows WHERE id=?"
        db.query(sql, id, function(err, results) {
            callback(results);
        });
    },
}