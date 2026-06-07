// --- PROCEDURALNY SILNIK DŹWIĘKOWY (WEB AUDIO API) ---
class AudioController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        
        // Sprawdź w localStorage preferencję wyciszenia
        const mutedPref = localStorage.getItem('arcade_muted');
        if (mutedPref === 'true') {
            this.isMuted = true;
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.updateMuteIcon());
            } else {
                this.updateMuteIcon();
            }
        }
    }

    updateMuteIcon() {
        const icon = document.getElementById('muteIcon');
        if (icon) {
            icon.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }

    init() {
        if (this.ctx) return;
        try {
            // Inicjalizacja AudioContext po geście użytkownika
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API nie jest wspierane", e);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('arcade_muted', this.isMuted);
        this.updateMuteIcon();
        return this.isMuted;
    }

    playLaser() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'triangle';
        // Strzał laserowy - gwałtowny spadek częstotliwości
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    }

    playAlienLaser() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        // Strzał kosmity - szorstki spadek dźwięku
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.21);
    }

    playExplosion(type = 'alien') {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        // Określ długość dźwięku
        const duration = type === 'player' ? 0.6 : (type === 'hit' ? 0.08 : 0.25);
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        
        let freqStart = 500;
        let freqEnd = 30;
        let gainVal = 0.12;

        if (type === 'player') {
            freqStart = 220;
            gainVal = 0.3;
        } else if (type === 'hit') {
            // Krótkie, wysokie retro "stuknięcie" przy uderzeniu w silnego kosmitę
            freqStart = 1200;
            freqEnd = 350;
            gainVal = 0.06;
        }

        filter.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + duration + 0.05);
    }

    playInvaderStep(pitchFactor = 1.0) {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        const freq = 55 * pitchFactor;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
    }

    playShopBuy() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        freqs.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.05);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + index * 0.05 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.05 + 0.15);
            
            osc.start(now + index * 0.05);
            osc.stop(now + index * 0.05 + 0.2);
        });
    }

    playLevelUp() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [330, 440, 554, 660, 880]; // E4, A4, C#5, E5, A5
        
        freqs.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + index * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
            
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.4);
        });
    }

    playGameOver() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [440, 415, 392, 349];
        
        freqs.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + index * 0.2);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + index * 0.2 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.2 + 0.4);
            
            osc.start(now + index * 0.2);
            osc.stop(now + index * 0.2 + 0.5);
        });
    }
}

export const audio = new AudioController();
