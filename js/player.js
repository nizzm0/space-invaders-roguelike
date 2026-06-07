import { audio } from './audio.js';
import { Projectile } from './projectile.js';
import { SPRITES, drawPixelSprite } from './sprites.js';
import { varColor } from './utils.js';

// --- KLASA GRACZA ---
export class Player {
    constructor() {
        this.width = 52;
        this.height = 32;
        this.resetPosition();
        
        this.isAlive = true;
        this.lives = 3;
        this.maxLives = 5;
        this.cooldown = 0;

        this.upgrades = {
            fireRate: 0,
            speed: 0,
            bulletSpeed: 0,
            multiShot: 0,
            explosive: 0,
            autofire: 0
        };
    }

    resetPosition() {
        this.x = 400 - this.width / 2;
        this.y = 520;
    }

    getSpeed() {
        return 4.5 + this.upgrades.speed * 0.8;
    }

    getMaxCooldown() {
        return Math.max(8, 25 - this.upgrades.fireRate * 4);
    }

    getBulletSpeed() {
        return -(6.5 + this.upgrades.bulletSpeed * 1.5);
    }

    update(keys, canvasWidth) {
        if (!this.isAlive) return;

        const speed = this.getSpeed();
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= speed;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += speed;
        }

        if (this.x < 15) this.x = 15;
        if (this.x > canvasWidth - this.width - 15) this.x = canvasWidth - this.width - 15;

        if (this.cooldown > 0) {
            this.cooldown--;
        }
    }

    shoot(projectiles) {
        if (!this.isAlive || this.cooldown > 0) return false;

        const bulletSpeed = this.getBulletSpeed();
        const explosive = this.upgrades.explosive > 0;
        const blastRadius = this.upgrades.explosive;

        if (this.upgrades.multiShot === 0) {
            projectiles.push(new Projectile(this.x + this.width / 2, this.y, bulletSpeed, 'player', explosive, blastRadius));
        } else if (this.upgrades.multiShot === 1) {
            projectiles.push(new Projectile(this.x + 6, this.y + 10, bulletSpeed, 'player', explosive, blastRadius));
            projectiles.push(new Projectile(this.x + this.width - 6, this.y + 10, bulletSpeed, 'player', explosive, blastRadius));
        } else if (this.upgrades.multiShot >= 2) {
            projectiles.push(new Projectile(this.x + this.width / 2, this.y, bulletSpeed, 'player', explosive, blastRadius));
            
            const pLeft = new Projectile(this.x + 4, this.y + 10, bulletSpeed, 'player', explosive, blastRadius);
            pLeft.vx = -1.5;
            projectiles.push(pLeft);

            const pRight = new Projectile(this.x + this.width - 4, this.y + 10, bulletSpeed, 'player', explosive, blastRadius);
            pRight.vx = 1.5;
            projectiles.push(pRight);
        }

        this.cooldown = this.getMaxCooldown();
        audio.playLaser();
        return true;
    }

    draw(ctx) {
        if (!this.isAlive) return;
        const color = varColor('--neon-green', '#39ff14');
        drawPixelSprite(ctx, SPRITES.player, this.x, this.y, this.width, this.height, color, true);
    }
}
