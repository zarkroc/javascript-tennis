var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var ballRadius = 10;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;

var showWinScreen = false;

var player1Score = 0;
var player2Score = 0;

function calculateMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function computerMovement() {
    var paddle2yCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2yCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2Y > ballY + 35) {
        paddle2Y -= 6;
    }
}

function handleMouseClick(evt) {
    if (showWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calculateMousePosition(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });
    canvas.addEventListener('mousedown', handleMouseClick);
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    deltaY = 0;
}

function moveEverything() {
    if (showWinScreen) {
        return;
    }
    computerMovement();
    if (ballX + ballRadius > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;
            ballReset();
        }

    } else if (ballX - ballRadius < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++;
            ballReset();
        }
    }

    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
    canvasContext.fill();
}

function drawEverything() {
    // Make all black
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    if (showWinScreen) {
        canvasContext.fillStyle = 'white';
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won!", 350, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350, 200);
        }
        canvasContext.fillText("Click to continue", 350, 500)
        return;    
    }

    //left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //right player paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //draw the ball
    colorCircle(ballX, ballY, ballRadius, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}