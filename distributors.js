/* Primary Javascript for Distributors
** The functions for displaying (SELECT), adding (INSERT), deleting (DELETE), and updating (UPDATE) are below
*/
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Selects all the distributors for the purpose of displaying the table data
    function getDistributors(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM distributors", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.distributors = results;
            complete();
        });
    }

    // Selects a single distributor to update
    function getDistributor(res, mysql, context, id, complete){
        var sql = "SELECT * FROM distributors WHERE distributor_ID = ?";    //Make SQL query with '?' placeholders
        var inserts = [id];                                                 //Fill array to replace '?' in the SQL query
        mysql.pool.query(sql, inserts, function(error, results, fields){    //Make SQL query with inserts
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.distributor = results[0];   //results is a list but we only use the first element, so take results[0]
            complete();
        });
    }

    //Display all distributors. Requires web based javascript to delete users with AJAX
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedistributor.js"];   // Use the script for deleting a distributor
        var mysql = req.app.get('mysql');
        getDistributors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('distributors', context);
            }
        }
    });

    //Display one distributor for the specific purpose of updating distributors
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatedistributor.js"];   // Use the script for updating a distributor
        var mysql = req.app.get('mysql');
        getDistributor(res, mysql, context, req.params.id, complete);   // Get the information of the distributor-to-be-updated
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){     //Compare callback count to 1 since we only call getDistributor()
                res.render('update-distributor', context);
            }
        }
    });

    //Adds a distributor, redirects to the distributors page after adding
    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO distributors (distributor_name, distributor_address, distributor_email, distributor_phone, distributor_contact_person) VALUES (?,?,?,?,?)";      //Make SQL query with '?' placeholders
        var inserts = [req.body.distributor_name, req.body.distributor_address, req.body.distributor_email, req.body.distributor_phone, req.body.distributor_contact_person];   //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){    //Make SQL query with inserts
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/distributors');
            }
        });
    });

    //The URI that update data is sent to in order to update a distributor
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE distributors SET distributor_name=?, distributor_address=?, distributor_email=?, distributor_phone=?, distributor_contact_person=? WHERE distributor_ID=?";       //Make SQL query with '?' placeholders
        var inserts = [req.body.distributor_name, req.body.distributor_address, req.body.distributor_email, req.body.distributor_phone, req.body.distributor_contact_person, req.params.id];//Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){    //Make SQL query with inserts
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

    //Route to delete a distributor, returns a 202 upon success. Ajax will handle this.
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM distributors WHERE distributor_ID = ?";  //Make SQL query with '?' placeholders
        var inserts = [req.params.id];                                  //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){  //Make SQL query with inserts
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
