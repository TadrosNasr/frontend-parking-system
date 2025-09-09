import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  private buildAuthOptions() {
    const token = localStorage.getItem('token');
    if (!token) return {};
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return { headers };
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getGates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/gates`, this.buildAuthOptions());
  }

  getZones(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/zones`, this.buildAuthOptions());
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/master/categories`, this.buildAuthOptions());
  }

  getSubscription(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscriptions/${id}`, this.buildAuthOptions());
  }

  checkin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/checkin`, data, this.buildAuthOptions());
  }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tickets/checkout`, data, this.buildAuthOptions());
  }

  getTicket(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/${id}`, this.buildAuthOptions());
  }

  getParkingState(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/reports/parking-state`, this.buildAuthOptions());
  }

  updateCategoryRates(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/categories/${id}`, data, this.buildAuthOptions());
  }

  openZone(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/zones/${id}/open`, data, this.buildAuthOptions());
  }

  addRushHour(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/rush-hours`, data, this.buildAuthOptions());
  }

  addVacation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/vacations`, data, this.buildAuthOptions());
  }

  getReports(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/reports`, this.buildAuthOptions());
  }

  getAdminSubscriptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/subscriptions`, this.buildAuthOptions());
  }

  getAvailableSlots(zoneId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/zones/${zoneId}/slots`, this.buildAuthOptions());
  }
}
