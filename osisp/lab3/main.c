#include <stdio.h>
#include <locale.h>
#include "translating.h"

int main() {
    char message[512];
    printf("Enter the message:\n"); 
    fgets(message, sizeof(message), stdin);

    char* morse_text = text_to_morse(message);
    printf("Translated message: %s\n", morse_text);
    
    free(morse_text);
    return 0;
}
