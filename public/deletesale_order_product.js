function deleteSale_Order_Product(ordnum, pid){
    $.ajax({
        url: '/sale_order_products/ordnum/' + ordnum + "/pid/" + pid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
