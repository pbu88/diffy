$(function() {
    // Copy to clipboard stuffs  

    var url = window.location.href,
        $clipInput = $('#clip-txt'),
        $clipBtn = $('.clipboard-group button'),
        hoverTxt = 'Copy to clipboard',
        succMsg = 'Copied!',
        failMsg = 'Unable to copy :(';
    $clipInput.attr('value', url);

    // Selecting clip input
    $clipInput.on('click', function() {
        $clipInput.select();
    });

    $clipBtn.on('click', function(){
        $clipInput.select();
        var feedBack;
        try {
            var succ = document.execCommand('copy');
            feedBack = succ ? succMsg : failMsg;
        } catch (err) {
            feedBack = failMsg;
        }
        console.log(feedBack);
        $clipBtn.attr('title', feedBack).tooltip('fixTitle').tooltip('show'); // Feedback msg
        $clipBtn.attr('title', hoverTxt).tooltip('fixTitle'); // Original msg
        $clipBtn.blur();
    });   
});
