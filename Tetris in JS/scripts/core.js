
const canvas= document.getElementById("canvas");
const ctx= canvas.getContext('2d');

const BLOCKS=[
	[
		[0,0,0],
		[1,1,1],
		[0,1,0]
	],
	[
		[0,2,0,0],
		[0,2,0,0],
		[0,2,0,0],
		[0,2,0,0],
	],	
	[
		[0,0,0],
		[0,3,3],
		[3,3,0]
	],
	[
		[0,0,0],
		[4,4,0],
		[0,4,4]
	],
	[
		[5,0,0],
		[5,0,0],
		[5,5,0]
	],
	[
		[0,6,0],
		[0,6,0],
		[6,6,0]
	],
	[
		[7,7],
		[7,7]
	]
];

const BLOCK_COLORS=[
	null,
	"#4b0081",
	"#e0115f",
	"#0098db",
	"#ee1c25",
	"#5bb531",
	"#019340",
	"#ee9b0f"
];

const BOX_SIZE= canvas.width / 20;
const BLOCKS_MAP= "tiszljo";
const chooseRandomBlock= _=> [ BLOCKS_MAP.length*Math.random() | 0 ][0];

let dropInterval= 1000;

let arena= [];
for(let y=0; y<20; y++) arena.push( new Array(20).fill(0) );

let player={
	score:0,
	block:null,
	color:null,
	pos:{
		x:0,
		y:0
	},
	game_over:false
};
const chosenBlock= chooseRandomBlock();
player.block= BLOCKS[chosenBlock];
player.color= BLOCK_COLORS[ chosenBlock + 1 ];
changeThemeColor(player.color);


const updateScore= _=>document.getElementById("score").innerHTML=player.score;

function gameOver(){

	document.getElementById("score").style.display= "none";
	document.getElementById("game-over").style.display= "block";

	player.game_over= true;
}

function collides(m1, m2){
	
	const b= m1.block;
	const o= m1.pos;
	
	for(let y=0; y<b.length; y++){
		for(let x=0; x<b[0].length; x++){
			if( b[y][x]!==0 && (m2[y+o.y] && m2[y+o.y][x+o.x]) !== 0 ){
				return true;
			}
		}
	}
	
	return false;
}

function clearFilledRows(){
	
	outer:for(let y=arena.length-1; y>0; y--){
	
		for(let x=0; x<arena[0].length;x++){
			if( arena[y][x]===0 ){
				continue outer;
			}
		}
	
		const new_row= new Array(arena.length).fill(0);
		arena.splice(y,1);
		arena.unshift(new_row);
		player.score += (arena.length - y) * 100;
		y++;
	
	}
}

function drawArena(matrix, offset){

	ctx.clearRect(0,0, canvas.width, canvas.height);

	for(let y=0; y<arena.length; y++){
		for(let x=0; x<arena[0].length; x++){
			if(arena[y][x]!=0){
				ctx.fillStyle=  BLOCK_COLORS[ arena[y][x] ];
				ctx.fillRect( x*BOX_SIZE, y*BOX_SIZE, BOX_SIZE, BOX_SIZE);
			}
		}
	}

	for(let y=0;y<matrix.length; y++){
		for(let x=0; x<matrix[0].length; x++){
			if(matrix[y][x]!=0){
				ctx.fillStyle= BLOCK_COLORS[ matrix[y][x] ];
				ctx.fillRect( (x+offset.x)*BOX_SIZE, (y+offset.y)*BOX_SIZE, BOX_SIZE, BOX_SIZE);
			}
		}
	}

}

function addToArena(){

	const block= player.block;
	for(let y=0; y<block.length; y++){
		for(let x=0; x<block[0].length; x++){
			if(block[y][x]!==0){
				arena[ y + player.pos.y ][ x + player.pos.x ]= block[y][x];
			}
		}
	}

	const chosenBlock= chooseRandomBlock();
	player.block= BLOCKS[chosenBlock];
	player.color= BLOCK_COLORS[chosenBlock + 1];
	player.pos= {x:0, y:0};
	if(collides(player, arena)){
		gameOver();
	}
	changeThemeColor( player.color );
	player.score+=10;
	updateScore();
}

function dropDown(){
	
	if(player.game_over) return;
	player.pos.y++;

	if(collides(player, arena)){
		player.pos.y--;
		dropCounter= 0;
		addToArena(player);
		clearFilledRows();
	}

	dropCounter=0;
}

function rotateMatrix(dir, matrix){

	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				matrix[x][y],
				matrix[y][x],
			] = [
				matrix[y][x],
				matrix[x][y],
		    	];
		}
	}
	
	if (dir > 0) {
		matrix.forEach(row => row.reverse());
	} else {
		matrix.reverse();
	}
	return matrix;
}

function rotateBlock(dir){
	player.block= rotateMatrix(dir, player.block);
	if(collides(player, arena)){
		player.block= rotateMatrix(-dir, player.block);
	}
}

function moveBy(n){
	player.pos.x+=n;
	if(collides(player, arena)){
		player.pos.x-=n;
	}
}

document.addEventListener('keydown', e=>{
	if(e.keyCode==37){
		moveBy(-1);
	}else if(e.keyCode==39){
		moveBy(1);
	}else if(e.keyCode==40){
		dropDown();
	}else if(e.keyCode==81){
		rotateBlock(-1);
	}else if(e.keyCode==87){
		rotateBlock(1);	
	}
});

let lastTime=0, dropCounter= 0;
function update(time= 0){
	
	dropCounter+= time-lastTime;
	lastTime= time;
	if( dropCounter > dropInterval ){
		dropDown();
	}
	
	drawArena(player.block, player.pos);
	if(player.game_over){ return; }
	else{ requestAnimationFrame(update); }
}

update();

