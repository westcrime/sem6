const net = require('net');
const { IP_ADDRESS, SERVER_PORT, DATA_SIZE, MESSAGE } = require('./constants');
const { TCPPacket, divideIntoPackages } = require('./tcp');
const { promisify } = require('util');

const client = new net.Socket();

client.on('data', (data) => {
    let packet = new TCPPacket();
    packet.receive(data);

//   TCP Reset Attack (клиентская часть)
    // packet.flags['RST'] = true;

    if (packet.flags['FIN']) {
        packet.data = 'FINISH SESSION';
        console.log('[client] Sent to server:');
        console.log(packet, '\n');
        packet.send(client);
        return;
    }
          
    packet.ACK = packet.SYN + packet.data.length;

    packet.flags['ACK'] = false;
    packet.data = 'GET DATA';
    console.log('[client] Sent to server:');
    console.log(packet, '\n');
    packet.send(client);
});

client.on('close', () => {
    console.log('[client] Connection closed');
});

client.on('error', (err) => {
    console.error(err);
    client.destroy();
});


client.connect({ port: SERVER_PORT, host: 'localhost' }, async () => {
    console.log('[client] Connection established with server.\n');

    let clientPort = client.localPort;
    let packet = new TCPPacket(clientPort, SERVER_PORT, 0, 1, DATA_SIZE, 'GET CONNECTION', true);

    console.log('[client] Sent to server:');
    console.log(packet, '\n');
    packet.send(client);
    // SYN Flooding (клиентская часть:)
    while (true) {
      while (true) {
          console.log('[client] Sent to server:');
          console.log(packet, '\n');
          packet.send(client);

        await promisify(setTimeout)(500);
      }

    }
});