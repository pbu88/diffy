function DiffArea($diffArea) {
    var $wrappers = $diffArea.find('.d2h-file-wrapper');
    var $bigWrapper = $diffArea.find('.d2h-wrapper');
    $wrappers.hide();
    $wrappers.first().show();
    var selectedName = $wrappers.first().find('.d2h-file-name').first().html();
    if(selectedName) {
        $('.file[title="/'+selectedName+'"]').addClass('selected');
    }

    this.selectFile = function($elem) {
        $wrappers.hide();
        var id = $elem.data('wrapperid');
        $bigWrapper.find('#' + id).first().show();
    };
}
