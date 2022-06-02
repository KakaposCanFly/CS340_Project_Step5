// Make an ajax call to /distributors/{id-of-distributor-to-be-deleted} to DELETE
function deleteDistributor(id){
    $.ajax({
        url: '/distributors/' + id,
        type: 'DELETE',
        success: function(result){          // when the call is successful,
            window.location.reload(true);   // reload the window
        }
    })
};
