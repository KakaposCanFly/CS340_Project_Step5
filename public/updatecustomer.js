//make ajax call to PUT to /customers/{id-of-customer-to-be-updated}
function updateCustomers(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'PUT',
        data: $('#update-customer').serialize(),        //use jQuery to serialize data
        success: function(result){                      //on successful update,
            window.location.replace("../customers");    //nagivate back to previous page
        }
    })
};
