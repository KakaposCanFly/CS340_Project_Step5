function deleteDistributor(id){
    $.ajax({
        url: '/distributors/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
