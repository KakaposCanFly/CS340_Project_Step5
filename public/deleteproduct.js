// Make an ajax call to /products/{id-of-product-to-be-deleted} to DELETE
function deleteProduct(id){
    $.ajax({
        url: '/products/' + id,
        type: 'DELETE',
        success: function(result){          // when the call is successful,
            window.location.reload(true);   // reload the window
        }
    })
};

