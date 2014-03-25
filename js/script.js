
$(function() {
    // fix keys
    $('[data-like-count]').each(function() {
        var k = convertToSlug($(this).data('likeCount'));
        $(this).attr('data-like-count', k);
    });
    $('[data-like-action]').each(function() {
        var k = convertToSlug($(this).data('likeAction'));
        $(this).attr('data-like-action', k);
    });

    // populate like counts on the page
    var likeIds = {
        user: 'swarm',
        namespace: 'bts',
        key: []
    };
    $('[data-like-count]').each(function() {   
        likeIds.key.push($(this).attr('data-like-count'));
    });

    if (likeIds.key.length) {
        $.ajax({
            url: 'http://likes.madebyfieldwork.com/likes/get.json', 
            data: likeIds,
            success: function(data) {
                if (data && data.count) {
                    for (var i = 0, len = data.count.length; i < len; i ++) {
                        $('[data-like-count=' + data.count[i].k.split('.')[2] + ']').text(data.count[i].count);
                    }
                }
            },
            dataType: 'json'
        });
    }

    // Post like on click and update count on success
    $('[data-like-action]').on('click', function(e) {
        e.preventDefault();
        $.post(
            'http://likes.madebyfieldwork.com/likes/add.json', 
            {
                user: likeIds.user,
                namespace: likeIds.namespace,
                key: $(this).attr('data-like-action')
            },
            function(data) {
                if (data && data.like && data.like.id) {
                    var selector = '[data-like-count=' + data.like.key + ']',
                        count = $(selector).text() || 0;
                    $(selector).text(count + 1);
                }
            },
            'json'
        );
    });
});


function convertToSlug(Text) {
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
}
