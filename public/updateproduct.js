//make ajax call to PUT to /products/{id-of-product-to-be-updated}
function updateProducts(id){
    $.ajax({
        url: '/products/' + id,
        type: 'PUT',
        data: $('#update-product').serialize(),         //use jQuery to serialize data
        success: function(result){                      //on successful update,
            window.location.replace("../products");     //nagivate back to previous page
        }
    })
};
