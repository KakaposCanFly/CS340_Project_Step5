module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSale_Orders(res, mysql, context, complete){
        mysql.pool.query("SELECT order_number FROM sale_orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_orders  = results;
            complete();
        });
    }

    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT product_ID as id, product_name as name FROM products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products  = results;
            complete();
        });
    }

    function getSaleOrderProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM sale_order_products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getPeoplebyHomeworld(req, res, mysql, context, complete){
      var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.homeworld = ?";
      console.log(req.params)
      var inserts = [req.params.homeworld]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getPeopleWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE bsg_people.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    function getSale_Order_Product(res, mysql, context, ordnum, pid, complete){
        var sql = "SELECT * FROM sale_order_products WHERE order_number=? AND product_ID=?";
        var inserts = [ordnum, pid];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_order_product = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesale_order_product.js"];
        var mysql = req.app.get('mysql');
        getSaleOrderProducts(res, mysql, context, complete);
        getSale_Orders(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('sale_order_products', context);
            }

        }
    });

    /*Display all people from a given homeworld. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:homeworld', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeoplebyHomeworld(req,res, mysql, context, complete);
        getSale_Orders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('sale_order_products', context);
            }

        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getSale_Orders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('sale_order_products', context);
            }
        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/ordnum/:ordnum/pid/:pid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedSale_Order.js", "selectedProduct.js", "updatesale_order_product.js"];
        var mysql = req.app.get('mysql');
        getSale_Order_Product(res, mysql, context, req.params.ordnum, req.params.pid, complete);
        getSale_Orders(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-sale_order_product', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sale_order_products (order_number, product_ID, quantity, selling_price, shipping_status, shipping_date) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.order_number, req.body.product_ID, req.body.quantity, req.body.selling_price, req.body.shipping_status, req.body.shipping_date];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/sale_order_products');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/ordnum/:ordnum/pid/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE sale_order_products SET order_number=?, product_ID=?, quantity=?, selling_price=?, shipping_status=?, shipping_date=? WHERE order_number=? AND product_ID=?";
        var inserts = [req.body.order_number, req.body.product_ID, req.body.quantity, req.body.selling_price, req.body.shipping_status, req.body.shipping_date, req.params.ordnum, req.params.pid];
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

    router.delete('/ordnum/:ordnum/pid/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sale_order_products WHERE order_number = ? AND product_ID = ?";
        var inserts = [req.params.ordnum, req.params.pid];
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
