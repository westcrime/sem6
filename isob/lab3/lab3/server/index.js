const { Socket } = require('tcp');
const fs = require('fs');

const PORT = '../0002';

if (fs.existsSync(PORT))
    fs.unlinkSync(PORT);
require('mkfifo').mkfifoSync(PORT, 0o600);
const KACTblL = fs.createWriteStream(PORT);

let socket = new Socket(PORT);
socket.bind();
socket.listen();

function accept_connections() {
    setTimeout(() => {
        socket.accept();
        accept_connections();
    }, 1000);
}

accept_connections();