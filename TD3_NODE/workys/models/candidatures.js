var db = require('./db.js');

module.exports = {
    readById: function(candidature_id, callback) {
        sql = "SELECT organisations.siren, organisations.name, candidatures.id, candidatures.date, candidatures.offre AS offer_id FROM candidatures JOIN offre_emplois ON candidatures.offre = offre_emplois.id JOIN organisations ON offre_emplois.organisation = organisations.siren WHERE candidatures.id = ?";
        db.query(sql, [candidature_id], function(err, results) {
            callback(results, err);
        });
    },
    readyByIdWithExtendedInfos: function(candidature_id, callback) {
        sql="SELECT candidatures.id as candid_id, candidatures.date as candid_date, utilisateurs.*, fiche_postes.* FROM candidatures INNER JOIN utilisateurs ON candidatures.user = utilisateurs.id INNER JOIN offre_emplois ON candidatures.offre = offre_emplois.id INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id WHERE candidatures.id = ?";
        db.query(sql, [candidature_id], function(err, results) {
            callback(results, err);
        });
    },
    readByUserId: function(user_id, callback) {
        sql = "SELECT organisations.siren, organisations.name, candidatures.id, candidatures.date, candidatures.offre AS offer_id FROM candidatures JOIN offre_emplois ON candidatures.offre = offre_emplois.id JOIN organisations ON offre_emplois.organisation = organisations.siren WHERE candidatures.user = ?";
        db.query(sql, [user_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    readByOrganizationSiren: function(siren, callback) {
        sql="SELECT candidatures.id as candid_id, candidatures.date as candid_date, utilisateurs.*, fiche_postes.* FROM candidatures INNER JOIN utilisateurs ON candidatures.user = utilisateurs.id INNER JOIN offre_emplois ON candidatures.offre = offre_emplois.id INNER JOIN fiche_postes ON offre_emplois.fiche = fiche_postes.id WHERE offre_emplois.organisation = ?";
        db.query(sql, [siren], function(err, results) {
            callback(results, err);
        });
    },
    apply: function(offre, user_id, callback) {
        sql = "INSERT INTO candidatures (`user`, `offre`) VALUES (?, ?)";
        db.query(sql, [user_id, offre], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    },
    delete: function(candidature_id, callback) {
        sql = "DELETE FROM candidatures WHERE id = ?";
        db.query(sql, [candidature_id], function(err, results) {
            if(err) throw err;
            callback(results);
        });
    }
}