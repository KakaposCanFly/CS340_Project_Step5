//make ajax call to PUT to /sale_order_products/{id-of-sale_order_product-to-be-updated}
function updateSale_Order_Products(ordnum, pid){
    $.ajax({
        url: '/sale_order_products/ordnum/' + ordnum + "/pid/" + pid,
        type: 'PUT',
        data: $('#update-sale_order_product').serialize(),              //use jQuery to serialize data
        success: function(result){                                      //on successful update,
            window.location.replace("../../../../sale_order_products"); //nagivate back to previous page
        }
    })
};
