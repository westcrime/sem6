const fs = require('fs');
const readline = require('readline');


const SLICING_SIZE = 100;


const socket_states = {
    closed: 0,
    listen: 1,
    syn_sent: 2,
    syn_received: 3,
    established: 4,
};


class Socket {
    state = socket_states.closed;
    bound = false;

    constructor(port) {
        this.from_port = port;
    }

    bind() {
        if (this.state != socket_states.closed) {
            throw new Error('Cannot bind open socket');
        }
        this.bound = true;
        this.message_queue = [];
        console.log("Socket bound");
    }

    listen() {
        if (!this.bound) {
            throw new Error('Socket must be bound to listen');
        }
        this.state = socket_states.listen;
        this.start_processing();
        console.log("Socket is listening");
    }

    close() {
        this.bound = false;
        this.data = undefined;
        this.message_queue = undefined;
        this.state = socket_states.closed;
    }

    send(data) {
        for (let i = 0; i < data.length; i += SLICING_SIZE) {
            let sent_size;
            if (i + SLICING_SIZE >= data.length) {
                sent_size = data.length - i;
            }
            else {
                sent_size = SLICING_SIZE;
            }
            let new_msg = {
                from_port: this.from_port,
                to_port: this.to_port,
                sn: this.sn,
                data: data.substring(i, i + sent_size)
            };
            Socket.send_raw(new_msg);
            console.log('Message sent: ', new_msg);
            this.sn += sent_size;
        }
    }

    recv() {
        if (this.data.length != 0) {
            if (self.state != socket_states.established) {
                throw new Error('Socket cannot receive');
            }
            result = this.data;
            this.data = '';
            return result;
        }
    }

    accept() {
        if (this.state != socket_states.listen) {
            throw new Error('Cannot accept on non-listening socket');
        }
        if (this.message_queue.length != 0) {
            let msg = this.message_queue.shift();
            let new_socket = new Socket(this.from_port);
            console.log("New socket created for ", msg.from_port);
            new_socket.state = socket_states.syn_received;
            new_socket.to_port = msg.from_port;
            new_socket.sn_ack = msg.sn + 1;
            new_socket.sn = 300;
            new_socket.data = '';
            Socket.sockets[new_socket.from_port + new_socket.to_port] = new_socket;
            let new_msg = {
                from_port: new_socket.from_port,
                to_port: new_socket.to_port,
                sn: new_socket.sn,
                sn_ack: new_socket.sn_ack,
                syn: true,
                ack: true
            };
            Socket.send_raw(new_msg);
            console.log('Message sent: ', new_msg);
            new_socket.sn += 1;
            return new_socket;
        }
    }

    connect(port) {
        if (this.state != socket_states.closed) {
            throw new Error('Cannot connect open socket');
        }
        this.sn = 100;
        this.data = '';
        this.to_port = port;
        this.state = socket_states.syn_sent;
        let new_msg = {
            from_port: this.from_port,
            to_port: this.to_port,
            sn: this.sn,
            syn: true
        };
        Socket.send_raw(new_msg);
        console.log('Message sent to server: ', new_msg);
        this.sn += 1;
        this.start_processing();
    }

    connected() {
        return this.state == socket_states.established;
    }

    start_processing() {
        const stream = fs.createReadStream(this.from_port);

        var rl = readline.createInterface({
            input: stream
        });
        
        //const KACTblL = fs.createWriteStream(this.from_port);
        
        rl.on('line', (line) => {
            let msg = JSON.parse(line);
            this.process_message(msg);
        });
    }

    process_message(msg) {
        switch(this.state) {
            case socket_states.listen:
                if ((msg.to_port+msg.from_port) in Socket.sockets)
                {
                    Socket.sockets[msg.to_port + msg.from_port].process_message(msg);
                }
                else if (msg.syn && msg.sn) {
                    console.log('Message added to listen queue: ', msg);
                    this.message_queue.push(msg);
                }
                break;
            case socket_states.syn_sent:
                if (this.to_port == msg.from_port) {
                    if (msg.rst) {
                        console.log("Connection interrupted!");
                        this.close();
                    }
                    if (msg.sn_ack == this.sn && msg.sn && msg.syn && msg.ack) {
                        console.log('Message received: ', msg);
                        this.sn_ack = msg.sn + 1;
                        this.state = socket_states.established;
                        console.log("connection established");
                        let new_msg = {
                            from_port: this.from_port,
                            to_port: this.to_port,
                            sn: this.sn,
                            sn_ack: this.sn_ack,
                            ack: true
                        };
                        Socket.send_raw(new_msg);
                        console.log('Message sent: ', new_msg);
                    }
                }
                break;
            case socket_states.syn_received:
                if (this.to_port == msg.from_port) {
                    if (msg.rst) {
                        console.log("Connection interrupted!");
                        this.close();
                    }
                    if (this.sn == msg.sn_ack && msg.ack) {
                        console.log('Message received: ', msg);
                        this.state = socket_states.established;
                        console.log("connection established");
                    }
                }
            case socket_states.established:
                if (this.to_port == msg.from_port) {
                    if (msg.rst) {
                        console.log("Connection interrupted!");
                        this.close();
                    }
                    if (msg.data && this.sn_ack == msg.sn) {
                        console.log('Message received: ', msg);
                        this.sn_ack += msg.data.length;
                        this.data += msg.data;
                    }
                }
            default:
                break;
        }
    }

    static send_raw(msg) {
        if (fs.existsSync(msg.to_port))
        {
            const stream = fs.createWriteStream(msg.to_port);
            stream.write(JSON.stringify(msg) + '\n');
        }
    }

    static sockets = {};
}

module.exports = { Socket };