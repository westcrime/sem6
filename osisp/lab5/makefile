CC = gcc
CFLAGS = -I.

objects = program.o

program: $(objects)
	$(CC) -o program $(objects)

self_healing_process.o: program.c
	$(CC) $(CFLAGS) -c program.c

clean:
	rm -f program $(objects)
