#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#define NUMBER_OF_ITERATIONS 10

void handler(int sig) {
    if (sig == SIGTERM) {
        FILE *file;
        file = fopen("buffer.txt", "r");
        if (file == NULL) {
            printf("Ошибка открытия файла.\n");
            return;
        }
        char number[9];
        // Считываем число из файла
        if (fscanf(file, "%9s", number) != 1) { // Читаем не более 9 символов, чтобы избежать переполнения буфера
            printf("Ошибка чтения числа из файла.\n");
            fclose(file);
            return;
        }
        number[9] = '\0'; // Устанавливаем конец строки

        pid_t child_pid = fork();
        if (child_pid == -1) return;
        if (child_pid == 0) {
            //signal(SIGTERM, handler);
            // Код копии процесса
            printf("Child process created.\n");
            int i = atoi(number);

            for (; i < NUMBER_OF_ITERATIONS; i++) {
                // Write some text to the file
                fprintf(file, "%d\n", i);
                printf("Child process %d: %d\n", getpid(), i);
                sleep(1);
            }
            exit(EXIT_SUCCESS);
        } else {
            fclose(file);
            exit(EXIT_SUCCESS); // Копия завершает выполнение
        }
    }
}

int main() {
    signal(SIGTERM, handler);
    for (int i = 0; i < NUMBER_OF_ITERATIONS; i++) {

        //Открытие буферного файла, запись в него числа, и вывод его в консоль
        FILE *fptr;
        fptr = fopen("buffer.txt", "w");
        fprintf(fptr, "%d\n", i);
        printf("Parent process %d: %d\n", getpid(), i);
        fclose(fptr);
        sleep(1);
    }

    return 0;
}
