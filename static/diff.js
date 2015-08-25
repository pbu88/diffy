$(function() {
    var $bigWrapper = $('.d2h-wrapper');
    $('.file').click(function() {
        var filename = $(this).data('filename').slice(1);
        $diffFileWrapper = $bigWrapper.find(
                '.d2h-file-wrapper:has(.d2h-file-name:contains(' + filename + '))').first();
        console.log(filename);
        console.log($diffFileWrapper);
        $('body').animate({scrollTop: $diffFileWrapper.offset().top});
    });
});
