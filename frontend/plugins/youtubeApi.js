export default function({ $axios }, inject) {
    // Create a custom axios instance
    const youtubeApi = $axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })

    const apiKey = 'AIzaSyAeFj5orE1ldMI0P_J7LjhEKwwqrbIilmE'

    const youtubeVideosApi = (videoId) => {
        return youtubeApi.get('videos', {
            params: {
                key: apiKey,
                part: 'snippet,liveStreamingDetails,statistics',
                id: videoId,
            },
        })
    }

    const youtubeSearchApi = ({ channelId, eventType, type }) => {
        return youtubeApi.get('search', {
            params: {
                key: apiKey,
                part: 'id,snippet',
                channelId,
                eventType,
                type,
            },
        })
    }

    const youtubeliveChatApi = ({ liveChatId, nextPageToken, pollingIntervalMillis }) => {
        console.log(liveChatId)
        const query = {
            params: {
                key: apiKey,
                part: 'id,snippet,authorDetails',
                liveChatId,
                nextPageToken,
                pollingIntervalMillis,
            },
        }
        console.log(query)
        return youtubeApi.get('liveChat/messages', {
            params: {
                key: apiKey,
                part: 'id,snippet,authorDetails',
                liveChatId,
                nextPageToken,
                pollingIntervalMillis,
                maxResults: 5,
            },
        })
    }

    const axiosScript = {
        youtubeVideosApi: (videoId) => youtubeVideosApi(videoId),
        youtubeSearchApi: ({ channelId, eventType, type }) => youtubeSearchApi({ channelId, eventType, type }),
        youtubeliveChatApi: (liveChatId) => youtubeliveChatApi(liveChatId),
    }

    // Inject to context as $api
    inject('youtubeApi', axiosScript)
}
