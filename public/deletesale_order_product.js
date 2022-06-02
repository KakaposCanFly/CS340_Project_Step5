// Make an ajax call to /sale_order_products/{id-of-sale_order_product-to-be-deleted} to DELETE
function deleteSale_Order_Product(ordnum, pid){
    $.ajax({
        url: '/sale_order_products/ordnum/' + ordnum + "/pid/" + pid,
        type: 'DELETE',
        success: function(result){          // when the call is successful,
            window.location.reload(true);   // reload the window
        }
    })
};
