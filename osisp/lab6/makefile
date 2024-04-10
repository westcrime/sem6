CC = gcc
CFLAGS = -I.

objects = server.o client.o

server: $(objects)
	$(CC) -o server server.o

client: $(objects)
	$(CC) -o client client.o

server.o: server.c
	$(CC) $(CFLAGS) -c server.c

client.o: client.c
	$(CC) $(CFLAGS) -c client.c

clean:
	rm -f program $(objects)
