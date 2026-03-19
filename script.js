// ── GSAP CONFIG ──
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// ── PAGE LOADER ──
const hideLoader = () => {
  if (document.getElementById('loader').style.visibility === 'hidden') return;
  const tl = gsap.timeline();
  tl.to('.loader-progress', { width: '100%', duration: 0.5, ease: 'power2.inOut' })
    .to('#loader', { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
    .set('#loader', { visibility: 'hidden' })
    .from('.hero-content > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.3')
    .add(() => ScrollTrigger.refresh());
};

window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 3000); // Fallback

// ── THEME TOGGLE ──
function toggleTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const isLight = root.getAttribute('data-theme') === 'light';
  
  if (isLight) {
    root.removeAttribute('data-theme');
    btn.textContent = '🌙';
  } else {
    root.setAttribute('data-theme', 'light');
    btn.textContent = '☀️';
  }
  
  // Animation for transition
  gsap.fromTo('body', { opacity: 0.8 }, { opacity: 1, duration: 0.5 });
}

// ── CURSOR GLOW ──
const cursorGlow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', (e) => {
  gsap.to(cursorGlow, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.5,
    ease: 'power2.out'
  });
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── SCROLLTRIGGER NAV LINKS ──
const sections = document.querySelectorAll('section[id]');
sections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 150px',
    end: 'bottom 150px',
    onToggle: (self) => {
      if (self.isActive) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + section.id);
        });
      }
    }
  });
});

// ── HAMBURGER ──
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('open');
  if (navLinks.classList.contains('open')) {
    gsap.from('.nav-links li', { x: 50, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
  }
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ── GLOBAL SCROLL REVEAL ──
const fadeEls = document.querySelectorAll('.fade-up');
fadeEls.forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 90%', // Trigger slightly earlier
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: (i % 3) * 0.1 + 0.2 // Add a small base delay
  });
});

// ── HERO TYPING ANIMATION ──
const heroTitle = document.querySelector('.hero-title span');
const originalText = heroTitle.textContent;
heroTitle.textContent = '';
gsap.to(heroTitle, {
  text: originalText,
  duration: 2,
  delay: 1.5,
  ease: "none",
});

// ── MOUSE PARALLAX (HERO) ──
window.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
  
  gsap.to('.hero-image', { x: moveX * 2, y: moveY * 2, duration: 1 });
  gsap.to('.hero-bg', { x: -moveX, y: -moveY, duration: 1 });
});

// ── CONTACT FORM ──
// ── CONTACT FORM ──
async function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalContent = btn.innerHTML;
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  
  try {
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with error:', errorText);
        throw new Error('Server Error');
    }

    const data = await response.json();

    if (data.success) {
      btn.innerHTML = '✅ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#34d399,#059669)';
      gsap.from(btn, { scale: 1.1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
      e.target.reset();
    } else {
      throw new Error(data.message || 'Failed to send');
    }
  } catch (error) {
    console.error('Submission Error:', error);
    
    if (error.message === 'Failed to fetch') {
        btn.innerHTML = '❌ Server Offline';
    } else {
        btn.innerHTML = '❌ Error sending!';
    }
    btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
  } finally {
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 70 }, ease: 'power3.inOut' });
  });
});

