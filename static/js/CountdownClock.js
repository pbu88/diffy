function CountdownClock($clockElem) {
    var $hours = $clockElem.find('.hours');
    var $minutes = $clockElem.find('.minutes');
    var $seconds = $clockElem.find('.seconds');
    var ttlDate = new Date($clockElem.data('enddate'));

    this.updateTtl = function() {
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

}
