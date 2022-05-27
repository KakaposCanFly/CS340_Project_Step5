function updateDistributors(id){
    $.ajax({
        url: '/distributors/' + id,
        type: 'PUT',
        data: $('#update-distributor').serialize(),
        success: function(result){
            window.location.replace("../distributors");
        }
    })
};
