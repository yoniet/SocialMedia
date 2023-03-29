const arr = []

export const create = async (user) => {
    try {
        let response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
    return arr;
}



export const list = async (signal) => {

    try {
        let response = await fetch('/api/users/', {
            method: 'GET',
            signal: signal,
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
    return arr;
}

export const read = async (params, credentials, signal) => {
    
    try {
        let response = await fetch('/api/users/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
    return arr;
}

export const update = async (params, credentials, user) => {

    try {
        let response = await fetch('/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: user
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }

}

export const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

// These methods Accessing the follow and unfollow APIs in views
export const follow = async (params, credentials, followId) => {
    try {
        let response = await fetch('/api/users/follow/', {
            method: 'PUT',
            headers: {
                // this is used to inform the server by the client that which content type is understand
                'Accept': 'application/json',
                // this is used to indicate the media type of the resource from server to client
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + credentials.t
            },
            body: JSON.stringify({userId: params.userId, followId: followId})
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
    const arr = []
    return arr
}

export const unfollow = async (params, credentials, unfollowId) => {
    try {
        let response = await fetch('/api/users/unfollow/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId: params.userId, unfollowId: unfollowId})
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export const findPeople = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/users/findpeople/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}



