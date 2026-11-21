import { Component, computed, DestroyRef, inject, signal } from '@angular/core';

interface MorphFrame {
  readonly id: string;
  readonly tag: string;
  readonly sub: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly opacity: number;
  readonly accent: string;
  readonly isMain: boolean;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mixRgb(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(lerp(c1[0], c2[0], t));
  const g = Math.round(lerp(c1[1], c2[1], t));
  const b = Math.round(lerp(c1[2], c2[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

@Component({
  selector: 'app-time-morph-hero',
  templateUrl: './time-morph-hero.html',
})
export class TimeMorphHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private playTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly eraProgress = signal<number>(0);
  protected readonly isPlaying = signal<boolean>(false);

  protected readonly t = computed(() => this.eraProgress() / 100);

  protected readonly currentYear = computed(() => Math.round(lerp(1969, 2026, this.t())));

  protected readonly eraPhase = computed<'1969' | 'transicao' | 'hoje'>(() => {
    const val = this.eraProgress();
    if (val < 34) return '1969';
    if (val < 67) return 'transicao';
    return 'hoje';
  });

  protected readonly stageBg = computed(() => mixRgb([245, 241, 232], [13, 13, 15], this.t()));
  protected readonly stageSurface = computed(() => mixRgb([236, 230, 218], [22, 22, 26], this.t()));
  protected readonly stageText = computed(() => mixRgb([28, 27, 25], [244, 243, 239], this.t()));
  protected readonly stageMuted = computed(() => mixRgb([87, 83, 78], [161, 161, 170], this.t()));
  protected readonly stageBorder = computed(() => mixRgb([41, 37, 36], [43, 43, 51], this.t()));

  protected readonly stageAccent = computed(() => {
    const val = this.t();
    if (val < 0.5) {
      return mixRgb([201, 74, 41], [239, 68, 68], val * 2);
    }
    return mixRgb([239, 68, 68], [163, 230, 53], (val - 0.5) * 2);
  });

  protected readonly accentInk = computed(() => (this.t() >= 0.65 ? '#0D0D0F' : '#F5F1E8'));

  protected readonly paperOpacity = computed(() => Math.max(0, 1 - this.t() * 1.3));
  protected readonly tvOverlayOpacity = computed(() => Math.max(0, 1 - this.t() * 1.85));
  protected readonly feedOverlayOpacity = computed(() =>
    Math.max(0, Math.min(1, (this.t() - 0.32) / 0.48)),
  );

  protected readonly ratioBadge = computed(() => {
    const phase = this.eraPhase();
    if (phase === '1969') return 'Tela 4:3 · Uma imagem coletiva';
    if (phase === 'transicao') return 'Transição · A tela começa a se dividir';
    return 'Tela 9:16 · Vários feeds isolados';
  });

  protected readonly audienceMetric = computed(() => {
    const phase = this.eraPhase();
    if (phase === '1969') {
      return {
        big: '650 milhões',
        detail: 'assistindo ao mesmo quadro ao vivo',
      };
    }
    if (phase === 'transicao') {
      return {
        big: 'Milhares',
        detail: 'de canais e nichos em paralelo',
      };
    }
    return {
      big: '1 pessoa',
      detail: 'por bolha no próprio celular',
    };
  });

  protected readonly politicsMetric = computed(() => {
    const phase = this.eraPhase();
    if (phase === '1969') {
      return {
        big: 'Política de Estado',
        detail: 'corrida espacial na Guerra Fria',
      };
    }
    if (phase === 'transicao') {
      return {
        big: 'Crise de mediação',
        detail: 'disputa entre TV aberta e internet',
      };
    }
    return {
      big: 'Antipolítica',
      detail: 'bilionários privados e engajamento',
    };
  });

  protected readonly attentionMetric = computed(() => {
    const phase = this.eraPhase();
    if (phase === '1969') {
      return {
        big: 'Horas seguidas',
        detail: 'transmissão contínua sem cortes',
      };
    }
    if (phase === 'transicao') {
      return {
        big: 'Minutos',
        detail: 'atenção dividida entre várias abas',
      };
    }
    return {
      big: '8 segundos',
      detail: 'retenção rápida em vídeos verticais',
    };
  });

  protected readonly morphFrames = computed<readonly MorphFrame[]>(() => {
    const t = this.t();
    const spread = Math.max(0, Math.min(1, (t - 0.12) / 0.88));
    const sideOpacity = Math.max(0, Math.min(1, (t - 0.14) / 0.42));

    const targets = [
      { id: 'f-1', tag: 'Bolha 01', sub: 'Conspiração', tx: 54, ty: 44, accent: '#EF4444' },
      { id: 'f-2', tag: 'Bolha 02', sub: 'Antipolítica', tx: 212, ty: 126, accent: '#EF4444' },
      { id: 'f-3', tag: 'Seu feed', sub: 'Para você', tx: 370, ty: 82, accent: '#A3E635' },
      { id: 'f-4', tag: 'Bolha 04', sub: 'Cortes 8s', tx: 528, ty: 126, accent: '#A3E635' },
      { id: 'f-5', tag: 'Bolha 05', sub: 'Ciência', tx: 686, ty: 44, accent: '#F4F3EF' },
    ];

    return targets.map((item, idx) => {
      if (idx === 2) {
        const w = lerp(420, 102, t);
        const h = lerp(310, 180, t);
        const x = lerp(210, item.tx, t);
        const y = lerp(15, item.ty, t);
        return {
          id: item.id,
          tag: item.tag,
          sub: item.sub,
          x,
          y,
          w,
          h,
          opacity: 1,
          accent: t > 0.5 ? item.accent : '#C94A29',
          isMain: true,
        };
      }

      const w = lerp(136, 102, spread);
      const h = lerp(210, 180, spread);
      const x = lerp(352, item.tx, spread);
      const y = lerp(65, item.ty, spread);
      return {
        id: item.id,
        tag: item.tag,
        sub: item.sub,
        x,
        y,
        w,
        h,
        opacity: sideOpacity,
        accent: item.accent,
        isMain: false,
      };
    });
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopAutoPlay();
    });
  }

  protected onSliderInput(event: Event): void {
    this.stopAutoPlay();
    const input = event.target as HTMLInputElement;
    this.eraProgress.set(Number(input.value));
  }

  protected setPreset(value: number): void {
    this.stopAutoPlay();
    this.eraProgress.set(value);
  }

  protected toggleAutoPlay(): void {
    if (this.isPlaying()) {
      this.stopAutoPlay();
      return;
    }

    if (this.eraProgress() >= 100) {
      this.eraProgress.set(0);
    }

    this.isPlaying.set(true);
    this.playTimer = setInterval(() => {
      const next = this.eraProgress() + 1;
      if (next >= 100) {
        this.eraProgress.set(100);
        this.stopAutoPlay();
      } else {
        this.eraProgress.set(next);
      }
    }, 55);
  }

  private stopAutoPlay(): void {
    if (this.playTimer !== null) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    this.isPlaying.set(false);
  }
}
