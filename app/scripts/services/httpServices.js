let $http = require('qwest');

let videoIdService = function(searchTerm) {
    const apiKey = 'AIzaSyAXaCYfu1UnCYX2VMcsu-KOTn4QJJ_SGEM';

    var request = $http.get('https://www.googleapis.com/youtube/v3/search', {
        key: apiKey,
        type: 'video',
        maxResults: '1',
        part: 'id,snippet',
        fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
        q: searchTerm || 'neil young alabama'
    }, {
        responseType: 'json',
        async: true
    })
    request = request.then(function(data) {
        let videoId = data.items[0].id.videoId;
        let fullTitle = data.items[0].snippet.title;
        // console.log(data.items[0].snippet['title'])
        return  {
            videoId: videoId,
            fullTitle: fullTitle
        }
    });

    return request
};

let lastFmHistory = function(type) {

    let request = $http.jsonp('http://ws.audioscrobbler.com/2.0/', {
        'method': 'user.gettoptracks',
        'limit': limit,
        'period': period,
        'user': attrs.lastfmTracks,
        'api_key': attrs.key,
        'callback': 'JSON_CALLBACK'
    });

    return request
}

export {
    videoIdService
};
export {
    lastFmHistory
};
