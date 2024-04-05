const net = require('net');
const { IP_ADDRESS, SERVER_PORT, DATA_SIZE, MESSAGE } = require('./constants');
const { TCPPacket, divideIntoPackages } = require('./tcp');

const serverAddress = { host: IP_ADDRESS, port: SERVER_PORT };

const server = net.createServer((clientSocket) => {
  console.log('[server] Server is open for connections\n');
  let i = 0;
  
  clientSocket.on('data', (data) => {
    const message = data.toString('ascii'); 
    let packet = new TCPPacket();
    packet.receive(message);
    if (packet.data === 'GET CONNECTION') {
      packet.SYN += packet.ACK;
      packet.flags['ACK'] = true;
      console.log('[server] Sent to client:');
      console.log(packet, '\n');
      packet.send(clientSocket);
      return;
    }
    
    if (packet.data === 'GET DATA') {
      packet.data = MESSAGE;
      let packets = divideIntoPackages(packet, DATA_SIZE);
      packets.push(new TCPPacket(packet.destination_port, SERVER_PORT, 0, 1, DATA_SIZE, 'end of data transmission'));
      if (i === packets.length) {
        return;
      }
      
      if (packet.flags['RST']) {
        throw new Error('Connection reset due to RST flag');
      }
      
      packets[i].ACK = packet.SYN + packet.data.length;
      packets[i].flags['ACK'] = true;
      packets[i].SYN = packet.ACK;
      console.log('[server] Sent to client:');
      console.log(packets[i], '\n');
      
      packets[i].send(clientSocket);

      packets[packets.length - 1].flags['FIN'] = true;
      packets[packets.length - 1].data = '';

      if (packets[i].data === 'FINISH SESSION') {
        console.log('[server] End of work:');
        clientSocket.end();
        i = 0;
      } else {
        i++;
      }
    }
  });
  
  clientSocket.on('end', () => {
    console.log('[server] Session finished\n');
    clientSocket.destroy();
  });
  
  clientSocket.on('error', (err) => {
    console.error(err);
    clientSocket.destroy();
  });
});

server.on('error', (err) => {
  console.error(err);
  server.close();
});

server.listen(SERVER_PORT, () => {
    console.log(`[server] Listening on ${IP_ADDRESS}:${SERVER_PORT}`);
});
