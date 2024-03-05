CC = gcc
CFLAGS = -I.

objects = self_healing_process.o

program: $(objects)
	$(CC) -o program $(objects)

self_healing_process.o: self_healing_process.c
	$(CC) $(CFLAGS) -c self_healing_process.c

clean:
	rm -f program $(objects)

test: program
	./program < test_input.txt
