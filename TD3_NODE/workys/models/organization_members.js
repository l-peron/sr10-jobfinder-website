var db = require('./db.js');

module.exports = {
    read: function(siren, callback) {
        sql = "SELECT * FROM organisations_members "
        + "JOIN utilisateurs ON utilisateurs.id = organisations_members.user "
        + "WHERE organisations_members.organisation LIKE ?";
        db.query(sql, [siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readByUserId(user_id, callback) {
        sql = "SELECT * FROM organisations_members WHERE user = ?";
        db.query(sql, [user_id], function(err, results) {
            callback(err, results);
        });
    },
    delete: function(siren, user_id, callback) {
        sql = "DELETE FROM organisations_members WHERE user = ? AND organisation = ?";
        db.query(sql, [user_id, siren], function(err, results) {
            callback(err, results);
        })
    },
    apply: function(siren, user_id, callback) {
        sql = "INSERT INTO organisations_members (user, organisation) VALUES (?, ?)";
        db.query(sql, [user_id, siren], function(err, results) {
            callback(err, results);
        })
    },
    setStatus: function(siren, user_id, status, callback) {
        sql = "UPDATE organisations_members SET status=? WHERE organisation=? AND user=?"
        db.query(sql, [status, siren, user_id], function(err, results) {
            callback(err, results);
        });
    },
    getOrganizationMembers: function(siren, callback) {
        sql = "SELECT user FROM organisations_members WHERE organisation=?"
        db.query(sql, [siren], function(err, results) {
            callback(err, results);
        });
    },
    getUserOrganizations: function(user_id, callback) {
        sql = "SELECT * FROM organisations_members WHERE user=?"
        db.query(sql, [user_id], function(err, results) {
            callback(err, results);
        });
    }
}