var db = require('./db.js');

module.exports = {
    read: function(email, callback) {
        sql = "SELECT * FROM utilisateurs WHERE email = ?";
        db.query(sql, email, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readall: function(callback) {
        sql = "SELECT * FROM utilisateurs";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    areValid: function(email, password, callback) {
        sql = "SELECT password FROM utilisateurs WEHRE email = ?";
        db.query(sql, email, function(err, results) {
            if(err) throw err;
            if(results.length === 1 && results[0].password === password) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    createAccount: function(name, surname, email, password, phoneNumber, callback) {
        sql = "INSERT INTO utilisateurs (name, surname, email, password, phone_number) VALUES (?, ?, ?, ?, ?)"
        db.query(sql, [name, surname, email, password, phoneNumber], function(err, results) {
            callback(results);
        });
    },
    modifyAccount: function(id, name, surname, email, phoneNumber, password, callback) {
        sql = "UPDATE utilisateurs SET name=?, surname=?, email=?, phone_number=?, password=? WHERE id=?"
        db.query(sql, [name, surname, email, phoneNumber, password, id], function(err, results) {
            callback(results);
        });
    },
    desactivateAccount: function(id, callback) {
        sql = "UPDATE utilisateurs SET active=false WHERE id=?"
        db.query(sql, [password, id], function(err, results) {
            callback(results);
        });
    },
    activateAccount: function(id, callback) {
        sql = "UPDATE utilisateurs SET active=true WHERE id=?"
        db.query(sql, [password, id], function(err, results) {
            callback(results);
        });
    },
}