// ── MODERN BACKGROUND PARTICLES & AI BOT ──
const canvas = document.getElementById("bgGameCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let aiBot;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) this.reset();
  }
  draw() {
    ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class AIBot {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 2;
    this.trail = [];
    this.maxTrail = 30;
    this.turnSpeed = 0.05;
  }
  update() {
    // Wander logic: slightly change angle randomly
    this.angle += (Math.random() - 0.5) * 0.2;
    
    // Avoid edges
    const margin = 50;
    if (this.x < margin) this.angle = 0;
    if (this.x > canvas.width - margin) this.angle = Math.PI;
    if (this.y < margin) this.angle = Math.PI / 2;
    if (this.y > canvas.height - margin) this.angle = -Math.PI / 2;

    // Move
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Maintain trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.shift();
  }
  draw() {
    // Draw fading trail
    ctx.beginPath();
    ctx.strokeStyle = "rgba(14, 165, 233, 0.3)";
    ctx.lineWidth = 2;
    for (let i = 0; i < this.trail.length - 1; i++) {
      const alpha = i / this.trail.length;
      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x, this.trail[i].y);
      ctx.lineTo(this.trail[i+1].x, this.trail[i+1].y);
      ctx.stroke();
    }

    // Draw bot (glowing dot)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#38bdf8";
    ctx.fillStyle = "#f0f9ff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class AutoSnake {
  constructor() {
    this.gridSize = 25;
    this.reset();
  }
  reset() {
    this.body = [{x: this.gridSize * 5, y: this.gridSize * 5}];
    this.dir = {x: 1, y: 0};
    this.food = this.spawnFood();
    this.grow = false;
    this.frameCounter = 0;
    this.moveInterval = 8; // Move every 8 frames for smooth performance
  }
  spawnFood() {
    let x = Math.floor(Math.random() * (canvas.width / this.gridSize)) * this.gridSize;
    let y = Math.floor(Math.random() * (canvas.height / this.gridSize)) * this.gridSize;
    return {x, y};
  }
  update() {
    this.frameCounter++;
    if (this.frameCounter < this.moveInterval) return;
    this.frameCounter = 0;

    // Simple AI: Move towards food
    const head = this.body[0];
    let nextDir = {x: 0, y: 0};

    if (head.x < this.food.x) nextDir.x = 1;
    else if (head.x > this.food.x) nextDir.x = -1;
    else if (head.y < this.food.y) nextDir.y = 1;
    else if (head.y > this.food.y) nextDir.y = -1;

    // Avoid 180 degree turns and basic body collision
    const testX = head.x + nextDir.x * this.gridSize;
    const testY = head.y + nextDir.y * this.gridSize;
    
    if (this.body.some(seg => seg.x === testX && seg.y === testY)) {
      // Try alternate direction if blocked
      if (nextDir.x !== 0) { nextDir.x = 0; nextDir.y = Math.random() > 0.5 ? 1 : -1; }
      else { nextDir.y = 0; nextDir.x = Math.random() > 0.5 ? 1 : -1; }
    }

    this.dir = nextDir;
    const newHead = {
      x: (head.x + this.dir.x * this.gridSize + canvas.width) % canvas.width,
      y: (head.y + this.dir.y * this.gridSize + canvas.height) % canvas.height
    };

    this.body.unshift(newHead);
    if (Math.abs(newHead.x - this.food.x) < 5 && Math.abs(newHead.y - this.food.y) < 5) {
      this.food = this.spawnFood();
    } else {
      this.body.pop();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#0ea5e9";
    
    // Draw Snake
    ctx.fillStyle = "#0ea5e9";
    this.body.forEach((seg, i) => {
      ctx.fillRect(seg.x + 2, seg.y + 2, this.gridSize - 4, this.gridSize - 4);
    });

    // Draw Food
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(this.food.x + this.gridSize / 2, this.food.y + this.gridSize / 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class RoadRunner {
  constructor() {
    this.laneHeight = 40;
    this.lanes = 3;
    this.speed = 4;
    this.gridOffset = 0;
    this.reset();
  }
  reset() {
    this.yBase = canvas.height * 0.8;
    this.car = { lane: 1, y: 1 * this.laneHeight, targetY: 1 * this.laneHeight, x: 80 };
    this.obstacles = [];
    this.spawnTimer = 0;
  }
  update() {
    this.gridOffset = (this.gridOffset + this.speed) % 100;
    
    // Move obstacles
    this.obstacles.forEach(obs => obs.x -= this.speed);
    this.obstacles = this.obstacles.filter(obs => obs.x > -50);

    // Spawn obstacles
    this.spawnTimer++;
    if (this.spawnTimer > 100) {
      this.obstacles.push({ x: canvas.width + 50, lane: Math.floor(Math.random() * 3) });
      this.spawnTimer = 0;
    }

    // AI: Avoid obstacles
    const nextObs = this.obstacles.find(obs => obs.lane === this.car.lane && obs.x > this.car.x && obs.x < this.car.x + 300);
    if (nextObs) {
      // Find empty lane
      const availableLanes = [0, 1, 2].filter(l => !this.obstacles.some(obs => obs.lane === l && obs.x > this.car.x - 50 && obs.x < this.car.x + 400));
      if (availableLanes.length > 0) {
        this.car.lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        this.car.targetY = this.car.lane * this.laneHeight;
      }
    }

    // Smooth car lane switch
    this.car.y += (this.car.targetY - this.car.y) * 0.1;
  }
  draw() {
    ctx.save();
    ctx.translate(0, this.yBase);
    ctx.globalAlpha = 0.12;

    // Draw Grid
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.lanes; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.laneHeight);
      ctx.lineTo(canvas.width, i * this.laneHeight);
      ctx.stroke();
    }
    for (let x = -this.gridOffset; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.lanes * this.laneHeight);
      ctx.stroke();
    }

    // Draw Obstacles
    ctx.fillStyle = "#818cf8";
    this.obstacles.forEach(obs => {
      ctx.fillRect(obs.x, obs.lane * this.laneHeight + 5, 30, this.laneHeight - 10);
    });

    // Draw Car
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#c084fc";
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(this.car.x, this.car.y + 5, 40, this.laneHeight - 10);
    
    ctx.restore();
  }
}

class NeuralNetwork {
  constructor() {
    this.nodes = [];
    this.connections = [];
    this.pulses = [];
    this.reset();
  }
  reset() {
    this.nodes = [];
    this.connections = [];
    this.pulses = [];
    
    // Create layers: Input (3), Hidden (5), Output (3)
    const layers = [3, 5, 3];
    const layerSpacing = canvas.width / (layers.length + 1);
    
    layers.forEach((count, i) => {
      const x = (i + 1) * layerSpacing;
      const nodeSpacing = canvas.height / (count + 1);
      const layerNodes = [];
      
      for (let j = 0; j < count; j++) {
        const y = (j + 1) * nodeSpacing;
        const node = { x, y, id: `${i}-${j}` };
        this.nodes.push(node);
        layerNodes.push(node);
      }
      
      // Connect to previous layer
      if (i > 0) {
        const prevLayerNodes = this.nodes.filter(n => n.id.startsWith(`${i-1}-`));
        layerNodes.forEach(currNode => {
          prevLayerNodes.forEach(prevNode => {
            this.connections.push({ from: prevNode, to: currNode });
          });
        });
      }
    });
  }
  update() {
    // Randomly spawn pulses at input nodes
    if (Math.random() < 0.03) {
      const inputNodes = this.nodes.filter(n => n.id.startsWith('0-'));
      this.spawnPulse(inputNodes[Math.floor(Math.random() * inputNodes.length)]);
    }

    // Update existing pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.progress += pulse.speed;
      
      if (pulse.progress >= 1) {
        // Trigger next connections
        const nextConns = this.connections.filter(c => c.from === pulse.to);
        nextConns.forEach(conn => {
          if (Math.random() < 0.4) this.spawnPulse(pulse.to, conn.to);
        });
        this.pulses.splice(i, 1);
      }
    }
  }
  spawnPulse(from, to = null) {
    if (!to) {
      const conns = this.connections.filter(c => c.from === from);
      if (conns.length === 0) return;
      to = conns[Math.floor(Math.random() * conns.length)].to;
    }
    this.pulses.push({
      from, to, progress: 0, 
      speed: 0.005 + Math.random() * 0.01
    });
  }
  draw() {
    ctx.save();
    // Connections
    ctx.strokeStyle = "rgba(129, 140, 248, 0.05)";
    ctx.lineWidth = 1;
    this.connections.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.from.x, c.from.y);
      ctx.lineTo(c.to.x, c.to.y);
      ctx.stroke();
    });
    // Nodes
    ctx.fillStyle = "rgba(129, 140, 248, 0.1)";
    this.nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    // Pulses
    this.pulses.forEach(p => {
      const x = p.from.x + (p.to.x - p.from.x) * p.progress;
      const y = p.from.y + (p.to.y - p.from.y) * p.progress;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#818cf8";
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

class AutoTetris {
  constructor() {
    this.cols = 10;
    this.rows = 20;
    this.blockSize = 18;
    this.xBase = 50;
    this.yBase = 100;
    this.colors = ['#0ef', '#f0f', '#ff0', '#0f0', '#f00', '#f80', '#80f'];
    this.reset();
  }
  reset() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.spawnPiece();
    this.frameCounter = 0;
    this.dropInterval = 20; 
  }
  spawnPiece() {
    const shapes = [
      [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
      [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]]
    ];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    this.activePiece = { shape, x: 3, y: 0, color: this.colors[Math.floor(Math.random() * this.colors.length)] };
    // Simple AI: Decide target X and rotation immediately
    this.aiTargetX = Math.floor(Math.random() * (this.cols - shape[0].length));
  }
  update() {
    this.frameCounter++;
    if (this.frameCounter % 2 === 0) { // Move towards AI target X
      if (this.activePiece.x < this.aiTargetX) this.activePiece.x++;
      else if (this.activePiece.x > this.aiTargetX) this.activePiece.x--;
    }
    
    if (this.frameCounter >= this.dropInterval) {
      this.frameCounter = 0;
      if (this.canMove(0, 1)) {
        this.activePiece.y++;
      } else {
        this.lockPiece();
        this.clearLines();
        this.spawnPiece();
        if (!this.canMove(0, 0)) this.reset();
      }
    }
  }
  canMove(dx, dy) {
    return this.activePiece.shape.every((row, y) => 
      row.every((val, x) => {
        if (!val) return true;
        let newX = this.activePiece.x + x + dx;
        let newY = this.activePiece.y + y + dy;
        return newX >= 0 && newX < this.cols && newY < this.rows && (!this.grid[newY] || !this.grid[newY][newX]);
      })
    );
  }
  lockPiece() {
    this.activePiece.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val) this.grid[this.activePiece.y + y][this.activePiece.x + x] = this.activePiece.color;
      });
    });
  }
  clearLines() {
    for (let y = this.rows - 1; y >= 0; y--) {
      if (this.grid[y].every(cell => cell !== 0)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.cols).fill(0));
        y++;
      }
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.xBase, this.yBase);
    ctx.globalAlpha = 0.15;
    
    // Draw Grid outline
    ctx.strokeStyle = "#444";
    ctx.strokeRect(0, 0, this.cols * this.blockSize, this.rows * this.blockSize);

    // Draw Locked Blocks
    this.grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) this.drawBlock(x, y, color);
      });
    });

    // Draw Active Piece
    if (this.activePiece) {
      this.activePiece.shape.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) this.drawBlock(this.activePiece.x + x, this.activePiece.y + y, this.activePiece.color);
        });
      });
    }
    ctx.restore();
  }
  drawBlock(x, y, color) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, this.blockSize - 2, this.blockSize - 2);
  }
}

