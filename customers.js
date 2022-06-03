/* Primary Javascript for Customers
** The functions for displaying (SELECT), adding (INSERT), deleting (DELETE), and updating (UPDATE) are below
*/
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Selects all the customers for the purpose of displaying the table data
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    // Selects a single customer to update
    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT * FROM customers WHERE customer_ID = ?";  //Make SQL query with '?' placeholders
        var inserts = [id];                                         //Fill array to replace '?' in the SQL query
        mysql.pool.query(sql, inserts, function(error, results, fields){    //Make SQL query with inserts
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];      //results is a list but we only use the first element, so take results[0]
            complete();
        });
    }

    //Display all customers. Requires web based javascript to delete users with AJAX
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js"];  // Use the script for deleting a customer
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){                 // Compare callback to 1 since we only call getCustomers()
                res.render('customers', context);
            }
        }
    });

    //Display one customer for the specific purpose of updating customers
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];  // Use the script for updating a customer
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);  // Get the information of the customer-to-be-updated
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){     //Compare callback count to 1 since we only call getCustomer()
                res.render('update-customer', context); 
            }
        }
    });

    //Adds a customer, redirects to the customers page after adding
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customers (customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address, customer_birthdate) VALUES (?,?,?,?,?,?)";  //Make SQL query with '?' placeholders
        var inserts = [req.body.customer_first_name, req.body.customer_last_name, req.body.customer_email, req.body.customer_phone_number, req.body.customer_address, req.body.customer_birthdate]; //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){    //Make SQL query with inserts
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');     //reload the page after a customer is added
            }
        });
    });

    //The URI that update data is sent to in order to update a customer
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE customers SET customer_first_name=?, customer_last_name=?, customer_email=?, customer_phone_number=?, customer_address=?, customer_birthdate=? WHERE customer_ID=?";  //Make SQL query with '?' placeholders
        var inserts = [req.body.customer_first_name, req.body.customer_last_name, req.body.customer_email, req.body.customer_phone_number, req.body.customer_address, req.body.customer_birthdate, req.params.id];  //Fill array to replace '?' in the SQL query
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

    //Route to delete a customer, returns a 202 upon success. Ajax will handle this.
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customers WHERE customer_ID = ?";    //Make SQL query with '?' placeholders
        var inserts = [req.params.id];                              //Fill array to replace '?' in the SQL query
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
