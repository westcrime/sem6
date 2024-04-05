const { Socket } = require('tcp')
const fs = require('fs');

const PORT = '../0003';
const SERVER_PORT = '../0002';
const CLIENT_PORT = '../0001';

if (fs.existsSync(PORT))
    fs.unlinkSync(PORT);
require('mkfifo').mkfifoSync(PORT, 0o600);
const KACTblL = fs.createWriteStream(PORT);

// first attack
/*function interrupt() {
    setTimeout(() => {
        let new_msg = {
            from_port: CLIENT_PORT,
            to_port: SERVER_PORT,
            rst: true
        };
        console.log('Sending message: ', new_msg);
        Socket.send_raw(new_msg);
        interrupt();
    }, 3000);
}
interrupt();*/

//second attack
let current_port = 0;
function load() {
    setTimeout(() => {
        let new_msg = {
            from_port: `${current_port += 1}`,
            to_port: SERVER_PORT,
            sn: 300,
            syn: true
        };
        console.log('Sending message: ', new_msg);
        Socket.send_raw(new_msg);
        load();
    }, 3000);
}
load();

//Jusn second user
/*let socket = new Socket(PORT);
socket.connect(SERVER_PORT);*/ 