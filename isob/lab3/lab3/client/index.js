const { Socket } = require('tcp')
const fs = require('fs');

const PORT = '../0001';
const SERVER_PORT = '../0002';

if (fs.existsSync(PORT))
    fs.unlinkSync(PORT);
require('mkfifo').mkfifoSync(PORT, 0o600);
const KACTblL = fs.createWriteStream(PORT);

let socket = new Socket(PORT);

function send() {
    setTimeout(() => {
        socket.send("somedata");
        send();
    }, 3000);
}

function wait_connect() {
    setTimeout(() => {
        if (!socket.connected()) {
            wait_connect();
        }
        else {
            send();
        }
    }, 1000);
}
socket.connect(SERVER_PORT);
wait_connect();