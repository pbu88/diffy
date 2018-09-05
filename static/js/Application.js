function Application(config, $) {
    var config         = config;
    var fileTree       = new FileTree($('#files-wrapper'));
    var diffArea       = new DiffArea($('#diff-wrapper'));
    var countdownClock = new CountdownClock($('#ttl'));

    setInterval(function() { countdownClock.updateTtl(); }, 1000);

    $('a.directory').click(function() {
        fileTree.clickFolder($(this));
    });

    $('.file').click(function() {
        var $elem = $(this);
        fileTree.clickFolder($elem);
        diffArea.selectFile($elem);
    });
}
