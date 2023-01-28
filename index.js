const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;

const leftCounter = document.querySelector('#leftCounter');
const rightCounter = document.querySelector('#rightCounter');

leftCounter.textContent = 0;
rightCounter.textContent = 0;

let ballSpeed = 5;
let paddleSpeed = 6;

const leftPaddle = {
    x: grid*2,
    y: canvas.height/2 - paddleHeight/2,
    width: grid,
    height: paddleHeight,
    dy: 0,
}

const rightPaddle = {
    x: canvas.width - grid*3,
    y: canvas.height/2 - paddleHeight/2,
    width: grid,
    height: paddleHeight,
    dy: 0,
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    width: grid,
    height: grid,
    resetting: false, 
    dx: ballSpeed,
    dy: -ballSpeed,
    isResetted: false
}

function collidesWallsByPaddles(paddle){ //doesn't let the ball leave the boundaries of the wall
    if (paddle.y < grid){
        paddle.y = grid;
    }
    else if (paddle.y > maxPaddleY){
        paddle.y = maxPaddleY;
    }
}

function collideVerticalWalls() {
    if (ball.y < grid){
        ball.y = grid;
        ball.dy = -ball.dy;
    }
    else if (ball.y > canvas.height - grid){
        ball.y = canvas.height - grid;
        ball.dy = -ball.dy;
    }
}

function collidesPaddles() {
    if (isCollides(ball, rightPaddle)){
        ball.dx = -ball.dx;
        ball.x = rightPaddle.x - ball.width;
        let number = Number(rightCounter.textContent) + 1;
        rightCounter.textContent = number;
    }
    else if (isCollides(ball, leftPaddle)){
        ball.dx = -ball.dx;
        ball.x = leftPaddle.x + leftPaddle.width;
        let number = Number(leftCounter.textContent) + 1;
        leftCounter.textContent = number;
    }
}

function isCollides(object1, object2){
    return object1.x < object2.x + object2.width 
    && object1.x + object1.width > object2.x
    && object1.y < object2.y + object2.height 
    && object1.y + object1.height > object2.y;
}

function resetGame(){
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.isResetted){
        if (ball.x < 0) {
            leftCounter.textContent = 0;
        } else if (ball.x > canvas.width) {
            rightCounter.textContent = 0;
        }
        ball.isResetted = true;
        setTimeout(function(){
            ball.x = canvas.width/2,
            ball.y = canvas.height/2,
            ball.isResetted = false
        }, 3000);
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
}

function loop(){
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    movePaddles();

    collidesWallsByPaddles(leftPaddle);
    collidesWallsByPaddles(rightPaddle);
    
    context.fillStyle = 'rgb(228, 164, 87)'; 
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);  //Left Paddle
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height); //Right Paddle

    moveBall();

    resetGame();

    collideVerticalWalls();

    collidesPaddles();

    context.fillRect(ball.x, ball.y, ball.width, ball.height); //Ball
    
    context.fillRect(0,0, canvas.width, grid); // Wall Top
    context.fillRect(0, canvas.height - grid, canvas.width, grid) // Wall Bottom
    
    for (let i = grid; i < canvas.height - grid; i += grid * 2){
      context.fillRect(canvas.width/2, i, grid, grid); //Net Line
    }
}


document.addEventListener('keydown', function (event){
    console.log(event.key);
  if (event.key === 'w' || event.key === 'ц'){
      leftPaddle.dy = -paddleSpeed;
  }
  else if (event.key === 's' || event.key === 'ы'){
      leftPaddle.dy = paddleSpeed;
  }
});
document.addEventListener('keyup', function (event) {
  if (event.key === 'w' || event.key === 's'){
      leftPaddle.dy = 0;
  }
})

document.addEventListener('keydown', function (event){
  if (event.key === 'ArrowUp'){
      rightPaddle.dy = -paddleSpeed;
  }
  else if (event.key === 'ArrowDown'){
  rightPaddle.dy = paddleSpeed;
  }
});
document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown'){
      rightPaddle.dy = 0;
  }
})

requestAnimationFrame(loop);
