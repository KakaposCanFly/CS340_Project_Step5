/* Primary Javascript for Sale_Order_Products
** The functions for displaying (SELECT), adding (INSERT), deleting (DELETE), and updating (UPDATE) are below
*/
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Selects sale_orders for the purpose of displaying and updating a sale_order_product
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

    // Selects products for the purpose of displaying and updating a sale_order_product
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

    // Selects all the sale_order_products for the purpose of displaying the table data
    function getSaleOrderProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM sale_order_products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_order_products = results;
            complete();
        });
    }

    // Selects a single sale_order_product to update
    function getSale_Order_Product(res, mysql, context, ordnum, pid, complete){
        var sql = "SELECT * FROM sale_order_products WHERE order_number=? AND product_ID=?";    //Make SQL query with '?' placeholders
        var inserts = [ordnum, pid];                                        //Fill array to replace '?' in the SQL query
        mysql.pool.query(sql, inserts, function(error, results, fields){    //Make SQL query with inserts
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.sale_order_product = results[0];    //results is a list but we only use the first element, so take results[0]
            complete();
        });
    }

    //Display all sale_order_products. Requires web based javascript to delete users with AJAX
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesale_order_product.js"];    // Use the script for deleting a sale_order_product
        var mysql = req.app.get('mysql');
        getSaleOrderProducts(res, mysql, context, complete);
        getSale_Orders(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){     // Compare callback to 3 since we call getSale_Order_Products(), getSale_Orders(), and getProducts()
                res.render('sale_order_products', context);
            }

        }
    });


    //Display one sale_order_products for the specific purpose of updating sale_order_products
    router.get('/ordnum/:ordnum/pid/:pid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedSale_Order.js", "selectedProduct.js", "updatesale_order_product.js"];     // Use the script for updating a sale_order_product and selecting a sale_order_product and a product
        var mysql = req.app.get('mysql');
        getSale_Order_Product(res, mysql, context, req.params.ordnum, req.params.pid, complete);    // Get the information of the sale_order_product-to-be-updated
        getSale_Orders(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){     // Compare callback to 3 since we call getSale_Order_Product(), getSale_Orders(), and getProducts()
                res.render('update-sale_order_product', context);
            }

        }
    });

    //Adds a sale_order_product, redirects to the sale_order_products page after adding
    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO sale_order_products (order_number, product_ID, quantity, selling_price, shipping_status, shipping_date) VALUES (?,?,?,?,?,?)";   //Make SQL query with '?' placeholders
        var inserts = [req.body.order_number, req.body.product_ID, req.body.quantity, req.body.selling_price, req.body.shipping_status, req.body.shipping_date];    //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){        //Make SQL query with inserts
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/sale_order_products');   //reload the page after a sale_order_product is added
            }
        });
    });

    //The URI that update data is sent to in order to update a sale_order_product
    router.put('/ordnum/:ordnum/pid/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE sale_order_products SET order_number=?, product_ID=?, quantity=?, selling_price=?, shipping_status=?, shipping_date=? WHERE order_number=? AND product_ID=?";     //Make SQL query with '?' placeholders
        var inserts = [req.body.order_number, req.body.product_ID, req.body.quantity, req.body.selling_price, req.body.shipping_status, req.body.shipping_date, req.params.ordnum, req.params.pid]; //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){        //Make SQL query with inserts
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
    router.delete('/ordnum/:ordnum/pid/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM sale_order_products WHERE order_number = ? AND product_ID = ?";  //Make SQL query with '?' placeholders
        var inserts = [req.params.ordnum, req.params.pid];                                      //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){                  //Make SQL query with inserts
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
