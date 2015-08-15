$(function() {
    var $diffFileWrappers = $('.d2h-wrapper .d2h-file-wrapper');
    $('.file').click(function() {
        var pos = $(this).data('position');
        console.log(pos);
        $diffFileWrapper = $($diffFileWrappers[pos]);
        $('body').animate({scrollTop: $diffFileWrapper.offset().top});
    });
});
