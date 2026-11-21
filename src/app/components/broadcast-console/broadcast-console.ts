import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  BROADCAST_CHANNELS,
  BroadcastChannel,
  TV_NETWORKS,
  TvNetwork,
} from '../../data/experiment.data';

@Component({
  selector: 'app-broadcast-console',
  templateUrl: './broadcast-console.html',
})
export class BroadcastConsoleComponent {
  private readonly destroyRef = inject(DestroyRef);
  private flashTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly channels: readonly BroadcastChannel[] = BROADCAST_CHANNELS;
  protected readonly networks: readonly TvNetwork[] = TV_NETWORKS;

  protected readonly activeChannelIndex = signal<number>(0);
  protected readonly activeNetworkIndex = signal<number>(0);
  protected readonly switchCount = signal<number>(0);
  protected readonly isSwitchingStatic = signal<boolean>(false);

  protected readonly currentChannel = computed(() => this.channels[this.activeChannelIndex()]);
  protected readonly currentNetwork = computed(() => this.networks[this.activeNetworkIndex()]);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.flashTimer !== null) {
        clearTimeout(this.flashTimer);
      }
    });
  }

  protected selectChannel(index: number): void {
    this.activeChannelIndex.set(index);
  }

  protected switchBroadcaster(): void {
    this.activeNetworkIndex.update((i) => (i + 1) % this.networks.length);
    this.switchCount.update((c) => c + 1);
    this.isSwitchingStatic.set(true);

    if (this.flashTimer !== null) {
      clearTimeout(this.flashTimer);
    }
    this.flashTimer = setTimeout(() => {
      this.isSwitchingStatic.set(false);
      this.flashTimer = null;
    }, 260);
  }
}
