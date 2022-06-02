module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getSale_Order(res, mysql, context, id, complete){
        var sql = "SELECT * FROM sale_orders WHERE order_number = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_order = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesale_order.js"];
        var mysql = req.app.get('mysql');
        getSaleOrders(res, mysql, context, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('sale_orders', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedCustomer.js", "selectedDelivery_Status.js", "selectedPaid_Status.js", "updatesale_order.js"];
        var mysql = req.app.get('mysql');
        getSale_Order(res, mysql, context, req.params.id, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-sale_order', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sale_orders (customer_ID, cc_number, cc_exp_date, delivery_status, paid_status) VALUES (?,?,?,?,?)";
        var inserts = [req.body.customer_ID, req.body.cc_number, req.body.cc_exp_date, req.body.delivery_status, req.body.paid_status];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/sale_orders');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE sale_orders SET customer_ID=?, order_date=?, cc_number=?, cc_exp_date=?, delivery_status=?, paid_status=? WHERE order_number=?";
        var inserts = [req.body.customer_ID, req.body.order_date, req.body.cc_number, req.body.cc_exp_date, req.body.delivery_status, req.body.paid_status, req.params.id];
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
        var sql = "DELETE FROM sale_orders WHERE order_number = ?";
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
