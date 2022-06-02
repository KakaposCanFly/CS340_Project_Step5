// Make an ajax call to /customers/{id-of-customer-to-be-deleted} to DELETE
function deleteCustomer(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'DELETE',
        success: function(result){          // when the call is successful,
            window.location.reload(true);   // reload the window
        }
    })
};
