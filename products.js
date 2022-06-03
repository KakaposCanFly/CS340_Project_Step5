/* Primary Javascript for Products
** The functions for displaying (SELECT), adding (INSERT), deleting (DELETE), and updating (UPDATE) are below
*/
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // Selects distributors for the purpose of displaying and updating a Product
    function getDistributors(res, mysql, context, complete){
        mysql.pool.query("SELECT distributor_ID as id, distributor_name as name FROM distributors", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.distributors  = results;
            complete();
        });
    }

    // Selects all the products for the purpose of displaying the table data
    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }


    // Selects a single product to update
    function getProduct(res, mysql, context, id, complete){
        var sql = "SELECT * FROM products WHERE product_ID = ?";    //Make SQL query with '?' placeholders
        var inserts = [id];                                         //Fill array to replace '?' in the SQL query
        mysql.pool.query(sql, inserts, function(error, results, fields){    //Make SQL query with inserts
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results[0];   //results is a list but we only use the first element, so take results[0]
            complete();
        });
    }

    //Display all products. Requires web based javascript to delete users with AJAX
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteproduct.js"];   // Use the script for deleting a product
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        getDistributors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){     // Compare callback to 2 since we call getProducts() and getDistributors()
                res.render('products', context);
            }

        }
    });


    //Display one product for the specific purpose of updating products
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedDistributor.js", "updateproduct.js"]; // Use the script for updating a product and selecting a distributor
        var mysql = req.app.get('mysql');
        getProduct(res, mysql, context, req.params.id, complete);    // Get the information of the product-to-be-updated
        getDistributors(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){     // Compare callback to 2 since we call getProduct() and getDistributors()
                res.render('update-product', context);
            }
        }
    });

    //Adds a product, redirects to the products page after adding
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO products (product_type, product_name, distributor_ID, retail_price, release_date, quant_in_stock) VALUES (?,?,?,?,?,?)";     //Make SQL query with '?' placeholders
        var inserts = [req.body.product_type, req.body.product_name, req.body.distributor_ID, req.body.retail_price, req.body.release_date ,req.body.quant_in_stock];   //Fill array to replace '?' in the SQL query
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){    //Make SQL query with inserts
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/products');      //reload the page after a product is added
            }
        });
    });

    //The URI that update data is sent to in order to update a product
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE products SET product_type=?, product_name=?, distributor_ID=?, retail_price=?, release_date=?, quant_in_stock=? WHERE product_ID=?";      //Make SQL query with '?' placeholders
        var inserts = [req.body.product_type, req.body.product_name, req.body.distributor_ID, req.body.retail_price, req.body.release_date, req.body.quant_in_stock, req.params.id];    //Fill array to replace '?' in the SQL query
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

    //Route to delete a product, returns a 202 upon success. Ajax will handle this.
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM products WHERE product_ID = ?";      //Make SQL query with '?' placeholders
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
