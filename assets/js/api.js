const ReqData = {
    URL_BASE: 'https://api.football-data.org/v2',
    ID_LIGA: '2021', // ID Liga Inggris
    get End_Point() {
        return {
            URL_BASE: this.URL_BASE,
            KLASEMEN: `${this.URL_BASE}/competitions/${this.ID_LIGA}/standings/`,
            TEAM: `${this.URL_BASE}/teams/`,
            upComing: `${this.URL_BASE}/competitions/${this.ID_LIGA}/matches?status=SCHEDULED`,
            matchDetail: `${this.URL_BASE}/matches`,
            TopScore : `${this.URL_BASE}/competitions/${this.ID_LIGA}/scorers`
        }
    }
}
const {
    End_Point,
} = ReqData

function fetchData(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            'X-Auth-Token': '6c124042cf26494ca5029d187750e17e'
        }
    })
}
async function getKlasemen() {
    try {
        if ('caches' in window) {
            let res = await caches.match(End_Point.KLASEMEN)
            return await res.json()
        }
    } catch (error) {
        try {
            const res = await fetchData(End_Point.KLASEMEN)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }
}
async function getTeam(id) {
    try {
        if ('caches' in window) {
            let res = await caches.match(End_Point.TEAM + '/' + id)
            if (res !== undefined) {
                return await res.json()
            }
            throw 'err'
        }

    } catch (error) {
        try {
            const res = await fetchData(End_Point.TEAM + '/' + id)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }
}
async function getTopScore() {
    try {
        if ('caches' in window) {
            let res = await caches.match(End_Point.TopScore)
            return await res.json()
        }
    } catch (error) {
        try {
            const res = await fetchData(End_Point.TopScore)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }
}
async function getMatchTeam(id, limit = 3) {
    try {
        if ('caches' in window) {
            let res = await caches.match(End_Point.URL_BASE + `/teams/${id}/matches/?status=SCHEDULED${limit == 3 ? '&limit=3' : ''}`)
            return await res.json()
        }
    } catch (error) {
        try {
            const res = await fetchData(End_Point.URL_BASE + `/teams/${id}/matches/?status=SCHEDULED${limit == 3 ? '&limit=3' : ''}`)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }
}
async function getMatch(id) {
    if (id !== null) {
        return await getMatchTeam(id, false)
    } else {
        try {
            if ('caches' in window) {
                let res = await caches.match(End_Point.upComing)
                return await res.json()
            }
        } catch (error) {
            try {
                const res = await fetchData(End_Point.upComing)
                return await res.json()
            } catch (error) {
                console.log(error);
            }
        }
    }
}