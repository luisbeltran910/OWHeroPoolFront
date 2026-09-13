import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroSnapshotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`;

  /** Kicks off a fresh Blizzard scrape on the backend; resolves with its status message. */
  triggerScrape(): Observable<string> {
    return this.http.post(`${this.baseUrl}/scrape/run`, null, { responseType: 'text' });
  }
}
