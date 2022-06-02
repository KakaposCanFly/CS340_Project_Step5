//make ajax call to PUT to /distributors/{id-of-distributor-to-be-updated}
function updateDistributors(id){
    $.ajax({
        url: '/distributors/' + id,
        type: 'PUT',
        data: $('#update-distributor').serialize(),         //use jQuery to serialize data
        success: function(result){                          //on successful update,
            window.location.replace("../distributors");     //nagivate back to previous page
        }
    })
};
