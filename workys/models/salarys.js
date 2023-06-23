var db = require('./db.js');

module.exports = {
    read: function(id, callback) {
        sql = "SELECT * FROM salarys WHERE id=?";
        db.query(sql, [id], function(err, results) {
            callback(err, results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM salarys";
        db.query(sql, function(err, results) {
            callback(err, results);
        });
    },
    createSalary: function(avgSalary, minSalary, maxSalary, callback) {
        sql = "INSERT INTO salarys (average_salary, min_salary, max_salary) VALUES (?, ?, ?)"
        db.query(sql, [avgSalary, minSalary, maxSalary], function(err, results) {
            callback(err, results);
        });
    },
    modifySalary: function(id, avgSalary, minSalary, maxSalary, callback) {
        sql = "UPDATE salarys set average_salary=?, min_salary=?, max_salary=? WHERE id=?"
        db.query(sql, [avgSalary, minSalary, maxSalary, id], function(err, results) {
            callback(err, results);
        });
    },
    deleteSalary: function(id, callback) {
        sql = "DELETE FROM workflows WHERE id=?"
        db.query(sql, id, function(err, results) {
            callback(err, results);
        });
    },
}