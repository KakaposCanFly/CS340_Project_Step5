// Make an ajax call to /customers/{id-of-sale_order-to-be-deleted} to DELETE
function deleteSale_Order(id){
    $.ajax({
        url: '/sale_orders/' + id,
        type: 'DELETE',
        success: function(result){          // when the call is successful,
            window.location.reload(true);   // reload the window
        }
    })
};
