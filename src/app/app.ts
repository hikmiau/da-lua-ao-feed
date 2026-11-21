import { Component } from '@angular/core';
import { AlgorithmLabComponent } from './components/algorithm-lab/algorithm-lab';
import { BroadcastConsoleComponent } from './components/broadcast-console/broadcast-console';
import { LiveAuditComponent } from './components/live-audit/live-audit';
import { SiteFooterComponent } from './components/site-footer/site-footer';
import { TimeMorphHeroComponent } from './components/time-morph-hero/time-morph-hero';
import { TopNavComponent } from './components/top-nav/top-nav';

@Component({
  selector: 'app-root',
  imports: [
    TopNavComponent,
    TimeMorphHeroComponent,
    BroadcastConsoleComponent,
    AlgorithmLabComponent,
    LiveAuditComponent,
    SiteFooterComponent,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
