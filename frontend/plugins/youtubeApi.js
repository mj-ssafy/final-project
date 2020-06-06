export default function({ $axios, store }, inject) {
    const timeInMs = Date.now()
    // const accessToken =
    //     'ya29.a0AfH6SMAUvarbOQhbgdC0qNACLgrvESImwdu5VTAu0SSowoQV02oWREzdRRpIZj0Sh7ZozGBfOwZ2oqfBO6gLxtcRNrp7KJbaYQNLgPFZAPbewKNwRRK_2svjtfW8VaBcyEzmdaOCBpQV4g8j2WK9Ix9HnhiGvtlu994'
    // //
    const jwtToken = store.getters['login/getJwt']
    // Create a custom axios instance
    const backendAxios = $axios.create({
        headers: { Authorization: `Bearer ${jwtToken}` },
        baseURL: 'https://k02d1031.p.ssafy.io:8081/v1/youtube',
    })

    const youtubeApiKey = $axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })
    const youtubeApiToken = $axios.create({
        headers: { Authorization: `Bearer ${accessToken}` },
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })
    console.log('aaweewjwt')
    const apiKey = [
        'AIzaSyAl4t4yoO9z-WfXWC_jX6hz8SeV_7Zqjbg',
        'AIzaSyBZcWZTdEQjVlIqx_V_M86bke37lDvV6j8',
        'AIzaSyAeFj5orE1ldMI0P_J7LjhEKwwqrbIilmE',
        'AIzaSyBu90FIHQnLKwEzUgeoakyc4zl_rBn7-so',
        'AIzaSyCZ_rUOzHmL55FEVXwz1RjeGl4ps--mNkw',
    ]

    const youtubuLiveVideoApi = async (channel, channelName) => {
        let data = null
        await youtubeApiKey
            .get('search', {
                params: {
                    part: 'id',
                    channelId: channel,
                    eventType: 'live',
                    q: channelName,
                    type: 'video',
                    key: apiKey[timeInMs % 5],
                },
            })
            .then((res) => {
                data = res.data
            })
        return data
    }

    const youtubeVideosApi = (videoId) => {
        return youtubeApiKey.get('videos', {
            params: {
                key: apiKey[timeInMs % 5],
                part: 'snippet,liveStreamingDetails,statistics',
                id: videoId,
            },
        })
    }

    const isSubscribeApi = (channelId, accessToken) => {
        return youtubeApiToken.get('subscriptions', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                part: 'snippet',
                forChannelId: channelId,
                mine: true,
            },
        })
    }

    const youtubeSearchApi = ({ channelId, eventType, type }) => {
        return youtubeApiKey.get('search', {
            params: {
                key: apiKey[timeInMs % 5],
                part: 'id,snippet',
                channelId,
                eventType,
                type,
            },
        })
    }

    const youtubeliveChatApi = ({ liveChatId, pageToken, pollingIntervalMillis }) => {
        return youtubeApiKey.get('liveChat/messages', {
            params: {
                key: apiKey[timeInMs % 5],
                part: 'id,snippet,authorDetails',
                liveChatId,
                pageToken,
                pollingIntervalMillis,
            },
        })
    }
    const youtubeliveChatInsertApi = ({ liveChatId, msg }) => {
        return backendAxios.post('/chating', {
            liveChatId,
            msg,
        })
    }
    const insertSubscribeApi = (cId, accessToken) => {
        return youtubeApiToken.post(
            'subscriptions',
            {
                snippet: {
                    resourceId: {
                        kind: 'youtube#channel',
                        channelId: cId,
                    },
                },
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    part: 'snippet',
                },
            },
        )
    }
    const deleteSubscribeApi = (channelId, accessToken) => {
        return youtubeApiToken.delete('subscriptions', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                id: channelId,
            },
        })
    }
    const synchronization = () => {
        return backendAxios.get('/synchronization')
    }
    const youtubeScript = {
        youtubeVideosApi: (videoId) => youtubeVideosApi(videoId),
        youtubeSearchApi: ({ channelId, eventType, type }) => youtubeSearchApi({ channelId, eventType, type }),
        youtubeliveChatApi: (liveChatId) => youtubeliveChatApi(liveChatId),
        isSubscribeApi: (channelId) => isSubscribeApi(channelId),
        insertSubscribeApi: (cId) => insertSubscribeApi(cId),
        deleteSubscribeApi: (channelId) => deleteSubscribeApi(channelId),
        youtubuLiveVideoApi: (channel, channelName) => youtubuLiveVideoApi(channel, channelName),
        synchronization: () => synchronization(),
        youtubeliveChatInsertApi: ({ liveChatId, msg }) => youtubeliveChatInsertApi({ liveChatId, msg }),
    }
    // Inject to context as $api
    inject('youtubeApi', youtubeScript)
}
