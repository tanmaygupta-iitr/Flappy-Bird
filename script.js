//board
let boardWidth=360;
let boardHeight=640;
let context;
//bird
let birdWidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;
let birdImg;
const bird={
    x:birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}
//pipes
let pipeArray=[];
pipeWidth=64;
pipeHeight=512;
pipeX=board.width;
pipeY=0;

let topPipeImg;
let bottomPipeImg;  

//physics:
let velocityX=-2;//pipe movement
let velocityY=0;//bird jump
let gravity=0.33;


let gameOver=false;
let score=0;

window.onload=function(){//this function will run whenever we have loaded our window of this application.
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");//this is used to able to draw on the canvas

    //load img
    birdImg=new Image();
    birdImg.src="images/flappybird.png";
    birdImg.onload=function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);  
    }


    topPipeImg=new Image();
    topPipeImg.src="images/toppipe.png";
    
    bottomPipeImg=new Image();
    bottomPipeImg.src="images/bottompipe.png";
    requestAnimationFrame(update);

    setInterval(placePipes,1550);

    document.addEventListener("keydown",moveBird);
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    // draw img:
    velocityY+=gravity;
    bird.y=Math.max(bird.y+velocityY,0);   
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);  
    if(bird.y>board.height || bird.y==0){
        gameOver=true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;//0.5 coz ther are 2 pipes!, 0.5 for 1 and 1 for 2 pipes.
            pipe.passed=true;
        }
        if(detectCollision(bird,pipe)){
            gameOver=true;
        }
    }
    //clear pipes
    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }
    //score:
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);
    if(gameOver){
        context.fillText("GAME OVER",pipeWidth/2,pipeHeight/2);
    }
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randompipeY=pipeY-pipeHeight/4-Math.random()*pipeHeight/2;
    let openingspace=board.height/4;



    let topPipe={
        img:topPipeImg,
        x:pipeX,
        y:randompipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(topPipe);
    let bottompipe={
        img:bottomPipeImg,
        x:pipeX,
        y:randompipeY+pipeHeight+openingspace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(bottompipe);
}
function moveBird(e){
    if(e.code=="Enter"){
        bird.y=birdY;
            pipeArray=[];
            score=0;
            gameOver=false;  
    }
    if(e.code=="Space"||e.code=="ArrowUp"||e.code=="KeyX"){
        //it jumps
        velocityY=-6;

        if(gameOver){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameOver=false;  
        }
    }
}
function detectCollision(a,b){
    return  a.x<b.x+b.width &&//compares if the bird rectangles width is in touch with the width of the pipe
            a.x+a.width>b.x &&
            a.y<b.y+b.height &&
            a.y+a.height>b.y;//compares the height
}
