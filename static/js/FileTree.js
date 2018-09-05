function FileTree($fileTree) {

    this.clickFolder = function($elem) {
        $elem.parent().toggleClass('directory-hidden');
        $i = $elem.find('i').first();
        if ($i.hasClass('fa-folder-open-o')) {
            $i.removeClass('fa-folder-open-o');
            $i.addClass('fa-folder-o');
        } else {
            $i.removeClass('fa-folder-o');
            $i.addClass('fa-folder-open-o');
        }
    }

    this.clickFile = function($elem) {
        $diffArea.find('.file').removeClass("selected");
        $elem.addClass("selected");
    }
}
