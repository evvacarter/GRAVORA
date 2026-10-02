const canvas = document.getElementById('bhCanvas');
const ctx = canvas.getContext('2d');
// Pura window target karne ki jagah ab hum sirf heroWrapper ko target karenge
const heroWrapper = document.getElementById('heroWrapper');

const asciiChars = ['*', '.', '%', '#', '@', '+', 'x', '~', '-', '0', '1'];
const maxParticles = 300; 
const speedMultiplier = 0.25;
let particles = [];
let centerX, centerY;
let width, height;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    
    // Ab canvas ka size window ki jagah heroWrapper ke hisaab se set hoga
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

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 1.5 + 0.5,
        char: asciiChars[Math.floor(Math.random() * asciiChars.length)]
    };
}

for(let i = 0; i < maxParticles; i++) {
    particles.push(createParticle());
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#111';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 20;
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
            // Naya particle screen ke boundaries (hero section) se aayega
            if (Math.random() > 0.5) {
                particles[i].x = Math.random() > 0.5 ? -10 : width + 10;
            } else {
                particles[i].y = Math.random() > 0.5 ? -10 : height + 10;
            }
            continue;
        }

        let gravityPull = 500 / (distance + 10);
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

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.font = `${14 * scale}px monospace`;
        ctx.fillText(charToDraw, p.x, p.y);
    }

    requestAnimationFrame(animate);
}

animate();

