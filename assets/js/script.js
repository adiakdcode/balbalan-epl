//Route Page
const route = function (id = null) {
    parseUrl(id).then(url => {
        switch (url.page) {
            case 'team':
                showTeam(url.query.id)
            break
            case 'match':
                if (url.query.teamId != undefined) {
                    showMatch(url.query.teamId)
                } else {
                    showMatch()
                }
            break
            case 'fav-team':
                showFavTeam()
            break
            case 'topscore':
                loadPage(url.page).then(page => {
                    if (page == 'topscore') showTopScore()
                    })
            break
            default:
                loadPage(url.page).then(page => {
                    if (page == 'home') showKlasemen()
                })
            break
        }
    })
}
document.addEventListener('DOMContentLoaded', async function () {
    loadNav()
    route()
})
// Home page
async function showKlasemen() {
    const tbody = document.querySelector('tbody')
    let rowTable = ''
    const data = await getKlasemen()
    await data.standings[0].table.forEach(klasemen => {
        rowTable += `<tr>
                <td class="purple white-text">${klasemen.position}</td>
                    <td class="yellow"><a href="#team?id=${klasemen.team.id}" class="link-to-team valign-wrapper">
                    <img src="${klasemen.team.crestUrl.replace(/^http:\/\//i, 'https://')}"
                    class="responsive-img cres" alt=""> ${klasemen.team.name}</a></td>
                    <td class="orange">${klasemen.playedGames}</td>
                    <td class="orange lighten-5">${klasemen.won}</td>
                    <td class="orange lighten-5">${klasemen.draw}</td>
                    <td class="red white-text">${klasemen.lost}</td>
                    <td class="purple lighten-3">${klasemen.goalsFor}</td>
                    <td class="purple lighten-3">${klasemen.goalsAgainst}</td>
                    <td class="purple lighten-3">${klasemen.goalDifference}</td>
                    <td class="green white-text">${klasemen.points}</td>
                </tr>`
    })
    tbody.innerHTML = rowTable
    document.getElementById('progress').style.display = 'none'
    document.querySelectorAll('.link-to-team').forEach(link => {
        link.addEventListener('click', async click => {
            route(click.target.getAttribute('href'))
        })
    })
}
// * Top Score page 
async function showTopScore() {
    const tbody = document.querySelector('tbody')
    let rowTable = ''
    const data = await getTopScore()
    await data.scorers.forEach(score => {
        rowTable += `
                <tr>
                    <td class="purple accent-3 white-text">${score.player.name}</td>
                    <td class="purple lighten-3 white-text">${score.team.name}</td>
                    <td class="purple accent-3 white-text">${score.player.position}</td>
                    <td class="purple lighten-3 white-text">${score.numberOfGoals}</td>
                </tr>
                `
    })
    tbody.innerHTML = rowTable
    document.getElementById('progress').style.display = 'none'
}

