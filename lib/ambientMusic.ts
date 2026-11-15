/**
 * Soft, melancholic memorial chamber music synthesizer using Web Audio API.
 * Plays a slow D-minor elegy (warm filtered string pad + sparse felt-piano notes)
 * with cathedral-like echo, requiring zero external audio files or network calls.
 */

interface ChordStep {
  padFreqs: number[];
  melodyFreqs: number[];
}

// D minor memorial progression (~56 BPM, 7 seconds per chord)
const ELEGY_PROGRESSION: ChordStep[] = [
  {
    // Dm9: D3, A3, F4, E4
    padFreqs: [146.83, 220.0, 349.23],
    melodyFreqs: [587.33, 523.25, 440.0], // D5, C5, A4
  },
  {
    // Bbmaj7: Bb2, F3, D4
    padFreqs: [116.54, 174.61, 293.66],
    melodyFreqs: [466.16, 440.0, 349.23], // Bb4, A4, F4
  },
  {
    // Gm7: G2, D3, Bb3
    padFreqs: [98.0, 146.83, 233.08],
    melodyFreqs: [392.0, 349.23, 293.66], // G4, F4, D4
  },
  {
    // Asus4 -> A: A2, E3, C#4
    padFreqs: [110.0, 164.81, 277.18],
    melodyFreqs: [329.63, 293.66, 277.18], // E4, D4, C#4
  },
];

export class VerdunAmbientPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbBus: GainNode | null = null;
  private loopTimer: number | null = null;
  private noteTimers: number[] = [];
  private stepIndex = 0;
  private volume = 0.35;
  private playing = false;

  public isPlaying(): boolean {
    return this.playing;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(nextVol: number): void {
    this.volume = Math.max(0, Math.min(1, nextVol));
    if (this.ctx && this.masterGain && this.playing) {
      this.masterGain.gain.setTargetAtTime(
        this.volume * 0.42,
        this.ctx.currentTime,
        0.15
      );
    }
  }

  public async start(): Promise<void> {
    if (this.playing) return;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.setupGraph();
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.playing = true;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.volume * 0.42,
        this.ctx.currentTime,
        0.6
      );
    }

    this.scheduleChordCycle();
    this.loopTimer = window.setInterval(() => {
      if (this.playing) {
        this.scheduleChordCycle();
      }
    }, 6800);
  }

  public stop(): void {
    this.playing = false;
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.noteTimers.forEach((t) => window.clearTimeout(t));
    this.noteTimers = [];

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.35);
    }
  }

  public dispose(): void {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
      this.reverbBus = null;
    }
  }

  private setupGraph(): void {
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;
    this.masterGain.connect(this.ctx.destination);

    // Warm cathedral echo feedback loop
    this.reverbBus = this.ctx.createGain();
    this.reverbBus.gain.value = 0.55;

    const delayL = this.ctx.createDelay(2.0);
    delayL.delayTime.value = 0.48;

    const delayR = this.ctx.createDelay(2.0);
    delayR.delayTime.value = 0.71;

    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.36;

    const dampFilter = this.ctx.createBiquadFilter();
    dampFilter.type = "lowpass";
    dampFilter.frequency.value = 680;

    this.reverbBus.connect(delayL);
    delayL.connect(dampFilter);
    dampFilter.connect(delayR);
    delayR.connect(feedback);
    feedback.connect(delayL);

    dampFilter.connect(this.masterGain);
    this.reverbBus.connect(this.masterGain);
  }

  private scheduleChordCycle(): void {
    if (!this.ctx || !this.reverbBus || !this.playing) return;

    const step = ELEGY_PROGRESSION[this.stepIndex % ELEGY_PROGRESSION.length];
    this.stepIndex += 1;

    // Warm string pad voices
    step.padFreqs.forEach((freq) => {
      this.triggerPadVoice(freq, 6.9);
    });

    // Sparse felt-piano motif notes
    const delays = [650, 2600, 4650];
    step.melodyFreqs.forEach((freq, idx) => {
      const t = window.setTimeout(() => {
        if (this.playing) {
          this.triggerFeltNote(freq, 3.6);
        }
      }, delays[idx] ?? 1000);
      this.noteTimers.push(t);
    });
  }

  private triggerPadVoice(freq: number, durationSec: number): void {
    if (!this.ctx || !this.reverbBus) return;

    const now = this.ctx.currentTime;
    const oscA = this.ctx.createOscillator();
    const oscB = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    oscA.type = "triangle";
    oscA.frequency.value = freq;

    // Slight warm detune
    oscB.type = "sine";
    oscB.frequency.value = freq * 1.0025;

    filter.type = "lowpass";
    filter.frequency.value = 460;

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.085, now + 2.2);
    env.gain.linearRampToValueAtTime(0.06, now + durationSec - 2.4);
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(env);
    env.connect(this.reverbBus);

    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + durationSec + 0.1);
    oscB.stop(now + durationSec + 0.1);
  }

  private triggerFeltNote(freq: number, durationSec: number): void {
    if (!this.ctx || !this.reverbBus) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    filter.type = "lowpass";
    filter.frequency.value = 740;

    // Soft felt-hammer attack and long mournful decay
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.11, now + 0.085);
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.reverbBus);

    osc.start(now);
    osc.stop(now + durationSec + 0.1);
  }
}