let snake, runner, neuralNet, tetris;



function initScene() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < 60; i++) particles.push(new Particle());
  aiBot = new AIBot();
  snake = new AutoSnake();
  runner = new RoadRunner();
  neuralNet = new NeuralNetwork();
  tetris = new AutoTetris();
}

function animateScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  aiBot.update();
  aiBot.draw();
  snake.update();
  snake.draw();
  runner.update();
  runner.draw();
  neuralNet.update();
  neuralNet.draw();
  tetris.update();
  tetris.draw();
  requestAnimationFrame(animateScene);
}

window.addEventListener('resize', initScene);
initScene();
animateScene();

// ── SKILLS PROGRESS REVEAL (TAGS) ──
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach((tag, i) => {
  gsap.from(tag, {
    scrollTrigger: {
      trigger: tag,
      start: 'top 95%',
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    delay: (i % 5) * 0.05
  });
});

// ── IMAGE & CARD TILT EFFECT ──
const tiltElements = document.querySelectorAll('.profile-ring, .project-card, .cert-card, .achievement-card, .edu-card');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(el, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  });
  
  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
});

// ── ACHIEVEMENTS COUNT-UP ──
// (If there were numbers, we'd animate them here. Let's add a subtle reveal for achievement icons)
const achIcons = document.querySelectorAll('.achievement-icon');
achIcons.forEach(icon => {
  gsap.from(icon, {
    scrollTrigger: {
      trigger: icon,
      start: 'top 90%',
    },
    scale: 0,
    rotation: 360,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
});

// ── EDUCATION TIMELINE ──
gsap.to('.education-timeline-line', {
  scrollTrigger: {
    trigger: '.education-list',
    start: 'top 80%',
    end: 'bottom 80%',
    scrub: true
  },
  height: '100%',
  ease: 'none'
});

const eduCards = document.querySelectorAll('.edu-card');
eduCards.forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 90%',
    },
    x: i % 2 === 0 ? -50 : 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });
});

