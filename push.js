const webPush = require("web-push");

const vapidKeys = {
    publicKey : "BJZ6SLt8j17LK0pT54faMSbZpBfxSzHcPUgbL_OX3dXPMqeDnQAVVv4ua8X7AWMwMCUYb52Pe_ubvXWq5SmJeQ4",
    privateKey : "HRemInsC8HHFhM4fJRhsj7q_m4ynHUYa5QiRdFdtwLs"
}
const subscription = {
    endpoint : "https://fcm.googleapis.com/fcm/send/cBZAE_pjlHE:APA91bED3hWEeC6joXVGar_uDOIx6h67SeYlnLwytAS9DB6Au_g1eTpNLphNAOL5lpGEcH2VNAQgYzyuEukzT9dDenwmQaVZ8xCP3TuhJft26sMPz_w-vYrUlbB4ONgOSxYXXBMnHtUv",
    keys : {
        p256dh : "BGIsB8d+f/hgsR4FvzvOsTgJ2Z7Y8SmqYP+ovXt3seqx4Sv3mFyB3wzNW4L4BrYfPf8oYwOCeJ3VyXA938I/Qg8=",
        auth : "cH+mOXvnx5xxngku2fbumw=="
    }
}
const options = {
    gcmAPIKey : "903526469832",
    TTL : 60
}
webPush.setVapidDetails(
    'mailto:adiawahyudwiprasetya32gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
    )

let payloads = "Bikuri shita Push Notifikasi bisa digunakan !"

webPush.sendNotification(
    subscription,
    payloads,
    options
)