const canvas = document.getElementById('game');
const context = canvas.getContext('2d'); // делаем контекст двумерным (?)
const grid = 15; // Размер игровой клетки
const paddleHeight = grid * 5; // Высота платформы
const maxPaddleY = canvas.height - grid - paddleHeight; // Максимальное расстояние, на которое может подняться платформа
let paddleSpeed = 6; // скорость платформы
let ballSpeed = 5; // скорость мяча
const delayToPlayWithBall = 2000;


// Платформа левая
const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid, // Ширина — одна клетка
    height: paddleHeight, // Высоту берём из константы
    dy: 0 // Платформа на старте никуда не движется
}

// Платформа правая
const rightPaddle = {
    x: canvas.width - grid * 3, // Ставим по центру с правой стороны
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
}

// Мяч 
const ball = {
    // Появляется в самом центре поля
    x: canvas.width / 2,
    y: canvas.height / 2,
    // Размер с клетку
    width: grid,
    height: grid,
    // На старте мяч не забит, значит убираем признак того, что мяч нужно ввести
    resetting: false,
    // Подаем мяч в правый верхний угол
    dx: ballSpeed,
    dy: -ballSpeed
}

// Проверяет, столкнулись ли 2 объекта
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// Главный цикл игры
function loop() {
    // очищаем игровое поле
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Все остальное
    // Если платформы на предыдущем шаге куда-то двигались — пусть продолжают двигаться
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Если левая платформа пытается вылезти за игровое поле вниз,
    if (leftPaddle.y < grid) {
        // то оставляем её на месте
        leftPaddle.y = grid;
    }
    // Проверяем то же самое сверху
    else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
    }

    // Рисуем платформы цветом
    context.fillStyle = 'rgb(228, 164, 87)';
    // Каждая платформа — прямоугольник
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    // Если мяч на предыдущем шаге куда-то двигался — пусть продолжает двигаться
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Если мяч касается стены снизу — меняем направление по оси У на противоположное
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    }
    // Делаем то же самое, если мяч касается стены сверху
    else if (ball.y + grid > canvas.height - grid) {
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    // Если мяч улетел за игровое поле влево или вправо — перезапускаем его
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
        // Помечаем, что мяч перезапущен, чтобы не зациклиться
        ball.resetting = true;
        // Даём секунду на подготовку игрокам
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }, delayToPlayWithBall);
    }

    // Если мяч коснулся левой платформы,
    if (collides(ball, leftPaddle)) {
        // то отправляем его в обратном направлении
        ball.dx *= -1;
        // Увеличиваем координаты мяча на ширину платформы, чтобы не засчитался новый отскок
        ball.x = leftPaddle.x + leftPaddle.width;
    }
    // Проверяем и делаем то же самое для правой платформы
    else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }

    // Рисуем мяч
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Рисуем стены
    context.fillStyle = 'rgb(228, 164, 87)';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    // Рисуем сетку посередине
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }

    // Отслеживаем нажатия клавиш
    document.addEventListener('keydown', function (e) {
        // Если нажата клавиша вверх,
        if (e.key === 'ArrowUp') {
            // то двигаем правую платформу вверх
            rightPaddle.dy = -paddleSpeed;
        }
        // Если нажата клавиша вниз,
        else if (e.key === 'ArrowDown') {
            // то двигаем правую платформу вниз
            rightPaddle.dy = paddleSpeed;
        }
        // Если нажата клавиша W, 
        if (e.key === 'w') {
            // то двигаем левую платформу вверх
            leftPaddle.dy = -paddleSpeed;
        }
        // Если нажата клавиша S,
        else if (e.key === 's') {
            // то двигаем левую платформу вниз
            leftPaddle.dy = paddleSpeed;
        }
    });
    // А теперь следим за тем, когда кто-то отпустит клавишу, чтобы остановить движение платформы
    document.addEventListener('keyup', function (e) {
        // Если это стрелка вверх или вниз,
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            // останавливаем правую платформу
            rightPaddle.dy = 0;
        }
        // А если это W или S, 
        if (e.key === 'w' || e.key === 's') {
            // останавливаем левую платформу
            leftPaddle.dy = 0;
        }
    });
}




requestAnimationFrame(loop);