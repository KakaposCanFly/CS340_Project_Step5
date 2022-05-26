function deleteSale_Order(id){
    $.ajax({
        url: '/sale_orders/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
