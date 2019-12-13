// https://github.com/sarthakjain95/TheOneWeekProject
// Bouncy Balls in C

#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>

// #define BALL '_'
#define BALL 'O' 
#define EMPTY ' '

#define TRUE 1
#define FALSE 0

#define X 80
#define Y 30

char grid[ Y ][ X ];

struct ball{
	int y,x;
	int vy,vx;
	// char val;
	// char color;
};

#define NUM 12
struct ball balls[ NUM ];

#define DELAY 0.05

void displayGrid(){
	system("clear");
	for(int i=0;i<Y;i++){
		for(int j=0;j<X;j++) printf("%c", grid[i][j]);
		printf("\n");
	}
}

void clearGrid(){
	for(int i=0;i<Y;i++)
		for(int j=0;j<X;j++) 
			grid[i][j]=EMPTY;
}

int main(){
	
	system("resize -s 30 80");
	clearGrid();

	for(int n=0;n<NUM;n++){
		balls[n].x= rand()%80;
		balls[n].y= rand()%30;	
		balls[n].vx= rand()%2==0 ? -1:1;
		balls[n].vy= rand()%2==0 ? -1:1;
	}

	while(TRUE){

		clearGrid();
		
		for(int n=0;n<NUM;n++){
			balls[n].x+=balls[n].vx;
			balls[n].y+=balls[n].vy;
			
			if(balls[n].x > X){
				balls[n].x--;
				balls[n].vx*=-1;
			}
			
			if(balls[n].x < 0){
				balls[n].x++;
				balls[n].vx*=-1;
			}
			
			if(balls[n].y > Y){
				balls[n].y--;
				balls[n].vy*=-1;
			}
			
			if(balls[n].y < 0){
				balls[n].y++;
				balls[n].vy*=-1;
			}
			
			grid[ balls[n].y ][ balls[n].x ]= BALL;
		}
		
		displayGrid();

		usleep(DELAY*1000000);
	}

	return 0;
}

// TheOneWeekProject
// Sarthak Jain