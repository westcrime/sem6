#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#define NUMBER_OF_ITERATIONS 20

void handler(int sig) {
    if (sig == SIGTERM) {
        pid_t child_pid = fork();
        if (child_pid == -1) return;
        if (child_pid > 0) {
            exit(EXIT_SUCCESS); //Завершаем программу в основном процессе
        }
    }
}

int main() {
    int number;
    FILE *file;

    file = fopen("buffer.txt", "r");
    if (file == NULL) {
        printf("Error while opening file.\n");
        return 1;
    }

    if (!(fscanf(file, "%d", &number) == 1)) {
        printf("Can't read number from file.\n");
    }

    fclose(file);

    signal(SIGTERM, handler);
    
    for (int i = number; i < NUMBER_OF_ITERATIONS + 1; i++) {
        file = fopen("buffer.txt", "w");
        if (file == NULL) {
            printf("Error while opening file.\n");
            return 1;
        }
        if (i == NUMBER_OF_ITERATIONS) {
            fprintf(file, "%d", 0);
            fclose(file);
            continue;
        }
        fprintf(file, "%d", i);
        fclose(file);
        printf("Process %d: %d\n", getpid(), i);
        sleep(1);
    }

    return 0;
}
