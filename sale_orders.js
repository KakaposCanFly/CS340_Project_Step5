/* Primary Javascript for Sale_Orders
** The functions for displaying (SELECT), adding (INSERT), deleting (DELETE), and updating (UPDATE) are below
*/
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Selects distributors for the purpose of displaying and updating a sale_order
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_ID as id, customer_first_name as name FROM customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers  = results;
            complete();
        });
    }

    // Selects all the sale_orders for the purpose of displaying the table data
    function getSaleOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM sale_orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_orders = results;
            complete();
        });
    }

    // Selects a single sale_order to update
    function getSale_Order(res, mysql, context, id, complete){
        var sql = "SELECT * FROM sale_orders WHERE order_number = ?";       //Make SQL query with '?' placeholders
        var inserts = [id];                                                 //Fill array to replace '?' in the SQL query
        mysql.pool.query(sql, inserts, function(error, results, fields){    //Make SQL query with inserts
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_order = results[0];    //results is a list but we only use the first element, so take results[0]
            complete();
        });
    }

    //Display all sale_orders. Requires web based javascript to delete users with AJAX
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesale_order.js"];    // Use the script for deleting a sale_order
        var mysql = req.app.get('mysql');
        getSaleOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){     // Compare callback to 2 since we call getSale_Orders() and getCustomers()
                res.render('sale_orders', context);
            }
        }
    });

    //Display one sale_order for the specific purpose of updating sale_orders
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedCustomer.js", "selectedDelivery_Status.js", "selectedPaid_Status.js", "updatesale_order.js"]; // Use the script for updating a sale_order and selecting a customer, delivery status, and paid status
        var mysql = req.app.get('mysql');
        getSale_Order(res, mysql, context, req.params.id, complete);    // Get the information of the sale_order-to-be-updated
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){     // Compare callback to 2 since we call getSale_Order() and getCustomers()
                res.render('update-sale_order', context);
            }
        }
    });

    //Adds a sale_order, redirects to the sale_orders page after adding
    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sale_orders (customer_ID, cc_number, cc_exp_date, delivery_status, paid_status) VALUES (?,?,?,?,?)";     //Make SQL query with '?' placeholders
        var inserts = [req.body.customer_ID, req.body.cc_number, req.body.cc_exp_date, req.body.delivery_status, req.body.paid_status];     //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){    //Make SQL query with inserts
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/sale_orders');   //reload the page after a sale_order is added
            }
        });
    });

    //The URI that update data is sent to in order to update a sale_order
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE sale_orders SET customer_ID=?, order_date=?, cc_number=?, cc_exp_date=?, delivery_status=?, paid_status=? WHERE order_number=?";      //Make SQL query with '?' placeholders
        var inserts = [req.body.customer_ID, req.body.order_date, req.body.cc_number, req.body.cc_exp_date, req.body.delivery_status, req.body.paid_status, req.params.id]; //Fill array to replace '?' in the SQL query
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

    //Route to delete a sale_order, returns a 202 upon success. Ajax will handle this.
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sale_orders WHERE order_number = ?";             //Make SQL query with '?' placeholders
        var inserts = [req.params.id];                                          //Fill array to replace '?' in the SQL query
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
