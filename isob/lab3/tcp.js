const net = require('net');
const { promisify } = require('util');

class TCPPacket {
  constructor(source_port = null, destination_port = null, syn_n = 0, ack_n = 0, data_size = null, data = '', ack = false, syn = false, fin = false, rst = false) {
    this.source_port = source_port;
    this.destination_port = destination_port;
    this.SYN = syn_n; // sequence number for connection establishment
    this.ACK = ack_n; // number to acknowledge the receipt of data
    this.flags = {
      ACK: ack,
      SYN: syn,
      FIN: fin,
      RST: rst
    };
    this.data_size = data_size;
    this.data = data;
  }

  toString() {
    return JSON.stringify({
      SOURCE_PORT: this.source_port,
      DESTINATION_PORT: this.destination_port,
      SYN: this.SYN,
      ACK: this.ACK,
      FLAGS: this.flags,
      WINDOW_SIZE: this.data_size,
      DATA: this.data
    }, null, 4);
  }

  async send(socket) {
    socket.write(this.toString());
    await promisify(setTimeout)(500);
  }

  async receive(data) {
    const packetData = JSON.parse(data);
    this.source_port = packetData.SOURCE_PORT;
    this.destination_port = packetData.DESTINATION_PORT;
    this.SYN = packetData.SYN;
    this.ACK = packetData.ACK;
    this.data_size = packetData.WINDOW_SIZE;
    this.data = packetData.DATA;
    this.flags = {
      ACK: packetData.FLAGS.ACK,
      SYN: packetData.FLAGS.SYN,
      FIN: packetData.FLAGS.FIN,
      RST: packetData.FLAGS.RST};
    await promisify(setTimeout)(500);
  }
}

function divideIntoPackages(tcp_packet, data_size) {
  const size_of_data = data_size / 8;
  const dataChunks = [];
  for (let i = 0; i < tcp_packet.data.length; i += size_of_data) {
    dataChunks.push(tcp_packet.data.substring(i, i + size_of_data));
  }

  return dataChunks.map(dataChunk => new TCPPacket(
    tcp_packet.source_port,
    tcp_packet.destination_port,
    tcp_packet.SYN,
    tcp_packet.ACK,
    tcp_packet.data_size,
    dataChunk,
    tcp_packet.flags.ACK,
    tcp_packet.flags.SYN,
    tcp_packet.flags.FIN,
    tcp_packet.flags.RST
  ));
}

module.exports = { TCPPacket, divideIntoPackages };
