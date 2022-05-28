function updateProducts(id){
    console.log("Entered update function");
    $.ajax({
        url: '/products/' + id,
        type: 'PUT',
        data: $('#update-product').serialize(),
        success: function(result){
            window.location.replace("../products");
        }
    })
};
