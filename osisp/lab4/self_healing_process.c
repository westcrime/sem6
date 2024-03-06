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
    signal(SIGTERM, handler);
    for (int i = 0; i < NUMBER_OF_ITERATIONS; i++) {
        printf("Process %d: %d\n", getpid(), i);
        sleep(1);
    }

    return 0;
}
