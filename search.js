// Helper function to display JavaScript value on HTML page.
var results = [];
var numResults = 0;

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {

    gapi.client.setApiKey('');

    firstSearch();
}

function firstSearch() {
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'id,snippet',
        channelId: 'UCFJNcE0iHj7P6dhp5iCZRLg',
        type: 'video'
    });

    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

function nextSearch(nextPageToken) {
    var request = gapi.client.youtube.search.list({
        part: 'id,snippet',
        channelId: 'UCFJNcE0iHj7P6dhp5iCZRLg',
        pageToken: nextPageToken,
        type: 'video'
    });

    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    numResults += response.items.length;
    if (response.nextPageToken) {
        saveResult(response);
        nextSearch(response.nextPageToken);
    } else if (!response.nextPageToken) {
        saveResult(response);
        showResponse(results);
    }
}

function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('response').innerHTML += responseString;
}

function saveResult(response) {
    for (var i = 0, l = response.items.length; i < l; i++) {
        var stats = getStats(response.items[i].id.videoId);

        results.push({
            id: response.items[i].id.videoId,
            date: response.items[i].snippet.publishedAt
        });

        document.getElementById('count').innerHTML = numResults;
    }
}

function getStats(videoID) {
    var request = gapi.client.youtube.videos.list({
        id: videoID,
        part: 'statistics'
    });
    // doesn't work yet
    request.execute(function(response) {
        stats = response.items.statistics;
    });

}