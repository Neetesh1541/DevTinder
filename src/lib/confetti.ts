// Simple confetti effect
// Based on canvas-confetti npm package interface

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
  shapes?: string[];
}

// Default colors for confetti
const defaultColors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

export function confetti(options: ConfettiOptions = {}) {
  const {
    particleCount = 50,
    spread = 50,
    startVelocity = 30,
    decay = 0.9,
    gravity = 1,
    drift = 0,
    ticks = 200,
    origin = { x: 0.5, y: 0.5 },
    colors = defaultColors
  } = options;

  // Create a canvas element if it doesn't exist yet
  let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'confetti-canvas');
    canvas.setAttribute('style', 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 1000');
    document.body.appendChild(canvas);
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create particles
  const particles: any[] = [];
  
  const originX = origin.x !== undefined ? origin.x : 0.5;
  const originY = origin.y !== undefined ? origin.y : 0.5;
  
  for (let i = 0; i < particleCount; i++) {
    // Random properties for this particle
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const angle = Math.random() * Math.PI * 2;
    const velocity = startVelocity * (Math.random() * 0.4 + 0.8);
    
    particles.push({
      x: originX * canvas.width,
      y: originY * canvas.height,
      size,
      color,
      velocity: {
        x: Math.cos(angle) * velocity + (Math.random() - 0.5) * drift,
        y: Math.sin(angle) * velocity + (Math.random() - 0.5) * drift
      },
      rotation: Math.random() * 360,
      opacity: 1
    });
  }
  
  // Animate particles
  let tick = 0;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;
      
      // Apply gravity and decay
      particle.velocity.y += gravity;
      particle.velocity.x *= decay;
      particle.velocity.y *= decay;
      
      // Update opacity
      particle.opacity = 1 - (tick / ticks);
      
      // Draw particle
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation * Math.PI / 180);
      
      ctx.beginPath();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      
      // Draw a square or circle randomly
      if (Math.random() > 0.5) {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else {
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    });
    
    tick++;
    
    // Continue animation until all particles are off-screen or we reach max ticks
    if (tick < ticks) {
      requestAnimationFrame(animate);
    } else {
      // Remove canvas when animation is complete
      document.body.removeChild(canvas);
    }
  }
  
  // Start animation
  requestAnimationFrame(animate);
}