export default function({ $axios }, inject) {
    const accessToken =
        'ya29.a0AfH6SMDIh61B0gU8SvVou5if_r7yFUIfPtClDPWFv4fRgfzm9ZPwf-5Tw1olt_4qF4ESAfN1_nj-7OK1h44wBswrPCnUFWV4njc7Vmmkk2mF_Smsro3Drqpa3VszjTps7bcEQptwhaxLX1lHMIsSjZqcdBXSxzIagPvO'

    // Create a custom axios instance
    const youtubeApiKey = $axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })
    const youtubeApiToken = $axios.create({
        headers: { Authorization: `Bearer ${accessToken}` },
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })

    const apiKey = 'AIzaSyAeFj5orE1ldMI0P_J7LjhEKwwqrbIilmE'

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
                    key: apiKey,
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
                key: apiKey,
                part: 'snippet,liveStreamingDetails,statistics',
                id: videoId,
            },
        })
    }

    const isSubscribeApi = (channelId) => {
        return youtubeApiToken.get('subscriptions', {
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
                key: apiKey,
                part: 'id,snippet',
                channelId,
                eventType,
                type,
            },
        })
    }

    const youtubeliveChatApi = ({ liveChatId, pageToken, pollingIntervalMillis }) => {
        console.log(liveChatId)
        const query = {
            params: {
                key: apiKey,
                part: 'id,snippet,authorDetails',
                liveChatId,
                pageToken,
                pollingIntervalMillis,
            },
        }
        console.log(query)
        return youtubeApiKey.get('liveChat/messages', {
            params: {
                key: apiKey,
                part: 'id,snippet,authorDetails',
                liveChatId,
                pageToken,
                pollingIntervalMillis,
            },
        })
    }
    const insertSubscribeApi = (cId) => {
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
                params: {
                    part: 'snippet',
                },
            },
        )
    }
    const deleteSubscribeApi = (channelId) => {
        return youtubeApiToken.delete('subscriptions', {
            params: {
                id: channelId,
            },
        })
    }

    const youtubeScript = {
        youtubeVideosApi: (videoId) => youtubeVideosApi(videoId),
        youtubeSearchApi: ({ channelId, eventType, type }) => youtubeSearchApi({ channelId, eventType, type }),
        youtubeliveChatApi: (liveChatId) => youtubeliveChatApi(liveChatId),
        isSubscribeApi: (channelId) => isSubscribeApi(channelId),
        insertSubscribeApi: (cId) => insertSubscribeApi(cId),
        deleteSubscribeApi: (channelId) => deleteSubscribeApi(channelId),
        youtubuLiveVideoApi: (channel, channelName) => youtubuLiveVideoApi(channel, channelName),
    }
    // Inject to context as $api
    inject('youtubeApi', youtubeScript)
}
