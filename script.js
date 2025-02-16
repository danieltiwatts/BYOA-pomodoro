let isWorkMode = true;
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const REST_TIME = 5 * 60;  // 5 minutes in seconds
let timeLeft = WORK_TIME;
let timerId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeToggleButton = document.getElementById('mode-toggle');

// Bouncing image setup
const bouncingImage = document.getElementById('bouncing-image');
bouncingImage.style.backgroundImage = 'url("https://images.pixieset.com/46428681/8b28e17f4d6f0b9cfe487e8baf7b18f8-xlarge.jpg")';

let x = 0;
let y = 0;
let xSpeed = 5;
let ySpeed = 5;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display elements
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the document title with the timer and current mode
    document.title = `(${timeString}) ${isWorkMode ? 'Work' : 'Rest'} - Pomodoro Timer`;
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                const beep = document.getElementById('beep');
                beep.currentTime = 0;
                beep.play().catch(e => console.error('Audio play failed:', e));
                
                clearInterval(timerId);
                timerId = null;
                alert('Pomodoro session completed!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function toggleMode() {
    isWorkMode = !isWorkMode;
    modeToggleButton.textContent = `Mode: ${isWorkMode ? 'Work' : 'Rest'}`;
    
    // Update button class for styling
    modeToggleButton.classList.remove(isWorkMode ? 'rest-mode' : 'work-mode');
    modeToggleButton.classList.add(isWorkMode ? 'work-mode' : 'rest-mode');
    
    // Reset timer when switching modes
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? WORK_TIME : REST_TIME;
    updateDisplay();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? WORK_TIME : REST_TIME;
    updateDisplay();
}

function moveImage() {
    const container = document.querySelector('.container');
    const padding = 40;
    const maxX = container.clientWidth - bouncingImage.offsetWidth - (padding * 2);
    const maxY = container.clientHeight - bouncingImage.offsetHeight - (padding * 2);

    // Update position
    x += xSpeed;
    y += ySpeed;

    // Bounce off walls with slight random angle changes
    if (x >= maxX || x <= 0) {
        xSpeed = -xSpeed;
        ySpeed += (Math.random() - 0.5) * 2;
        ySpeed = Math.max(Math.min(ySpeed, 8), -8);
    }

    if (y >= maxY || y <= 0) {
        ySpeed = -ySpeed;
        xSpeed += (Math.random() - 0.5) * 2;
        xSpeed = Math.max(Math.min(xSpeed, 8), -8);
    }

    // Ensure position stays within bounds
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    // Update CSS custom properties for the animation
    bouncingImage.style.setProperty('--x', `${x + padding}px`);
    bouncingImage.style.setProperty('--y', `${y + padding}px`);
    
    requestAnimationFrame(moveImage);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode);

// Initialize display
updateDisplay();

// Set initial button class
modeToggleButton.classList.add('work-mode');

// Start the animation
moveImage(); 