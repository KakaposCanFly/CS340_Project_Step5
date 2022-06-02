function updateSale_Order_Products(ordnum, pid){
    $.ajax({
        url: '/sale_order_products/ordnum/' + ordnum + "/pid/" + pid,
        type: 'PUT',
        data: $('#update-sale_order_product').serialize(),
        success: function(result){
            window.location.replace("../../../../sale_order_products");
        }
    })
};