// ── CERTIFICATE MODAL ──
function openCertModal(imgSrc) {
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certImage");
  modal.style.display = "block";
  modalImg.src = imgSrc;
  document.body.style.overflow = "hidden";
  
  gsap.fromTo('.modal-content', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
}

function closeCertModal() {
  const modal = document.getElementById("certModal");
  gsap.to('.modal-content', { 
    scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

window.onclick = function(event) {
  const modal = document.getElementById("certModal");
  if (event.target == modal) closeCertModal();
}
function togglePoints(btn) {
  const container = btn.parentElement;
  const extraPoints = container.querySelector('.extra-points');
  const isHidden = extraPoints.style.display === 'none';
  
  if (isHidden) {
    extraPoints.style.display = 'block';
    btn.textContent = 'View Less';
    btn.classList.add('active');
  } else {
    extraPoints.style.display = 'none';
    btn.textContent = 'View More';
    btn.classList.remove('active');
  }
}

// ── AI CHATBOT LOGIC ──
const chatbotBtn = document.getElementById('chatbot-button');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotInput = document.getElementById('chatbot-input');
const sendChatbotMsg = document.getElementById('send-chatbot-msg');
const chatbotMessages = document.getElementById('chatbot-messages');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');

// Toggle Chat Window
chatbotBtn.addEventListener('click', () => {
  chatbotWindow.classList.toggle('hidden');
  if (!chatbotWindow.classList.contains('hidden')) {
    chatbotInput.focus();
    // Hide notification when opened
    const notification = document.querySelector('.chatbot-notification');
    if (notification) notification.style.display = 'none';
  }
});

closeChatbot.addEventListener('click', (e) => {
  e.stopPropagation();
  chatbotWindow.classList.add('hidden');
});

// Close when clicking outside on mobile
document.addEventListener('mousedown', (e) => {
  if (!chatbotWindow.contains(e.target) && !chatbotBtn.contains(e.target) && !chatbotWindow.classList.contains('hidden')) {
    chatbotWindow.classList.add('hidden');
  }
});

// Send Message Function
function sendMessage(text) {
  if (!text.trim()) return;

  // Add User Message
  const userMsg = document.createElement('div');
  userMsg.className = 'chatbot-msg user';
  userMsg.textContent = text;
  chatbotMessages.appendChild(userMsg);
  
  // Clear Input
  chatbotInput.value = '';
  
  // Scroll to Bottom
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  // Simulate Bot Response
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chatbot-msg bot';
    botMsg.textContent = generateBotResponse(text);
    chatbotMessages.appendChild(botMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Animation for new message
    gsap.from(botMsg, { y: 10, opacity: 0, duration: 0.3 });
  }, 1000);
}

// Simple Response Logic
function generateBotResponse(input) {
  const query = input.toLowerCase();
  
  if (query.includes('who is piyush') || query.includes('about')) {
    return "Piyush is an Aspiring Data Analyst passionate about turning complex data into actionable insights! He has experience with Python, SQL, and Data Visualization.";
  }
  if (query.includes('project') || query.includes('work')) {
    return "Piyush has built several projects including a Crime Analysis Dashboard, a Spotify Data Pipeline, and a Startup Advisor Chatbot. You can see them in the Projects section!";
  }
  if (query.includes('hire') || query.includes('contact')) {
    return "You can contact Piyush via the form on this website or reach out on LinkedIn. He's currently open to new opportunities!";
  }
  if (query.includes('hello') || query.includes('hi')) {
    return "Hello! How can I help you today?";
  }
  
  return "That's a great question! I'm still learning, but you can definitely find more details about that in Piyush's CV or by contacting him directly.";
}

// Event Listeners for sending
sendChatbotMsg.addEventListener('click', () => sendMessage(chatbotInput.value));
chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage(chatbotInput.value);
});

// ── GITHUB STATS FETCHING ──
async function fetchGitHubStats() {
  const username = '2613piyush';
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
  const userUrl = `https://api.github.com/users/${username}`;

  try {
    // Fetch user profile stats
    const userRes = await fetch(userUrl);
    const userData = await userRes.json();
    
    if (userData.public_repos !== undefined) {
      document.getElementById('github-repos').textContent = userData.public_repos + '+';
      document.getElementById('github-followers').textContent = userData.followers + '+';
    }

    // Fetch repos for stars and languages
    const reposRes = await fetch(reposUrl);
    const reposData = await reposRes.json();
    
    let totalStars = 0;
    let languages = {};

    reposData.forEach(repo => {
      totalStars += repo.stargazers_count;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Find top language
    let topLang = 'Python'; // Fallback
    let maxCount = 0;
    for (const lang in languages) {
      if (languages[lang] > maxCount) {
        maxCount = languages[lang];
        topLang = lang;
      }
    }

    document.getElementById('github-stars').textContent = totalStars + '+';
    document.getElementById('github-language').textContent = topLang;

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Fallback values
    document.getElementById('github-repos').textContent = '12+';
    document.getElementById('github-followers').textContent = '25+';
    document.getElementById('github-stars').textContent = '8+';
    document.getElementById('github-language').textContent = 'Python';
  }
}

// Call on load
fetchGitHubStats();

// Quick Action Listeners

quickActionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.textContent);
  });
});
