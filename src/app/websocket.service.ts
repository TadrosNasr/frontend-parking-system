import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws: WebSocket | null = null;
  private subject = new Subject<any>();

  connect(url: string): void {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (event) => {
      this.subject.next(JSON.parse(event.data));
    };
    this.ws.onerror = (event) => {
      this.subject.error(event);
    };
    this.ws.onclose = () => {
      this.subject.complete();
    };
  }

  get messages$(): Observable<any> {
    return this.subject.asObservable();
  }

  send(data: any): void {
    if (this.ws) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
