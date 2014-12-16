var $http = require('qwest');

var videoIdService = function(searchTerm) {
    const apiKey = 'AIzaSyAXaCYfu1UnCYX2VMcsu-KOTn4QJJ_SGEM';

    var request = $http.get('https://www.googleapis.com/youtube/v3/search', {
        key: apiKey,
        type: 'video',
        maxResults: '1',
        part: 'id,snippet',
        fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
        q: searchTerm || 'neil young alabama'
    }, {
        responseType: 'json'
    }).then(function(data) {
        var videoId = data.items[0].id.videoId;
        var fullTitle = data.items[0].snippet.title;
        return {
            videoId: videoId,
            fullTitle: fullTitle
        }
    });

    return request
};

export {
    videoIdService as
    default
};
