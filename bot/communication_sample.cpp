#include "communication.h"
#include <iostream>

using namespace std;

int main() {
    string name = "/tmp/test.sock";
    UnixSocketCommunication usc;
    usc.init(name);
    usc.makeNewConnection();
    while(1) {
        string message;
        usc.receive(&message);
        if (message == "exit") 
            break;
        usc.dispatch(message + "!");
        std::cout << message << endl;
    }
    cout << "Exit...." << endl;
    return 0;
}
