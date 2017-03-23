jQuery(function($) {
    $('#selectAllDomainList').click(function() {
        var checkedStatus = this.checked;
        $('#domainTable tbody tr').find('th:first :checkbox').each(function() {
            $(this).prop('checked', checkedStatus);
        });
    });
    $('#selectAllGooglePlaceTypes').click(function() {
        var checkedStatus = this.checked;
        $('#allGooglePlaceTypes tbody tr').find('th:first :checkbox').each(function() {
            $(this).prop('checked', checkedStatus);
        });
    });
});