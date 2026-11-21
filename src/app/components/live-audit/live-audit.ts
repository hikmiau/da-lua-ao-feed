import { Component, computed, signal } from '@angular/core';
import {
  AUDIT_PRESETS,
  AUDIT_PROFILES,
  AuditOption,
  AuditPreset,
  AuditProfile,
  NEWS_FORMAT_OPTIONS,
  OPPOSING_VIEW_OPTIONS,
  SECOND_SCREEN_OPTIONS,
} from '../../data/experiment.data';

interface GaugeTick {
  readonly value: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly labelX: number;
  readonly labelY: number;
  readonly major: boolean;
}

const CX = 180;
const CY = 176;
const RADIUS = 132;
const SEMI_CIRCUMFERENCE = Math.PI * RADIUS;

function buildGaugeTicks(): readonly GaugeTick[] {
  const ticks: GaugeTick[] = [];
  for (let v = 0; v <= 100; v += 10) {
    const angleRad = Math.PI - (v / 100) * Math.PI;
    const major = v === 0 || v === 50 || v === 100;
    const innerR = major ? RADIUS - 20 : RADIUS - 12;
    const outerR = RADIUS - 2;
    const labelR = RADIUS + 18;
    ticks.push({
      value: v,
      x1: CX + Math.cos(angleRad) * innerR,
      y1: CY - Math.sin(angleRad) * innerR,
      x2: CX + Math.cos(angleRad) * outerR,
      y2: CY - Math.sin(angleRad) * outerR,
      labelX: CX + Math.cos(angleRad) * labelR,
      labelY: CY - Math.sin(angleRad) * labelR + 4,
      major,
    });
  }
  return ticks;
}

@Component({
  selector: 'app-live-audit',
  templateUrl: './live-audit.html',
})
export class LiveAuditComponent {
  protected readonly presets: readonly AuditPreset[] = AUDIT_PRESETS;
  protected readonly secondScreenOptions: readonly AuditOption[] = SECOND_SCREEN_OPTIONS;
  protected readonly newsFormatOptions: readonly AuditOption[] = NEWS_FORMAT_OPTIONS;
  protected readonly opposingViewOptions: readonly AuditOption[] = OPPOSING_VIEW_OPTIONS;
  protected readonly gaugeTicks: readonly GaugeTick[] = buildGaugeTicks();
  protected readonly arcLength = SEMI_CIRCUMFERENCE;

  protected readonly screenHours = signal<number>(6);
  protected readonly secondScreenIndex = signal<number>(1);
  protected readonly newsFormatIndex = signal<number>(1);
  protected readonly opposingViewIndex = signal<number>(1);

  protected readonly totalScore = computed<number>(() => {
    const hoursScore = Math.round(((this.screenHours() - 1) / 11) * 25);
    const secondScore = this.secondScreenOptions[this.secondScreenIndex()].score;
    const newsScore = this.newsFormatOptions[this.newsFormatIndex()].score;
    const opposingScore = this.opposingViewOptions[this.opposingViewIndex()].score;
    return Math.min(100, Math.max(0, hoursScore + secondScore + newsScore + opposingScore));
  });

  protected readonly currentProfile = computed<AuditProfile>(() => {
    const score = this.totalScore();
    if (score <= 33) return AUDIT_PROFILES[0];
    if (score <= 66) return AUDIT_PROFILES[1];
    return AUDIT_PROFILES[2];
  });

  protected readonly needleRotation = computed(() => -90 + (this.totalScore() / 100) * 180);

  protected readonly activeArcDashOffset = computed(
    () => SEMI_CIRCUMFERENCE * (1 - this.totalScore() / 100),
  );

  protected isPresetActive(preset: AuditPreset): boolean {
    return (
      this.screenHours() === preset.hours &&
      this.secondScreenIndex() === preset.secondScreen &&
      this.newsFormatIndex() === preset.newsFormat &&
      this.opposingViewIndex() === preset.opposingView
    );
  }

  protected applyPreset(preset: AuditPreset): void {
    this.screenHours.set(preset.hours);
    this.secondScreenIndex.set(preset.secondScreen);
    this.newsFormatIndex.set(preset.newsFormat);
    this.opposingViewIndex.set(preset.opposingView);
  }

  protected onHoursChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.screenHours.set(Number(input.value));
  }
}
