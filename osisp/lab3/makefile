CC = gcc
CFLAGS = -I.

objects = main.o translating.o

program: $(objects)
	$(CC) -o program $(objects)

main.o: main.c translating.h
	$(CC) $(CFLAGS) -c main.c

translating.o: translating.c translating.h
	$(CC) $(CFLAGS) -c translating.c

clean:
	rm -f program $(objects)

test: program
	program < test_input.txt