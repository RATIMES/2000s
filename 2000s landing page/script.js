// Initialize TV canvas
const canvas = document.getElementById('tv-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const tvScreen = canvas.parentElement;
    canvas.width = tvScreen.clientWidth;
    canvas.height = tvScreen.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation state
let currentAnimation = null;
let animationFrameId = null;

// Matrix Animation
class MatrixAnimation {
    constructor() {
        this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        this.fontSize = 14;
        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
        this.frameCount = 0;
    }

    draw() {
        this.frameCount++;
        if (this.frameCount % 4 !== 0) return; // Slow down the animation

        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
}

// DVD Logo Animation
class DVDAnimation {
    constructor() {
        this.logoWidth = 200;
        this.logoHeight = 100;
        this.x = Math.random() * (canvas.width - this.logoWidth);
        this.y = Math.random() * (canvas.height - this.logoHeight);
        this.dx = 1.5; // Reduced speed
        this.dy = 1.5; // Reduced speed
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Check for collisions
        if (this.x + this.logoWidth > canvas.width || this.x < 0) {
            this.dx = -this.dx;
            this.color = this.getRandomColor();
        }
        if (this.y + this.logoHeight > canvas.height || this.y < 0) {
            this.dy = -this.dy;
            this.color = this.getRandomColor();
        }

        // Draw DVD logo
        ctx.fillStyle = this.color;
        ctx.font = 'bold 48px Arial';
        ctx.fillText('DVD', this.x + 50, this.y + 60);
    }
}

// Plasma Animation
class PlasmaAnimation {
    constructor() {
        this.time = 0;
        this.imageData = ctx.createImageData(canvas.width, canvas.height);
    }

    draw() {
        this.time += 0.03;

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                const value = Math.sin(x * 0.01 + this.time) +
                            Math.sin(y * 0.01 + this.time) +
                            Math.sin((x + y) * 0.01 + this.time) +
                            Math.sin(Math.sqrt(x * x + y * y) * 0.01 + this.time);

                const index = (x + y * canvas.width) * 4;
                const color = Math.floor((Math.sin(value) + 1) * 128);

                this.imageData.data[index] = color;
                this.imageData.data[index + 1] = color * Math.sin(this.time);
                this.imageData.data[index + 2] = color * Math.cos(this.time);
                this.imageData.data[index + 3] = 255;
            }
        }

        ctx.putImageData(this.imageData, 0, 0);
    }
}

// Snake Game
class SnakeGame {
    constructor() {
        this.gridSize = 20;
        this.tileCount = Math.floor(Math.min(canvas.width, canvas.height) / this.gridSize);
        this.reset();
        this.setupControls();
    }

    reset() {
        this.snake = [{x: 5, y: 5}];
        this.velocity = {x: 1, y: 0}; // Start moving right
        this.food = this.getRandomFood();
        this.score = 0;
        this.gameOver = false;
        this.frameCount = 0;
        this.started = false; // Track if game has started
    }

    getRandomFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (currentAnimation instanceof SnakeGame) {
                // Prevent page scrolling with arrow keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.key)) {
                    e.preventDefault();
                }

                if (this.gameOver && e.key === 'r') {
                    this.reset();
                    return;
                }

