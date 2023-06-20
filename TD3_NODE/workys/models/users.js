var db = require('./db.js');

const pageSize = Number(process.env.PAGE_SIZE);

module.exports = {
    read: function(email, callback, page = 0) {
        sql = "SELECT * FROM utilisateurs WHERE utilisateurs.email LIKE ? LIMIT ? OFFSET ?";
        db.query(sql, [email, pageSize, pageSize * page], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readById: function(user_id, callback) {
        sql = "SELECT * FROM utilisateurs WHERE utilisateurs.id = ?";
        db.query(sql, user_id, function(err, results) {
            if(err) throw err;
            callback(results[0]);
        });
    },
    readById: function(id, callback) {
        sql = "SELECT * FROM utilisateurs WHERE id = ?";
        db.query(sql, id, function(err, results) {
            if(err) throw err;
            callback(results[0]);
        });
    },
    readAll: function(callback) {
        sql = "SELECT * FROM utilisateurs";
        db.query(sql, function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    areValid: function(email, password, callback) {
        sql = "SELECT password FROM utilisateurs WHERE email = ? AND active = true";
        db.query(sql, email, function(err, results) {
            if(err) throw err;
            if(results.length === 1 && results[0].password === password) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    createAccount: function(name, surname, email, password, salt, phoneNumber, callback) {
        sql = "INSERT INTO utilisateurs (name, surname, email, password, salt, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, surname, email, password, salt, phoneNumber], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    update: function(id, name, surname, email, phoneNumber, callback) {
        sql = "UPDATE utilisateurs SET name=?, surname=?, email=?, phone_number=? WHERE id=?"
        db.query(sql, [name, surname, email, phoneNumber, id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    changeRole: function(id, role, callback) {
        sql = "UPDATE utilisateurs SET role=? WHERE id=?"
        db.query(sql, [role, id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    desactivateAccount: function(id, callback) {
        sql = "UPDATE utilisateurs SET active=false WHERE id=?"
        db.query(sql, [id], function(err, results) {
            if(err) throw(err);
            callback(results);
        });
    },
    activateAccount: function(id, callback) {
        sql = "UPDATE utilisateurs SET active=true WHERE id=?"
        db.query(sql, [id], function(err, results) {
            if(err) throw(err);
            callback(results);
        });
    }
}