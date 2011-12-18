
all: client server sample

simple_server.o: simple_server.cpp

simple_client.o: simple_client.cpp
communication.o: communication.cpp communication.h

communication_sample.o: communication_sample.cpp communication.h communication.cpp 
sample: communication_sample.o communication.o
	$(CXX) -o sample communication_sample.o communication.o

server: simple_server.o
	$(CXX) -o server simple_server.o
client: simple_client.o
	$(CXX) -o client simple_client.o

clean:
	rm *.o server client sample
