module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDistributors(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM distributors", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getDistributor(res, mysql, context, id, complete){
        var sql = "SELECT * FROM distributors WHERE distributor_ID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.distributor = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedistributor.js"];
        var mysql = req.app.get('mysql');
        getDistributors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('distributors', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatedistributor.js"];
        var mysql = req.app.get('mysql');
        getDistributor(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-distributor', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO distributors (distributor_name, distributor_address, distributor_email, distributor_phone, distributor_contact_person) VALUES (?,?,?,?,?)";
        var inserts = [req.body.distributor_name, req.body.distributor_address, req.body.distributor_email, req.body.distributor_phone, req.body.distributor_contact_person];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/distributors');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE distributors SET distributor_name=?, distributor_address=?, distributor_email=?, distributor_phone=?, distributor_contact_person=? WHERE distributor_ID=?";
        var inserts = [req.body.distributor_name, req.body.distributor_address, req.body.distributor_email, req.body.distributor_phone, req.body.distributor_contact_person, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM distributors WHERE distributor_ID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
