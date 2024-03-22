const { getSubKeys, decrypt, encrypt, pack, unpack, typeson } = require("des");
const express = require("express");

const app = express(); 
const port = process.env.PORT || 5000;

let user_keys = new Map(); // user_id, key
user_keys.set('Nazar', new Uint8Array([ 2, 3, 4, 5, 5, 4, 3, 2]));
let as_tgs_key = new Uint8Array([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
let tgs_id = '5001'; // port of tgs


const availability_term = 5 * 1000; // millisecons

app.use(express.json());
app.listen(port, () => console.log(`Listening on port ${port}`));


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
    
    let user_id = body.user_id;

    if (user_keys.has(user_id)) {
        let c_tgs_key = genUserKey();

        console.log('Generated key: ', c_tgs_key);

        let tgt = {
            c_tgs_key: c_tgs_key,
            user_id: user_id,
            available_until: Date.now() + availability_term,
            time_mark: Date.now()
        }
        tgt = encrypt(pack(tgt), getSubKeys(as_tgs_key));
        let response = {
            c_tgs_key: c_tgs_key,
            tgs_id: tgs_id,
            tgt: tgt
        };

        console.log('Reply sent: ', pack(response));

        response = encrypt(pack(response), getSubKeys(user_keys.get(user_id)));
        res.send(JSON.stringify(typeson.encapsulate(response)));
    } else {
        console.log('No such user');
    }
})