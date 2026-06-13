// floating-dots.js - JavaScript code to generate and animate floating dots on the background of the Mood Lane application. The script creates multiple dots with random sizes, colors, positions, and animation durations to create a dynamic and visually appealing background effect.
function generateFloatingDots() {
  const container = document.querySelector('.floating-dots-container');
  const colors = ['#FFD700', '#FF3333', '#4A90E2', '#9B59B6', '#2ECC71', '#95A5A6'];
  
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.className = 'floating-dot';
    
    // Random size between 10px and 30px
    const size = Math.random() * 20 + 10;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    // Random position
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    
    // Random color from emotion colors array
    dot.style.backgroundColor = colors[Math.floor(Math.random() * 6)];
    
    // Random animation duration between 2s and 5s
    dot.style.animationDuration = `${Math.random() * 3 + 2}s`;
    
    // Random animation delay between 0s and 2s
    dot.style.animationDelay = `${Math.random() * 2}s`;
    
    container.appendChild(dot);
  }
}

// Call the function when page loads
window.addEventListener('DOMContentLoaded', generateFloatingDots);
