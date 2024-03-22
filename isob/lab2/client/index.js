const { getSubKeys, decrypt, encrypt, pack, unpack, typeson } = require("des");

const user_id = 'Nazar';
//const user_id = "Undefined";
const service_id = '5002';
const user_key = new Uint8Array([ 2, 3, 4, 5, 5, 4, 3, 2 ]);
const as_id = '5000';
const headers = {
    'Content-Type': 'application/json'
};

let service_keys = new Map();

function genAuth() {
    let auth = {
        user_id: user_id,
        time_mark: Date.now()
    }
    console.log('New auth: ', auth);
    return auth
}


async function connectServer(message, server_id) {
    return await fetch(`http://localhost:${server_id}/server/authentication`, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(typeson.encapsulate(message))
    }).then((response) => response.text()). then((response) => {
        response = typeson.revive(JSON.parse(response));
        return response;
    });
}


async function prepareAsMessage() {
    let asMessage = {
        user_id: user_id
    };
    console.log('Message sent to as: ', asMessage);
    let asResponse = await connectServer(asMessage, as_id);
    console.log('Response from as: ', asResponse);
    let asDecrResponse = unpack(decrypt(asResponse, getSubKeys(user_key)));
    console.log('Decrypted response from as: ', asDecrResponse);
    
    return asDecrResponse;
}


async function prepareTgsMessage(asDecrResponse) {
    let auth = genAuth();
    let tgt = asDecrResponse.tgt;
    let tgs_id = asDecrResponse.tgs_id;

    let tgsMessage = {
        service_id: service_id,
        tgt: tgt,
        auth: encrypt(pack(auth), getSubKeys(asDecrResponse.c_tgs_key))
    };
    console.log('Message sent to tgs: ', tgsMessage);
    let tgsResponse = await connectServer(tgsMessage, tgs_id);
    console.log('Response from tgs: ', tgsResponse);
    let tgsDecrResponse = unpack(decrypt(tgsResponse, getSubKeys(asDecrResponse.c_tgs_key)));
    console.log('Decrypted response from tgs: ', tgsDecrResponse);

    return tgsDecrResponse;
}


async function prepareSsMessage(tgsDecrResponse) {
    let auth = genAuth();
    let tgs = tgsDecrResponse.tgs;

    let ssMessage = {
        tgs: tgs,
        auth: encrypt(pack(auth), getSubKeys(tgsDecrResponse.c_service_key))
    };
    console.log('Message sent to ss: ', ssMessage);
    let ssResponse = await connectServer(ssMessage, service_id);
    console.log('Response from ss: ', ssResponse);
    let ssDecrResponse = unpack(decrypt(ssResponse, getSubKeys(tgsDecrResponse.c_service_key)));
    console.log('Decrypted response from ss: ', ssDecrResponse);

    if (ssDecrResponse.time_mark != auth.time_mark + 1) {
        console.log('Service cannot be trusted');
    } else {
        console.log('Connection established');
        service_keys.set(service_id, tgsDecrResponse.c_service_key);
    }
}


async function connect() {
    await prepareSsMessage(await prepareTgsMessage(await prepareAsMessage()));
}

connect();