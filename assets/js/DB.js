let dbPromise = idb.open("BalBalan", 3, function (upgradeDB) {
    if (!upgradeDB.objectStoreNames.contains('teamFavorite')) {
        let teamStore = upgradeDB.createObjectStore('teamFavorite', {
            keyPath: 'id',
            autoIncrement: false
        })
        teamStore.createIndex('id', 'id', {
            unique: true
        })
    }
})
// ADD data Team
function addTeamFav(data) {
    dbPromise.then(db => {
        let tx = db.transaction('teamFavorite', 'readwrite')
        tx.objectStore('teamFavorite').put(data)
        return tx.complete
    })
}
// READ data Team
function getAllTeamFav() {
    return dbPromise.then(async db => {
        let tx = await db.transaction('teamFavorite', 'readonly')
        let store = await tx.objectStore('teamFavorite')
        return await store.getAll()
    })
}
// Mengecek Data
function isFavTeam(id) {
    return dbPromise.then(async db => {
        let tx = await db.transaction('teamFavorite', 'readonly')
        let data = await tx.objectStore('teamFavorite').get(id)
        return data == undefined ? false : true
    })

}
// DELETE data Team
function deleteTeamFav(id) {
    dbPromise.then(db => {
        let tx = db.transaction('teamFavorite','readwrite')
        tx.objectStore('teamFavorite').delete(id)
        return tx.complete
    })
}