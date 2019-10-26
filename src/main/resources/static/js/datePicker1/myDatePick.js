$(document).ready(function() {
    $(".pickDate").pDatepicker({
        initialValue: false,
        // format: 'YYYY/MM/DD',
        autoClose: true,
        format: 'X',
        observer: true,
        altField:  "#observer"
    });

});