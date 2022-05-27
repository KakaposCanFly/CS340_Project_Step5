function updateSale_Orders(id){
    $.ajax({
        url: '/sale_orders/' + id,
        type: 'PUT',
        data: $('#update-sale_order').serialize(),
        success: function(result){
            window.location.replace("../sale_orders");
        }
    })
};
