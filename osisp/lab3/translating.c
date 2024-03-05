#include "translating.h"

char* text_to_morse(const char* text) {
    const char* morse_code[] = {
        ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", // A-I
        ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", // J-R
        "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", // S-Z
        "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", // 0-9
        ".-.-.-", "--..--", "..--..", "-.-.--", "-....-", ".----.", "-.--.", "-.--.-", ".-...", "---...", "-.-.-.", "-...-", ".-.-.", "-....-", "..--.-", ".-..-.", ".--.-.", "-.--.-", ".-.-..", // Special characters
    };

    const char* alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?'!/()&:;=+-_\"$@";
    //const char* alphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ0123456789.,?'!/()&:;=+-_\"$@";
    char* answer = (char*)malloc(512 * sizeof(char));
    int j = 0;
    for (int i = 0; i < strlen(text); i++) {
        char c = toupper(text[i]); 
        if (c == ' ') {
            answer[j] = ' ';
            j++;
        } else {
            for (int k = 0; k < strlen(alphabet); k++) {
                if (c == alphabet[k]) {
                    strcpy(answer + j, morse_code[k]);
                    j += strlen(morse_code[k]);
                    break;
                }
            }
        }
    }
    answer[j] = '\0';
    return answer;
}
