#include "communication.h"

void UnixSocketCommunication::init(const std::string& socketName) {
    socketName_ = socketName; 
    listener_ = socket(PF_LOCAL, SOCK_STREAM, 0);
    if (listener_ < 0){
        throw std::runtime_error("Socket is not created.");
    }
    sockaddr_un socketAddress;
    socketAddress.sun_family = AF_LOCAL;
    strcpy(socketAddress.sun_path, socketName.c_str());  
    if (unlinkSocket_)
        unlink(socketName.c_str());
    //if(bind(listener_, dynamic_cast<sockaddr*>(&socketAddress), sizeof(socketAddress)) < 0)
    if(bind(listener_, (sockaddr*)(&socketAddress), sizeof(socketAddress)) < 0)
    {
        throw std::runtime_error("Socket could not be bind.");
    }
    listen(listener_, queueLength_);
}

