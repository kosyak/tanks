#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/un.h>
#include <stdio.h>
#include <unistd.h>
#include <cstring>

char message[] = "Hello there!\n";
char buf[sizeof(message)];
char* name  = "/tmp/test.sock";

int main()
{
    int sock;
    //struct sockaddr_in addr;
    struct sockaddr_un addr;

    //sock = socket(AF_INET, SOCK_STREAM, 0);
    sock = socket(PF_LOCAL, SOCK_STREAM, 0);
    if(sock < 0)
    {
	printf("No sock\n");
	return 1;
    }

    /*addr.sin_family = AF_INET;
    addr.sin_port = htons(3425); // или любой другой порт...
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);*/
	addr.sun_family = AF_LOCAL;
	strcpy(addr.sun_path, name);

    if(connect(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0)
    {
	return 2;
    }
	
	while(1) {
		scanf("%s", message);
	    send(sock, message, sizeof(message), 0);
	    recv(sock, buf, sizeof(message), 0);
    	printf("%s", buf);
	}
    close(sock);

    return 0;
}
