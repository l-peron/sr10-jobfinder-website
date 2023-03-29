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
        db.query(sql, function(err, results) {
            if(err) throw err;
            if(results.length === 1 && results[0].password === password) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    createAccount: function(name, surname, email, password, phoneNumber, callback) {
        sql = "INSERT INTO utilisateur VALUES ()"
    }
}