/**
 * High Performance Canvas Confetti System
 */
class ConfettiSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrameId = null;
        this.active = false;
        
        // Colors
        this.colors = [
            '#f72585', '#7209b7', '#3f37c9', '#4cc9f0', 
            '#ffb703', '#fb8500', '#39ff14', '#ff007f'
        ];
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (this.active) this.resizeCanvas();
        });
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    start() {
        if (this.active) return;
        this.active = true;
        this.resizeCanvas();
        this.particles = [];
        
        // Generate initial particles
        const particleCount = 120;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.loop();
    }
    
    stop() {
        this.active = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * -this.canvas.height - 20,
            size: Math.random() * 8 + 6,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.05 + 0.02
        };
    }
    
    loop() {
        if (!this.active) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw & Update
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 0.5;
            p.angle += p.wobbleSpeed;
            p.wobble += p.rotationSpeed;
            
            // Draw particle
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.wobble);
            this.ctx.fillStyle = p.color;
            
            // Randomly draw squares or circles
            if (i % 2 === 0) {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
            
            // Reset particle if it goes off screen
            if (p.y > this.canvas.height) {
                this.particles[i] = this.createParticle();
                this.particles[i].y = -10; // place just above screen
            }
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
}
window.ConfettiSystem = ConfettiSystem;
