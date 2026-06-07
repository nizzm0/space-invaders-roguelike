import { varColor } from './utils.js';

// --- KLASA POCISKU ---
export class Projectile {
    constructor(x, y, vy, owner, isExplosive = false, blastRadius = 0) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 14;
        this.vy = vy;
        this.owner = owner;
        this.active = true;
        this.isExplosive = isExplosive;
        this.blastRadius = blastRadius;
        this.vx = 0;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        
        if (this.y < -20 || this.y > 620 || this.x < -20 || this.x > 820) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        const color = this.owner === 'player' ? varColor('--neon-cyan', '#00f3ff') : varColor('--neon-pink', '#ff007f');
        ctx.fillStyle = color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        
        if (this.owner === 'player') {
            ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height);
        } else {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - 3, this.y + 4);
            ctx.lineTo(this.x + 3, this.y + 8);
            ctx.lineTo(this.x, this.y + 14);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();
    }
}
