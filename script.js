let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1; 
let winOrLose = "jest w pyte";


let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curblock = [[1,0], [0,1], [1,1], [2,1]];


let blocks = [];

let blockColors = ['#7210b2','#4c1be1','#123456','#03105c','#e027e7','#534b79','#638cb5'];

let curblockColor;


let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));


let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));


let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


document.addEventListener('DOMContentLoaded', SetupCanvas); 


function CreateCoordArray(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
    
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2, 2);

    // canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // gameboard rectangle
    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(54, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";

    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText("wynik twuj", 300, 98);

    // score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // score
    ctx.fillText(score.toString(), 310, 127);
    
    // level label text
    ctx.fillText("poziom", 300, 157);

    // level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // evel
    ctx.fillText(level.toString(), 310, 190);

    // next label text
    ctx.fillText("stan gry", 300, 221);

    // playing condition
    ctx.fillText(winOrLose, 310, 261);

    // playing condition rectangle
    ctx.strokeRect(300, 232, 161, 95);
    
    // controls label text
    ctx.fillText("jak sb ruszać", 300, 354);

    // controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // controls text
    ctx.font = '19px Arial';
    ctx.fillText("A - lewo", 310, 388);
    ctx.fillText("D - prawo", 310, 413);
    ctx.fillText("S - szypciej", 310, 438);
    ctx.fillText("E - speen", 310, 463);

    
    document.addEventListener('keydown', HandleKeyPress);

    // create the array of block arrays
    Createblocks();
    // generate random block
    Createblock();


    CreateCoordArray();

    Drawblock();
}

function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 54, 54);
}

function Drawblock(){

    for(let i = 0; i < curblock.length; i++){

        let x = curblock[i][0] + startX;
        let y = curblock[i][1] + startY;

        gameBoardArray[x][y] = 1;
       
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        
        ctx.fillStyle = curblockColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}


function HandleKeyPress(key){
    if(winOrLose != "cusz"){
    // 65 == A
    if(key.keyCode === 65){
        
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            Deleteblock();
            startX--;
            Drawblock();
        } 

    // 68 == D
    } else if(key.keyCode === 68){
        
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            Deleteblock();
            startX++;
            Drawblock();
        }

    // 83 == S
    } else if(key.keyCode === 83){
        MoveblockDown();

    //  69 == E -> s rotation of block
    } else if(key.keyCode === 69){
        Rotateblock();
    }
    } 
}

function MoveblockDown(){
    direction = DIRECTION.DOWN;


    if(!CheckForVerticalCollison()){
        Deleteblock();
        startY++;
        Drawblock();
    }
}


window.setInterval(function(){
    if(winOrLose != "cusz"){
        MoveblockDown();
    }
  }, 1000);



function Deleteblock(){
    for(let i = 0; i < curblock.length; i++){
        let x = curblock[i][0] + startX;
        let y = curblock[i][1] + startY;

        gameBoardArray[x][y] = 0;

        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}


function Createblocks(){
    // T 
    blocks.push([[1,0], [0,1], [1,1], [2,1]]);
    // I
    blocks.push([[0,0], [1,0], [2,0], [3,0]]);
    // J
    blocks.push([[0,0], [0,1], [1,1], [2,1]]);
    // Square
    blocks.push([[0,0], [1,0], [0,1], [1,1]]);
    // L
    blocks.push([[2,0], [0,1], [1,1], [2,1]]);
    // S
    blocks.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z
    blocks.push([[0,0], [1,0], [1,1], [2,1]]);
}

function Createblock(){

    let randomblock = Math.floor(Math.random() * blocks.length);
    
    curblock = blocks[randomblock];

    curblockColor = blockColors[randomblock];
}


function HittingTheWall(){
    for(let i = 0; i < curblock.length; i++){
        let newX = curblock[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}


function CheckForVerticalCollison(){
    
    let blockCopy = curblock;
    
    let collision = false;


    for(let i = 0; i < blockCopy.length; i++){
        let square = blockCopy[i];

        let x = square[0] + startX;
        let y = square[1] + startY;

        if(direction === DIRECTION.DOWN){
            y++;
        }

        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            Deleteblock();

            startY++;
            Drawblock();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        if(startY <= 2){
            winOrLose = "cusz";
            ctx.fillStyle = 'black';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'white';
            ctx.fillText(winOrLose, 310, 261);
        } else {

            
            for(let i = 0; i < blockCopy.length; i++){
                let square = blockCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                
                stoppedShapeArray[x][y] = curblockColor;
            }

            
            CheckForCompletedRows();

            Createblock();

            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            Drawblock();
        }

    }
}


function CheckForHorizontalCollision(){
    var blockCopy = curblock;
    var collision = false;

    for(var i = 0; i < blockCopy.length; i++)
    {
        var square = blockCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }

        var stoppedShapeVal = stoppedShapeArray[x][y];

        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}


function CheckForCompletedRows(){

    let rowsToDelete = 0;
    let startOfDeletion = 0;

    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        for(let x = 0; x < gBArrayWidth; x++)
        {
            let square = stoppedShapeArray[x][y];

            if (square === 0 || (typeof square === 'undefined'))
            {
                completed=false;
                break;
            }
        }
        if (completed)
        {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

            for(let i = 0; i < gBArrayWidth; i++)
            {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;

                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'white';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;

                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function Rotateblock()
{
    let newRotation = new Array();
    let blockCopy = curblock;
    let curblockBU;

    for(let i = 0; i < blockCopy.length; i++)
    {       
        curblockBU = [...curblock];

        let x = blockCopy[i][0];
        let y = blockCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    Deleteblock();

    try{
        curblock = newRotation;
        Drawblock();
    }  
    catch (e){ 
        if(e instanceof TypeError) {
            curblock = curblockBU;
            Deleteblock();
            Drawblock();
        }
    }
}

function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < curblock.length; i++)
    {
        let square = curblock[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}