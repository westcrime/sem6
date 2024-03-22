const { getSubKeys, decrypt, encrypt, pack, unpack, typeson } = require("des");
const express = require("express");

const app = express(); 
const port = process.env.PORT || 5002;

let tgs_service_key = new Uint8Array([ 8, 7, 6, 5, 4, 3, 2, 1]);

const user_mark_expiration_term = 2 * 1000 * 60; // millisecons

let user_keys = new Map();

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));


app.post('/server/authentication', (req, res) => {
    let body = typeson.revive(req.body);
    console.log('Message received: ', body);

    let tgs = body.tgs;
    let auth = body.auth;

    tgs = unpack(decrypt(tgs, getSubKeys(tgs_service_key)));
    if (typeof(tgs) !== 'object'){
        console.log('Cannot decrypt value!');
        return;
    }
    if (tgs.available_until < Date.now()) {
        console.log('Term of tgt expired!');
        return;
    }
    auth = unpack(decrypt(auth, getSubKeys(tgs.c_service_key)));
    if (Date.now() - auth.time_mark > user_mark_expiration_term) {
        console.log('User mark is too old!');
        return;
    }
    if (auth.user_id !== tgs.user_id) {
        console.log('User undefined!');
        return;
    }

    user_keys.set(auth.user_id, tgs.c_service_key);
    let response = {
        time_mark: auth.time_mark + 1
    }

    console.log('Reply sent: ', response);

    response = encrypt(pack(response), getSubKeys(user_keys.get(auth.user_id)));
    res.send(JSON.stringify(typeson.encapsulate(response)));
})