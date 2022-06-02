//make ajax call to PUT to /sale_orders/{id-of-sale_order-to-be-updated}
function updateSale_Orders(id){
    $.ajax({
        url: '/sale_orders/' + id,
        type: 'PUT',
        data: $('#update-sale_order').serialize(),          //use jQuery to serialize data
        success: function(result){                          //on successful update,
            window.location.replace("../sale_orders");      //nagivate back to previous page
        }
    })
};