                switch(e.key) {
                    case 'ArrowUp':
                        if (this.velocity.y !== 1) {
                            this.velocity = {x: 0, y: -1};
                            this.started = true;
                        }
                        break;
                    case 'ArrowDown':
                        if (this.velocity.y !== -1) {
                            this.velocity = {x: 0, y: 1};
                            this.started = true;
                        }
                        break;
                    case 'ArrowLeft':
                        if (this.velocity.x !== 1) {
                            this.velocity = {x: -1, y: 0};
                            this.started = true;
                        }
                        break;
                    case 'ArrowRight':
                        if (this.velocity.x !== -1) {
                            this.velocity = {x: 1, y: 0};
                            this.started = true;
                        }
                        break;
                }
            }
        });
    }

    draw() {
        this.frameCount++;
        if (this.frameCount % 20 !== 0) return; // Slow down the game speed (increased from 10 to 20)

        // Clear screen
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!this.started) {
            // Show start screen
            ctx.fillStyle = '#0f0';
            ctx.font = '32px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('Press any arrow key to start!', canvas.width/2, canvas.height/2);
            return;
        }

        if (this.gameOver) {
            ctx.fillStyle = '#f00';
            ctx.font = '48px Comic Sans MS';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
            ctx.font = '24px Comic Sans MS';
            ctx.fillText(`Score: ${this.score}`, canvas.width/2, canvas.height/2 + 40);
            ctx.fillText('Press R to restart', canvas.width/2, canvas.height/2 + 80);
            return;
        }

        // Move snake
        const head = {
            x: this.snake[0].x + this.velocity.x,
            y: this.snake[0].y + this.velocity.y
        };

        // Check collision with walls
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver = true;
            return;
        }

        // Check collision with self (only if snake length > 1)
        if (this.snake.length > 1) {
            for (let i = 1; i < this.snake.length; i++) {
                if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                    this.gameOver = true;
                    return;
                }
            }
        }

        // Add new head
        this.snake.unshift(head);

        // Check if food eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.getRandomFood();
        } else {
            this.snake.pop();
        }

        // Draw food
        ctx.fillStyle = '#f00';
        ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Draw snake
        ctx.fillStyle = '#0f0';
        this.snake.forEach((segment, index) => {
            ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Comic Sans MS';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
}

// Animation controller
function startAnimation(type) {
    // Stop current animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // Create new animation
    switch (type) {
        case 'matrix':
            currentAnimation = new MatrixAnimation();
            break;
        case 'dvd':
            currentAnimation = new DVDAnimation();
            break;
        case 'plasma':
            currentAnimation = new PlasmaAnimation();
            break;
        case 'snake':
            currentAnimation = new SnakeGame();
            break;
    }

    // Animation loop
    function animate() {
        currentAnimation.draw();
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// Add click handlers to menu items
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const animationType = e.target.getAttribute('data-animation');
        startAnimation(animationType);
    });
});

// Start with Matrix animation
startAnimation('matrix');

// Cursor trail effect
function createCursorTrail() {
    const colors = ['#ff00ff', '#00ff00', '#ffff00', '#00ffff'];
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '10px';
    trail.style.height = '10px';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.transition = 'all 0.5s';
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0.5)';
        setTimeout(() => trail.remove(), 500);
    }, 100);
    
    return trail;
}

document.addEventListener('mousemove', (e) => {
    const trail = createCursorTrail();
    trail.style.left = e.clientX - 5 + 'px';
    trail.style.top = e.clientY - 5 + 'px';
});

// Rainbow text effect for welcome message
const welcomeText = document.querySelector('.welcome-text');
let hue = 0;

setInterval(() => {
    hue = (hue + 1) % 360;
    welcomeText.style.color = `hsl(${hue}, 100%, 50%)`;
}, 50);

// Add click sound effect to buttons
const buttons = document.querySelectorAll('.cool-button');
const clickSound = new Audio('https://web.archive.org/web/20090829095442/http://geocities.com/click.wav');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {}); // Ignore audio errors
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = 'scale(1)', 100);
    });
});

// Update visitor counter randomly
const visitorCounter = document.querySelector('.visitor-counter');
setInterval(() => {
    const currentCount = parseInt(visitorCounter.textContent.replace(/[^0-9]/g, ''));
    const newCount = currentCount + Math.floor(Math.random() * 3);
    visitorCounter.textContent = `Visitors: ${String(newCount).padStart(6, '0')}`;
}, 10000);

// Add "You've got mail!" notification
setTimeout(() => {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#000000';
    notification.style.border = '2px solid #00ff00';
    notification.style.padding = '10px';
    notification.style.color = '#00ff00';
    notification.style.fontFamily = '"Comic Sans MS", cursive';
    notification.innerHTML = '📨 You\'ve got mail!';
    document.body.appendChild(notification);
    
    const sound = new Audio('https://web.archive.org/web/20090829095442/http://geocities.com/mail.wav');
    sound.play().catch(() => {}); // Ignore audio errors
}, 5000); 