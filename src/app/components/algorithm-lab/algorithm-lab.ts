import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  ALGORITHM_CONCEPTS,
  ALGORITHM_POSTS,
  AlgorithmConcept,
  FeedPost,
  FeedVector,
  ReactionType,
  RETENTION_TOASTS,
} from '../../data/experiment.data';

interface TelemetryLog {
  readonly id: number;
  readonly timestamp: string;
  readonly retentionDelta: string;
  readonly message: string;
  readonly tone: 'neutral' | 'acid' | 'alert';
}

interface RetentionToast {
  readonly id: number;
  readonly text: string;
  readonly tone: 'acid' | 'alert';
}

const VECTOR_LABELS: Record<FeedVector, string> = {
  ciencia: 'Ciência',
  antipolitica: 'Antipolítica',
  conspiracao: 'Conspiração',
};

const REACTION_LABELS: Record<ReactionType, string> = {
  curtir: 'Curtir',
  indignar: 'Indignar-se',
  compartilhar: 'Compartilhar',
};

@Component({
  selector: 'app-algorithm-lab',
  templateUrl: './algorithm-lab.html',
})
export class AlgorithmLabComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastTimers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextLogId = 1;
  private nextToastId = 1;
  private poolCursor = 0;

  protected readonly concepts: readonly AlgorithmConcept[] = ALGORITHM_CONCEPTS;
  protected readonly meterSegments = Array.from({ length: 20 }, (_, i) => (i + 1) * 5);

  protected readonly weights = signal<Record<FeedVector, number>>({
    ciencia: 34,
    antipolitica: 33,
    conspiracao: 33,
  });

  protected readonly polarization = signal<number>(12);
  protected readonly totalInteractions = signal<number>(0);
  protected readonly outrageCount = signal<number>(0);
  protected readonly notifications = signal<number>(0);
  protected readonly lastReaction = signal<ReactionType | null>(null);
  protected readonly injectedPostId = signal<string | null>(null);
  protected readonly activeFeed = signal<readonly FeedPost[]>(this.createInitialFeed());
  protected readonly logs = signal<readonly TelemetryLog[]>([
    {
      id: 0,
      timestamp: '00:00',
      retentionDelta: 'Início',
      message: 'Feed equilibrado (34% Ciência, 33% Antipolítica, 33% Conspiração). Clique nos botões do celular para testar.',
      tone: 'neutral',
    },
  ]);
  protected readonly toasts = signal<readonly RetentionToast[]>([]);

  protected readonly composition = computed<Record<FeedVector, number>>(() => {
    const w = this.weights();
    const total = w.ciencia + w.antipolitica + w.conspiracao;
    if (total <= 0) {
      return { ciencia: 34, antipolitica: 33, conspiracao: 33 };
    }
    const ciencia = Math.round((w.ciencia / total) * 100);
    const antipolitica = Math.round((w.antipolitica / total) * 100);
    const conspiracao = Math.max(0, 100 - ciencia - antipolitica);
    return { ciencia, antipolitica, conspiracao };
  });

  protected readonly dominantVector = computed<FeedVector>(() => {
    const c = this.composition();
    if (c.conspiracao >= c.antipolitica && c.conspiracao >= c.ciencia) return 'conspiracao';
    if (c.antipolitica >= c.ciencia) return 'antipolitica';
    return 'ciencia';
  });

  protected readonly dominantShare = computed(() => this.composition()[this.dominantVector()]);

  protected readonly isBubbleLocked = computed(() => this.polarization() > 50);

  protected readonly dopamineAccent = computed<'none' | 'acid' | 'alert'>(() => {
    if (!this.isBubbleLocked()) return 'none';
    if (this.dominantVector() === 'ciencia' && this.lastReaction() !== 'indignar') {
      return 'acid';
    }
    return 'alert';
  });

  protected readonly activeConcepts = computed<Record<AlgorithmConcept['id'], boolean>>(() => ({
    bolha: this.dominantShare() >= 45 || this.polarization() >= 40,
    infocracia: this.polarization() > 50 || this.outrageCount() >= 2,
    cansaco: this.totalInteractions() >= 4 || this.polarization() >= 70,
  }));

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearAllToastTimers();
    });
  }

  protected react(post: FeedPost, reaction: ReactionType): void {
    const targetVector = this.resolveTargetVector(post, reaction);
    const weightGain = reaction === 'indignar' ? 30 : reaction === 'compartilhar' ? 25 : 18;
    const polarizationGain = reaction === 'indignar' ? 21 : reaction === 'compartilhar' ? 17 : 12;

    this.weights.update((prev) => {
      const next = { ...prev };
      next[targetVector] = prev[targetVector] + weightGain;
      for (const vec of ['ciencia', 'antipolitica', 'conspiracao'] as const) {
        if (vec !== targetVector) {
          next[vec] = Math.max(4, Math.round(prev[vec] * (reaction === 'indignar' ? 0.68 : 0.8)));
        }
      }
      return next;
    });

    const nextPolarization = Math.min(100, this.polarization() + polarizationGain);
    this.polarization.set(nextPolarization);
    this.totalInteractions.update((n) => n + 1);
    this.lastReaction.set(reaction);

    if (reaction === 'indignar') {
      this.outrageCount.update((n) => n + 1);
    }

    const notifJump = nextPolarization > 50 ? 6 + Math.floor(nextPolarization / 12) : 1;
    this.notifications.update((n) => n + notifJump);

    this.appendLog(targetVector, reaction, polarizationGain, nextPolarization);
    this.updateFeedAfterInteraction(post.id, targetVector, nextPolarization);

    if (nextPolarization > 50) {
      this.spawnRetentionToast(targetVector, reaction);
    }
  }

  protected resetAlgorithm(): void {
    this.clearAllToastTimers();
    this.weights.set({ ciencia: 34, antipolitica: 33, conspiracao: 33 });
    this.polarization.set(12);
    this.totalInteractions.set(0);
    this.outrageCount.set(0);
    this.notifications.set(0);
    this.lastReaction.set(null);
    this.injectedPostId.set(null);
    this.activeFeed.set(this.createInitialFeed());
    this.toasts.set([]);
    this.logs.set([
      {
        id: ++this.nextLogId,
        timestamp: this.formatStepTime(0),
        retentionDelta: 'Reset',
        message: 'Algoritmo zerado. O feed voltou ao equilíbrio inicial.',
        tone: 'neutral',
      },
    ]);
  }

  protected vectorLabel(category: FeedPost['category']): string {
    if (category === 'neutro') return 'Neutro';
    return VECTOR_LABELS[category];
  }

  private createInitialFeed(): readonly FeedPost[] {
    const byId = new Map(ALGORITHM_POSTS.map((p) => [p.id, p]));
    return [byId.get('c-1')!, byId.get('a-1')!, byId.get('k-1')!];
  }

  private resolveTargetVector(post: FeedPost, reaction: ReactionType): FeedVector {
    if (post.category !== 'neutro') {
      return post.category;
    }
    if (reaction === 'indignar') return 'antipolitica';
    if (reaction === 'compartilhar') return 'conspiracao';
    return 'ciencia';
  }

  private updateFeedAfterInteraction(
    reactedPostId: string,
    targetVector: FeedVector,
    nextPolarization: number,
  ): void {
    const current = this.activeFeed();
    const dominant = this.dominantVector();
    const desiredLevel: 1 | 2 | 3 = nextPolarization >= 72 ? 3 : nextPolarization > 50 ? 2 : 1;

    const currentIds = new Set(current.map((p) => p.id));
    const injected = this.pickPost(
      nextPolarization > 50 ? dominant : targetVector,
      desiredLevel,
      currentIds,
    );
    this.injectedPostId.set(injected.id);

    if (nextPolarization > 50) {
      const used = new Set<string>([injected.id]);
      const second = this.pickPost(dominant, nextPolarization >= 65 ? 3 : 2, used);
      used.add(second.id);
      const third = this.pickPost(dominant, 2, used);
      this.activeFeed.set([injected, second, third]);
      return;
    }

    const remaining = current.filter((p) => p.id !== reactedPostId);
    this.activeFeed.set([injected, ...remaining].slice(0, 3));
  }

  private pickPost(vector: FeedVector, minLevel: 1 | 2 | 3, excludeIds: Set<string>): FeedPost {
    const vectorPosts = ALGORITHM_POSTS.filter((p) => p.category === vector);
    const highLevelFresh = vectorPosts.filter((p) => p.level >= minLevel && !excludeIds.has(p.id));
    const anyFresh = vectorPosts.filter((p) => !excludeIds.has(p.id));
    const highLevelAny = vectorPosts.filter((p) => p.level >= minLevel);

    const candidates =
      highLevelFresh.length > 0
        ? highLevelFresh
        : anyFresh.length > 0
          ? anyFresh
          : highLevelAny.length > 0
            ? highLevelAny
            : vectorPosts;

    this.poolCursor = (this.poolCursor + 1) % candidates.length;
    return candidates[this.poolCursor];
  }

  private appendLog(
    targetVector: FeedVector,
    reaction: ReactionType,
    delta: number,
    nextPolarization: number,
  ): void {
    const suppressed =
      targetVector === 'ciencia' ? 'conspirações e cortes antipolíticos' : 'fontes científicas';
    const injectedLabel =
      nextPolarization > 50
        ? `trazendo posts extremos de ${VECTOR_LABELS[targetVector]} (bolha fechada)`
        : `reforçando o tema ${VECTOR_LABELS[targetVector]}`;

    const entry: TelemetryLog = {
      id: ++this.nextLogId,
      timestamp: this.formatStepTime(this.totalInteractions()),
      retentionDelta: `+${delta}% retenção`,
      message: `Clique em "${REACTION_LABELS[reaction]}": escondendo ${suppressed} e ${injectedLabel}.`,
      tone: reaction === 'indignar' || nextPolarization > 50 ? 'alert' : 'acid',
    };

    this.logs.update((prev) => [entry, ...prev].slice(0, 8));
  }

  private spawnRetentionToast(vector: FeedVector, reaction: ReactionType): void {
    const bank = RETENTION_TOASTS[vector];
    const text = bank[this.totalInteractions() % bank.length];
    const id = ++this.nextToastId;
    const tone: 'acid' | 'alert' =
      vector === 'ciencia' && reaction !== 'indignar' ? 'acid' : 'alert';

    this.toasts.update((prev) => [{ id, text, tone }, ...prev].slice(0, 2));

    const timer = setTimeout(() => {
      this.toasts.update((prev) => prev.filter((t) => t.id !== id));
      this.toastTimers.delete(id);
    }, 4200);
    this.toastTimers.set(id, timer);
  }

  private clearAllToastTimers(): void {
    for (const timer of this.toastTimers.values()) {
      clearTimeout(timer);
    }
    this.toastTimers.clear();
  }

  private formatStepTime(step: number): string {
    const secs = step * 8;
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }
}
