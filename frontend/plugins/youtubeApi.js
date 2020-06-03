export default function({ $axios }, inject) {
    const accessToken =
        'ya29.a0AfH6SMDIh61B0gU8SvVou5if_r7yFUIfPtClDPWFv4fRgfzm9ZPwf-5Tw1olt_4qF4ESAfN1_nj-7OK1h44wBswrPCnUFWV4njc7Vmmkk2mF_Smsro3Drqpa3VszjTps7bcEQptwhaxLX1lHMIsSjZqcdBXSxzIagPvO'

    // Create a custom axios instance
    const youtubeApi = $axios.create({
        headers: { Authorization: `Bearer ${accessToken}` },
        baseURL: 'https://www.googleapis.com/youtube/v3/',
    })

    const isSubscribeApi = (channelId) => {
        return youtubeApi.get('subscriptions', {
            params: {
                part: 'snippet',
                forChannelId: channelId,
                mine: true,
            },
        })
    }

    const insertSubscribeApi = (cId) => {
        return youtubeApi.post(
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
        return youtubeApi.delete('subscriptions', {
            params: {
                id: channelId,
            },
        })
    }

    const youtubeScript = {
        isSubscribeApi: (channelId) => isSubscribeApi(channelId),
        insertSubscribeApi: (cId) => insertSubscribeApi(cId),
        deleteSubscribeApi: (channelId) => deleteSubscribeApi(channelId),
    }

    // Inject to context as $api
    inject('youtubeApi', youtubeScript)
}
