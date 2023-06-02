var db = require('./db.js');

module.exports = {
    read: function(siren, active, callback) {
        sql = "SELECT * FROM organisations_members "
        + "JOIN utilisateurs ON utilisateurs.id = organisations_members.user "
        + "WHERE organisations_members.organisation LIKE ? AND organisations_members.active = ?";
        db.query(sql, [siren, active], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    delete: function(siren, user_id, callback) {
        sql = "DELETE FROM organisation_members WHERE user = ? AND organisation = ?";
        db.query(sql, [siren, user_id], function(err, results) {
            if(err) throw err;
            callback(results);
        })
    },
    apply: function(siren, user_id, callback) {
        sql = "INSERT INTO organisations_members (date, user, organisation) VALUES (CURRENT_TIME, ?, ?)";
        db.query(sql, [user_id, siren], function(err, results) {
            if(err) throw err;
            callback(results);
        })
    },
    setActive: function(siren, user_id, active, callback) {
        sql = "UPDATE organisations_members SET active=? WHERE organisation=? AND user=?"
        db.query(sql, [active, siren, user_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    getOrganizationMembers: function(siren, callback) {
        sql = "SELECT user FROM organisations_members WHERE organisation=?"
        db.query(sql, [siren], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
}