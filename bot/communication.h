#ifndef COMMUNICATION_H
#define COMMUNICATION_H

#include <sys/types.h>
#include <sys/socket.h>
#include <cstdio>
#include <unistd.h>
#include <sys/un.h>
#include <string.h>
#include <iostream>
#include <stdexcept>

class Communication {
public:
    virtual void init(const std::string& initString) {
        std::cerr << "There is som initialization.\n";
    }
    virtual bool dispatch(const std::string& str) {
        std::cerr << "String \"" << str << "\" will be dispatch.\n";
    }
    virtual bool receive(std::string* str) {
        std::cerr << "receive som string.";
    }
};
const int MAX_BUF_SIZE = 1 << 15;

class UnixSocketCommunication : public Communication {
public: 
    UnixSocketCommunication(bool unlinkSocket = false, size_t queueLength = 1):
        unlinkSocket_(unlinkSocket),
        queueLength_(queueLength),
        listener_(0),
        currentConnection_(0)
    {
    }
    void init(const std::string& socketName);
    void makeNewConnection() {
        currentConnection_ = accept(listener_, NULL, NULL);
    }
    bool receive(std::string* str) {
        int bytes_read = recv(currentConnection_, buf_, MAX_BUF_SIZE, 0);
        *str = std::string(buf_);
        return bytes_read > 0;
    }
    bool dispatch(const std::string& str) {
        send(currentConnection_, str.c_str(), str.size(), 0);
        return true;
    }
private:
    std::string socketName_;
    size_t queueLength_;
    bool unlinkSocket_;
    int listener_;
    char buf_[MAX_BUF_SIZE];
    int currentConnection_;
};
#endif //COMMUNICATION_H
