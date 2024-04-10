#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 8081

void print_separator() {
    printf("---------------------------------------------------------------------\n");
}

int main() {
    int sock = 0;
    struct sockaddr_in serv_addr;
    char command[2048] = {0};
    char buffer[2048] = {0};
    
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        printf("\n Socket creation error \n");
        return -1;
    }
    
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
        printf("\nInvalid address/ Address not supported \n");
        return -1;
    }
    
    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        printf("\nConnection Failed \n");
        return -1;
    }
    
    while (1) {
        printf("Enter command for remote system (type 'exit' to quit):\n");
        fgets(command, sizeof(command), stdin);
        command[strcspn(command, "\n")] = 0;

        if (strcmp(command, "exit") == 0) {
            break;
        }
        
        if (send(sock, command, strlen(command), 0) < 0) {
            perror("send");
            break;
        }
        printf("Command sent\n");
        
        ssize_t bytes_received = read(sock, buffer, sizeof(buffer) - 1);
        if (bytes_received <= 0) {
            if (bytes_received == 0) {
                printf("Server closed the connection\n");
            } else {
                perror("read");
            }
            break;
        }
        buffer[bytes_received] = '\0';
        
        printf("Output of command from server:\n");
        print_separator();
        printf("%s\n", buffer);
        print_separator();
    }
    
    close(sock);
    return 0;
}