// Team page
async function showTeam(id) {
    const data = await getTeam(id)
    const matchdata = await getMatchTeam(id)

    let squadLeft = '',
        squadRight = '',
        league = '',
        match = ''

    data.activeCompetitions.forEach(sqaad => {
        league += `<a href="">${sqaad.name}</a> ,`
    })
    data.squad.forEach((sqaad, i) => {
        if (i < (data.squad.length / 2)) {
            squadLeft += `
                    <li>
                    <div class="collapsible-header">${sqaad.name}</div>
                    <div class="collapsible-body p-0">
                        <ul class="collection">
                            <li class="collection-item">Posisi : ${sqaad.position}</li>
                            <li class="collection-item">Tanggal Lahir : ${sqaad.dateOfBirth}</li>
                            <li class="collection-item">WN : ${sqaad.nationality}</li>
                            <li class="collection-item">Nomor Punggung : ${sqaad.shirtNumber == null ? 'none' : sqaad.shirtNumber}</li>
                            <li class="collection-item">Role : ${(sqaad.role).toLowerCase()}</li>
                        </ul>
                    </div>
                </li>
                    `
        } else {
            squadRight += `
                    <li>
                    <div class="collapsible-header">${sqaad.name}</div>
                    <div class="collapsible-body p-0">
                        <ul class="collection">
                            <li class="collection-item">Posisi : ${sqaad.position}</li>
                            <li class="collection-item">dTanggal Lahir : ${sqaad.dateOfBirth}</li>
                            <li class="collection-item">WN : ${sqaad.nationality}</li>
                            <li class="collection-item">Nomor Kaos : ${sqaad.shirtNumber == null ? 'none' : sqaad.shirtNumber}</li>
                            <li class="collection-item">Role : ${(sqaad.role).toLowerCase()}</li>
                        </ul>
                    </div>
                </li>
                    `
        }
    })
    matchdata.matches.forEach(sqaad => {
        match += `
        <li class="collection-item">
        <div class="row">
            <div class="col s12 m12 l12 justify-center">
                <p class=" text-darken-3">${new Date(sqaad.utcDate).toLocaleDateString('en-ID',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        <div class="row mb-0 deep-purple lighten-4">
            <div class="col s5 m5 l5">
                <h6>Home</h6> 
                <a href="#team?id=${sqaad.homeTeam.id}">${sqaad.homeTeam.name}</a> 
            </div>
            <div class="col s2 m2 l2">
                <h5>VS</h5>
            </div>
            <div class="col s5 m5 l5">
                <h6>Away</h6> 
                <a href="#team?id=${sqaad.awayTeam.id}">${sqaad.awayTeam.name}</a>   
            </div>
        </div>
    </li>
    `
    })

    loadPage('team').then(function () {
        initCollapsable()

        let dataFav = {
            id: data.id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            website: data.website,
            founded: data.founded,
            clubColors: data.clubColors,
            vanue: data.vanue,
            crestUrl: data.crestUrl,
            league,
            squadLeft,
            squadRight,
            match,
        }

        document.querySelector('#league').innerHTML = `liga : ${league}`
        document.querySelector('.team-name h1').innerHTML = data.name
        document.querySelector('#squadLeft').innerHTML = squadLeft
        document.querySelector('#squadRight').innerHTML = squadRight

        document.querySelector('#information').innerHTML = `
            <li class="collection-item">Alamat : ${data.address}</li>
            <li class="collection-item">Telepon : ${data.phone}</li>
            <li class="collection-item">Website : <a href="${data.website}" target="_blank">${data.website}</a></li>
            <li class="collection-item">E-Mail : ${data.email}</li>
            <li class="collection-item">Didirikan : ${data.founded}</li>
            <li class="collection-item">Warna Klub : ${data.clubColors}</li>
        `
        crestImage = document.querySelector('.team-wraper-top img')
        crestImage.setAttribute('src', data.crestUrl.replace(/^http:\/\//i, 'https://'))
        crestImage.setAttribute('alt', data.name)

        document.querySelector('#upCommingTeamMatch').innerHTML = match

        document.querySelectorAll('#upCommingTeamMatch a').forEach(link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })

        const showMore = document.querySelector('#matchByTeam')
        showMore.setAttribute('href', `#match?teamId=${id}`)
        showMore.addEventListener('click', function (sqaad) {
            route(sqaad.target.getAttribute('href'))
        })

        checkFav(data.id)
        const teamFavButton = document.querySelector('.fav-btn')
        teamFavButton.addEventListener('click', click => {
            click.preventDefault()
            checkFav(data.id, true)
        })


        function checkFav(id, event = false) {
            isFavTeam(id).then(sqaad => {
                if (sqaad) {
                    if (event) {
                        M.toast({html: '<img src="./assets/images/icon.png" style="width: 60px;">' + data.name + ' Berhasil Dihapus '})
                        deleteTeamFav(id);
                        teamFavButton.innerHTML = '<i class="material-icons">sentiment_very_satisfied</i></a>'
                    }
                } else {
                    if (event) {
                        M.toast({html: '<img src="./assets/images/icon.png" style="width: 60px;">' + data.name + ' Berhasil ditambakan ke Favorite'})
                        addTeamFav(dataFav);
                        teamFavButton.innerHTML = '<i class="material-icons">sentiment_very_dissatisfied</i></a>'
                    }
                }
            })
        }
    })
    document.getElementById('progress').style.display = 'none'
}

// * Match page 
async function showMatch(id = null) {
    const data = await getMatch(id)
    let match = ''

    data.matches.forEach(matchLi => {
        match += `
        <div class="col s12 m6 l6">
            <div class="card purple horizontal d-flex f-width-100 align-item-center">
                <div class="card-content blue">
                <div class="row">
                <div class="col s12 m12 l12 justify-center">
                    <p class=" text-darken-3">${new Date(matchLi.utcDate).toLocaleDateString('en-ID',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div class="row mb-0">
                <div class="col s5 m5 l5">
                    <h6>Home</h6> 
                    <a class="white-text" id="home-team-link" href="#team?id=${matchLi.homeTeam.id}">${matchLi.homeTeam.name}</a> 
                </div>
                <div class="col s2 m2 l2">
                    <h5>VS</h5>
                </div>
                <div class="col s5 m5 l5">
                    <h6>Away</h6> 
                    <a class="white-text" id="away-team-link" href="#team?id=${matchLi.awayTeam.id}">${matchLi.awayTeam.name}</a>   
                </div>
            </div>
                </div>
            </div>
        </div>
            `
    })
    loadPage('match').then(function () {
        document.querySelector('#match').innerHTML = match
        document.getElementById('progress').style.display = 'none'

        document.querySelectorAll('#home-team-link , #away-team-link').forEach(link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })
    })
}

