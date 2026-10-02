const canvas = document.getElementById('bhCanvas');
const ctx = canvas.getContext('2d');
const heroWrapper = document.getElementById('heroWrapper'); 

const asciiChars = ['*', '.', '%', '#', '@', '+', 'x', '~', '-', '0', '1'];
const maxParticles = 300; 
const speedMultiplier = 0.4; 

let particles = [];
let width, height, centerX, centerY;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    
    // Canvas strictly section ki height/width lega
    width = heroWrapper.clientWidth;
    height = heroWrapper.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(dpr, dpr);
    
    centerX = width / 2;
    centerY = height / 2;
}

// Window load hone par size set karna
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: (Math.random() * 1.5 + 0.2) * speedMultiplier,
        char: asciiChars[Math.floor(Math.random() * asciiChars.length)]
    };
}

for(let i = 0; i < maxParticles; i++) {
    particles.push(createParticle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Purple Radial Gradient
    let glow = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 150);
    glow.addColorStop(0, "black"); 
    glow.addColorStop(0.2, "rgba(20, 0, 40, 1)"); 
    glow.addColorStop(0.6, "rgba(168, 85, 247, 0.4)"); 
    glow.addColorStop(1, "transparent"); 

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
    ctx.fill();

    // Center Bracket
    ctx.fillStyle = 'black';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 30; 
    ctx.font = 'bold 3rem monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('(   )', centerX, centerY);
    
    ctx.shadowBlur = 0;

    for (let i = 0; i < maxParticles; i++) {
        let p = particles[i];
        
        let dx = centerX - p.x;
        let dy = centerY - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
            particles[i] = createParticle();
            if (Math.random() > 0.5) {
                particles[i].x = Math.random() > 0.5 ? -10 : width + 10;
            } else {
                particles[i].y = Math.random() > 0.5 ? -10 : height + 10;
            }
            continue;
        }

        let gravityPull = (150 / (distance + 10)) * speedMultiplier;
        p.x += (dx / distance) * (p.speed + gravityPull);
        p.y += (dy / distance) * (p.speed + gravityPull);

        let scale = 1;
        let opacity = 1;
        let charToDraw = p.char;

        if (distance < 150) {
            scale = Math.max(distance / 150, 0.1);
            opacity = distance / 150;
            if (distance < 60) charToDraw = '•'; 
        }

        ctx.fillStyle = `rgba(217, 70, 239, ${opacity})`;
        ctx.font = `${14 * scale}px monospace`;
        ctx.fillText(charToDraw, p.x, p.y);
    }

    requestAnimationFrame(animate);
}

animate();