import json
import socket
import time


class TCPPacket:
    def __init__(self, source_port=None, destionation_port=None, syn_n=0,
                 ack_n=0, data_size=None,
                 data='', ack=False, syn=False, fin=False, rst=False) -> None:
        self.source_port = source_port
        self.destionation_port = destionation_port
        self.SYN = syn_n # номер последовательности для установки соед
        self.ACK = ack_n # номер для подтверждения получения данных
        self.flags = {
            'ACK': ack,
            'SYN': syn,
            'FIN': fin,
            'RST': rst
        }

        self.data_size = data_size
        self.data = data

    def __str__(self) -> str:
        return json.dumps({
            'SOURCE_PORT': self.source_port,
            'DESTINATION_PORT': self.destionation_port,
            'SYN': self.SYN,
            'ACK': self.ACK,
            'FLAGS': self.flags,
            'WINDOW_SIZE': self.data_size,
            'DATA': self.data
        }, indent=4)

    def send(self, socket: socket.socket) -> None:
        socket.sendall(self.__str__().encode())
        time.sleep(0.5)

    def receive(self, socket: socket.socket) -> None:
        packet = json.loads(socket.recv(1024).decode())
        self.__init__(packet['SOURCE_PORT'], packet['DESTINATION_PORT'],
                      packet['SYN'], packet['ACK'],
                      packet['WINDOW_SIZE'], packet['DATA'],
                      ack=packet['FLAGS']['ACK'],
                      syn=packet['FLAGS']['SYN'], fin=packet['FLAGS']['FIN'],
                      rst=packet['FLAGS']['RST'])
        time.sleep(0.5)


def divide_into_packages(tcp_packet: TCPPacket, data_size: int) -> list[TCPPacket]:
    size_of_data = data_size // 8
    data = [tcp_packet.data[i:i + size_of_data] for i in range(0, len(tcp_packet.data), size_of_data)]

    packets = []
    for d in data:
        packet = TCPPacket(tcp_packet.source_port,
                           tcp_packet.destionation_port,
                           tcp_packet.SYN, tcp_packet.ACK,
                           tcp_packet.data_size, d,
                           tcp_packet.flags['ACK'], tcp_packet.flags['SYN'],
                           tcp_packet.flags['FIN'], tcp_packet.flags['RST'])
        packets.append(packet)
    return packets