// Favorite team Page
function showFavTeam() {
    let data = ''
    getAllTeamFav().then(favs => {
        for (const timFav of favs) {
            data += `
                    <li class="collection-item left-align" id="unfav-id-${timFav.id}">
                    <div class="d-flex space-betwen align-item-center">
                        <img src="${timFav.crestUrl.replace(/^http:\/\//i, 'https://')}"
                        class="responsive-img cres" alt="tim_logo"></a></td>
                        <a href="#team?id=${timFav.id}" class="left-align link-team">${timFav.name}</a>
                        <a href="#unfav-me" class="waves-effect waves-light btn purple unfav" data-id="${timFav.id}">
                        <i class="material-icons">sentiment_very_dissatisfied</i></a>
                    </div>
                    </li>`
        }
    })

    loadPage('fav-team').then(function () {
        const ulTeamFav = document.querySelector('#ul-team-fav')
        ulTeamFav.innerHTML = data

        document.querySelectorAll('.unfav').forEach( btn => {
            btn.addEventListener('click',click => {
                click.preventDefault()
                deleteTeamFav(parseInt(click.target.getAttribute('data-id')))
                ulTeamFav.querySelector('#unfav-id-'+click.target.getAttribute('data-id')).style.display = 'none'
            })
        })

        ulTeamFav.querySelectorAll('.link-team').forEach( link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })
    })
}
// Service worker Regis
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js').then(function () {
            console.log('Service Worker: dapat berjalan')
        }).catch(function () {
            console.log('Service Worker: gagal');
        })
    })
} else {
    console.log('Service Worker: Opps sepertinya Browser ini Tidak mendukung Service Worker');
}
//Notif
function requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (result) {
        if (result === "denied") {
          console.log("Fitur notifikasi tidak diijinkan.");
          return;
        } else if (result === "default") {
          console.error("User menutup kotak dialog permintaan ijin.");
          return;
        }
        
        navigator.serviceWorker.getRegistration().then(function(reg) {
          reg.showNotification('Notifikasi diijinkan!');
        });
      });
    }
}
//Slideer
$(document).ready(function(){
    $('.slider').slider();
});

