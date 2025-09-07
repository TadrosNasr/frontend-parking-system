import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getGates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/gates`);
  }

  getZones(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/zones`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/categories`);
  }

  getSubscription(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscriptions/${id}`);
  }

  checkin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/checkin`, data);
  }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/checkout`, data);
  }

  getTicket(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/${id}`);
  }

  getParkingState(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/reports/parking-state`);
  }

  updateCategoryRates(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/categories/${id}`, data);
  }

  openZone(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/zones/${id}/open`, data);
  }

  addRushHour(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/rush-hours`, data);
  }

  addVacation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/vacations`, data);
  }

  getAdminSubscriptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/subscriptions`);
  }
}
