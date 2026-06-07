import { audio } from './audio.js';
import { Particle } from './particle.js';
import { varColor } from './utils.js';

// --- BUNKRY / OSŁONY ---
export class Bunker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rows = 8;
        this.cols = 12;
        this.blockSize = 6;
        this.width = this.cols * this.blockSize;
        this.height = this.rows * this.blockSize;
        
        this.blocks = [];
        for (let r = 0; r < this.rows; r++) {
            this.blocks[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const isArch = (r >= 5 && c >= 4 && c <= 7);
                const isCorner = (r === 0 && (c === 0 || c === 11)) || (r === 1 && (c === 0 || c === 11));
                this.blocks[r][c] = !(isArch || isCorner);
            }
        }
    }

    repair() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const isArch = (r >= 5 && c >= 4 && c <= 7);
                const isCorner = (r === 0 && (c === 0 || c === 11)) || (r === 1 && (c === 0 || c === 11));
                this.blocks[r][c] = !(isArch || isCorner);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        const color = varColor('--neon-green', '#39ff14');
        ctx.fillStyle = color;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.blocks[r][c]) {
                    ctx.fillRect(
                        this.x + c * this.blockSize,
                        this.y + r * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }
        ctx.restore();
    }

    checkCollision(projectile, particles) {
        if (!projectile.active) return false;

        if (projectile.x + projectile.width/2 >= this.x &&
            projectile.x - projectile.width/2 <= this.x + this.width &&
            projectile.y + projectile.height >= this.y &&
            projectile.y <= this.y + this.height) {

            const hitC = Math.floor((projectile.x - this.x) / this.blockSize);
            const hitR = Math.floor((projectile.y + (projectile.vy > 0 ? projectile.height : 0) - this.y) / this.blockSize);

            if (hitR >= 0 && hitR < this.rows && hitC >= 0 && hitC < this.cols) {
                if (this.blocks[hitR][hitC]) {
                    if (projectile.isExplosive) {
                        this.explodeAt(hitR, hitC, projectile.blastRadius, particles);
                    } else {
                        this.blocks[hitR][hitC] = false;
                        this.spawnBlockParticles(this.x + hitC * this.blockSize, this.y + hitR * this.blockSize, particles);
                    }
                    
                    projectile.active = false;
                    audio.playExplosion('alien');
                    return true;
                }
            }
        }
        return false;
    }

    explodeAt(row, col, radius, particles) {
        for (let r = row - radius; r <= row + radius; r++) {
            for (let c = col - radius; c <= col + radius; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.blocks[r][c]) {
                        this.blocks[r][c] = false;
                        this.spawnBlockParticles(
                            this.x + c * this.blockSize + this.blockSize/2, 
                            this.y + r * this.blockSize + this.blockSize/2, 
                            particles
                        );
                    }
                }
            }
        }
    }

    spawnBlockParticles(x, y, particles) {
        const color = varColor('--neon-green', '#39ff14');
        for (let i = 0; i < 2; i++) {
            particles.push(new Particle(x, y, color));
        }
    }
}
