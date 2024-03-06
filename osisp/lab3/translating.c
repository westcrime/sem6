#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

const char *morseCode[] = {".-", "-...", "-.-.", "-..", ".", "..-.",
    "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-",
    ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."}; // Morse code from A to Z

void convertToMorseCode();

/* Conversion of english text to morse code */
void convertToMorseCode()
{   
    printf("\t\t\t\tEnglish Text to Morse Code\n\n");
    printf("Please enter English text:\n");
    char text[1000]; // for input text
    scanf(" %[^\n]s", text);
    int textLength = strlen(text);

    char morseCodeValue[10000] = "";
   
    int index;
    for (index = 0; index < textLength; ++index)
    {
        if (isalpha(text[index]))
        {
            text[index] = toupper(text[index]);
            strcat(morseCodeValue, morseCode[text[index]-'A']);
            strcat(morseCodeValue, " ");
        }
        else if (isspace(text[index]))
        {
            strcat(morseCodeValue, "  ");
        }
        else
        {
            printf("Unsupported character: %c\n", text[index]);
            return;
        }
    } 
    printf("\nMorse Code is \"%s\"\n", morseCodeValue);
}
