$(function() {
    var $bigWrapper = $('.d2h-wrapper');
    $('.file').click(function() {
        var filename = $(this).data('filename').slice(1);
        $diffFileWrapper = $bigWrapper.find(
                '.d2h-file-wrapper:has(.d2h-file-name:contains(' + filename + '))').first();
        $('body').animate({scrollTop: $diffFileWrapper.offset().top});
    });
    
    $('a.directory').click(function() {
        $this = $(this);
        $this.parent().toggleClass('directory-hidden');
        $i = $this.find('i').first();
        if ($i.hasClass('fa-folder-open-o')) {
            $i.removeClass('fa-folder-open-o');
            $i.addClass('fa-folder-o');
        } else {
            console.log('open');
            $i.removeClass('fa-folder-o');
            $i.addClass('fa-folder-open-o');
        }
    });
    
});
