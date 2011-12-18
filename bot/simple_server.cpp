#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <cstdio>
#include <unistd.h>
#include <sys/un.h>
#include <string.h>

using namespace std;

char name[] = "/tmp/test.sock";

int main()
{
    int sock, listener;
    //struct sockaddr_in addr;
	struct sockaddr_un addr;
    char buf[1024];
    int bytes_read;

    //listener = socket(AF_INET, SOCK_STREAM, 0);
    listener = socket(PF_LOCAL, SOCK_STREAM, 0);
    if(listener < 0)
    {
        //perror("socket");
		printf("socket");
        //exit(1);
		return 1;
    }
    
    /*addr.sin_family = AF_INET;
    addr.sin_port = htons(3425);
    addr.sin_addr.s_addr = htonl(INADDR_ANY);*/
	unlink (name);;
	addr.sun_family = AF_LOCAL;
	strcpy(addr.sun_path, name);

    if(bind(listener, (struct sockaddr *)&addr, sizeof(addr)) < 0)
    {
        //perror("bind");
		printf("bind");
	    // exit(2);
	    return 2;
    }

    listen(listener, 1);
    
    while(1)
    {
        sock = accept(listener, NULL, NULL);
        if(sock < 0)
        {
            //perror("accept");
           // exit(3);
		   printf("accept");
		   return 3;
        }

        while(1)
        {
            bytes_read = recv(sock, buf, 1024, 0);
            if(bytes_read <= 0) break;
			printf("#");
			printf("%s", buf);
            send(sock, buf, bytes_read, 0);
			printf("#");
			printf("%s", buf);
			fflush(stdout);
			if (buf[0] == 'E') {
				break;
			}
        }
    
        close(sock);
		break;
    }
    
    return 0;
}
