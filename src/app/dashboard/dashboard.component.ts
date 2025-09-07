import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  gates: any[] = [];
  zones: any[] = [];
  categories: any[] = [];

  constructor(private api: ApiService) {}

  async ngOnInit(): Promise<void> {
    
    (await this.api.getGates()).subscribe((data: any[]) => this.gates = data, error => console.error('Error fetching gates:', error)
);
    (await this.api.getZones()).subscribe((data: any[]) => this.zones = data);
    (await this.api.getCategories()).subscribe((data: any[]) => this.categories = data);
}
}
