const { getSubKeys, decrypt, encrypt, pack, unpack, typeson } = require("des");
const express = require("express");

const app = express(); 
const port = process.env.PORT || 5001;

let tgs_service_keys = new Map(); // service_id, key
tgs_service_keys.set('5002', new Uint8Array([ 8, 7, 6, 5, 4, 3, 2, 1]));
let as_tgs_key = new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8 ]);

const availability_term = 5 * 1000 * 60; // millisecons
const user_mark_expiration_term = 2 * 1000 * 60; // millisecons

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));

// function sleepFor(sleepDuration){
//     var now = new Date().getTime();
//     while(new Date().getTime() < now + sleepDuration);
// }

function genUserKey() {
    const max = 255;
    return new Uint8Array([ Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max),
                            Math.floor(Math.random() * max) ]);
}

app.post('/server/authentication', (req, res) => {
    let body = typeson.revive(req.body);
    console.log('Message received: ', body);

    let service_id = body.service_id;
    let tgt = body.tgt;
    let auth = body.auth;

    tgt = unpack(decrypt(tgt, getSubKeys(as_tgs_key)));
    if (typeof(tgt) !== 'object'){
        console.log('Cannot decrypt value!');
        return;
    }

    //sleepFor(10000);

    if (tgt.available_until < Date.now()) {
        console.log('Term of tgt expired!');
        return;
    }
    auth = unpack(decrypt(auth, getSubKeys(tgt.c_tgs_key)));
    if (Date.now() - auth.time_mark > user_mark_expiration_term) {
        console.log('User mark is too old!');
        return;
    }
    if (auth.user_id !== tgt.user_id) {
        console.log('User undefined!');
        return;
    }

    if (tgs_service_keys.has(service_id)) {
        let c_service_key = genUserKey();
        let tgs = {
            c_service_key: c_service_key,
            user_id: auth.user_id,
            available_until: Date.now() + availability_term,
            time_mark: Date.now()
        }
        tgs = encrypt(pack(tgs), getSubKeys(tgs_service_keys.get(service_id)));
        let response = {
            c_service_key: c_service_key,
            tgs: tgs
        };

        console.log('Reply sent: ', response);

        response = encrypt(pack(response), getSubKeys(tgt.c_tgs_key));
        res.send(JSON.stringify(typeson.encapsulate(response)));
    } else {
        console.log('Undefined service!');
    }
})