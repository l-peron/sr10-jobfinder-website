const model = require ("../models/users.js");
const DB = require ("../models/db.js");

describe("Model Tests", done => {
    test ("read user",() => {
        model.read("test@test.fr", function (resultat){
            nom = resultat.name;
            expect(nom).toBe("test");
        })
    })    

    function callback (err){
        if (err) done(err);
        else done();
    }

    DB.end(callback); 
})