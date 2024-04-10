#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/wait.h>

#define PORT 8081

int main() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    ssize_t bytes_read;
    char command[2048] = {0};
    char answer[2048] = {0};
    
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }
    
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    
    if (listen(server_fd, 3) < 0) {
        perror("listen");
        exit(EXIT_FAILURE);
    }
    
    if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
        perror("accept");
        exit(EXIT_FAILURE);
    }
    
    while (1) {
        memset(command, 0, sizeof(command));
        bytes_read = read(new_socket, command, sizeof(command) - 1);
        
        if (bytes_read <= 0) {
            if (bytes_read == 0) {
                printf("Клиент закрыл соединение\n");
            } else {
                perror("Ошибка чтения из сокета");
            }
            break;
        }
        
        command[bytes_read] = '\0';
        strcat(command, " > output.txt 2>&1");
        printf("Command from client: %s\n", command);
        
        int status = system(command);

        if (status == -1) {
            perror("Ошибка выполнения команды system()");
            continue;
        }
        
        if (WIFEXITED(status)) {
            int exit_status = WEXITSTATUS(status);
            printf("Command finished with exit code: %d\n", exit_status);
        }
        
        FILE* file = fopen("output.txt", "r");
        if (file == NULL) {
            perror("Ошибка при открытии файла");
            continue;
        }
        
        fseek(file, 0, SEEK_END);
        long fileSize = ftell(file);
        rewind(file);
        
        char *content = malloc(fileSize + 1);
        if (content == NULL) {
            perror("Ошибка при выделении памяти");
            fclose(file);
            continue;
        }
        
        size_t bytesRead = fread(content, 1, fileSize, file);
        if (bytesRead < fileSize) {
            perror("Ошибка при чтении файла");
            free(content);
            fclose(file);
            continue;
        }
        content[bytesRead] = '\0';

        if (strlen(content) == 0) {
            strcpy(content, "No output\n");
        }
        
        fclose(file);
        
        if (send(new_socket, content, strlen(content), 0) == -1) {
            perror("Ошибка при отправке данных");
        } else {
            printf("Output of command sent.\n");
        }
        
        free(content);
    }
    
    close(new_socket);
    close(server_fd);
    
    return 0;
}
