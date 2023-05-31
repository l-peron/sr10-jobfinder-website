var db = require('./db.js');

module.exports = {
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