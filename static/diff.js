$(function() {
    // ui stuff

    var $wrappers = $('.d2h-file-wrapper');

    var $bigWrapper = $('.d2h-wrapper');
    $('.file').click(function() {
        $('.file').removeClass("selected");
        $(this).addClass("selected");
        $wrappers.hide();
        var id = $(this).data('wrapperid');
        $diffFileWrapper = $bigWrapper.find('#' + id).first().show();
    });

    $('a.directory').click(function() {
        $this = $(this);
        $this.parent().toggleClass('directory-hidden');
        $i = $this.find('i').first();
        if ($i.hasClass('fa-folder-open-o')) {
            $i.removeClass('fa-folder-open-o');
            $i.addClass('fa-folder-o');
        } else {
            $i.removeClass('fa-folder-o');
            $i.addClass('fa-folder-open-o');
        }
    });

    $wrappers.hide();
    $wrappers.first().show();
    var selectedName = $wrappers.first().find('.d2h-file-name').first().html();
    if(selectedName) {
        $('.file[title="/'+selectedName+'"]').addClass('selected');
    }
});

$(function() {
    // time to live (ttl) stuff

    var $ttl = $('#ttl');
    var $hours = $ttl.find('.hours');
    var $minutes = $ttl.find('.minutes');
    var $seconds = $ttl.find('.seconds');
    var ttlDate = new Date($ttl.data('enddate'));

    var updateTtl = function() {
        // not much scientific stuff here, just get the job done for now
        var now = new Date();
        var dateDiffInSecs = (ttlDate - now) / 1000;
        if (dateDiffInSecs < 0) {
            $hours.html(0);
            $minutes.html(0);
            $seconds.html(0);
            return;
        }
        var hoursDiff = Math.floor(dateDiffInSecs / 60 / 60);
        var minutesDiff = Math.floor((dateDiffInSecs / 60) - (hoursDiff * 60));
        var secondsDiff = Math.floor((dateDiffInSecs) - (hoursDiff * 60 * 60) - (minutesDiff * 60));
        $hours.html(hoursDiff);
        $minutes.html(minutesDiff);
        $seconds.html(secondsDiff);
    };

    setInterval(function() { updateTtl(); }, 1000);
});
