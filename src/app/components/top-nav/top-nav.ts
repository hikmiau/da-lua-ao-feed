import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NAV_STATIONS, NavStation } from '../../data/experiment.data';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.html',
})
export class TopNavComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly stations: readonly NavStation[] = NAV_STATIONS;
  protected readonly scrollProgress = signal(0);
  protected readonly activeStation = signal<string>('estacao-1');

  protected readonly isDarkStation = computed(() => this.activeStation() === 'estacao-3');

  ngOnInit(): void {
    const updateScroll = (): void => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      this.scrollProgress.set(pct);

      const viewportMid = scrollTop + window.innerHeight * 0.35;
      let current = this.stations[0].id;
      for (const station of this.stations) {
        const el = document.getElementById(station.id);
        if (el && el.offsetTop <= viewportMid) {
          current = station.id;
        }
      }
      this.activeStation.set(current);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    });
  }

  protected scrollToStation(id: string): void {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
