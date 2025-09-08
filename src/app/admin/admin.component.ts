import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, JsonPipe]
})
export class AdminComponent {
  parkingState: any;
  categories: any;
  reports: any;
  zones: any;
  subscriptions: any;
  getZones() {
    this.api.getZones().subscribe((data: any) => this.zones = data);
  }

  toggleZone(zone: any) {
    const action = zone.open ? 'close' : 'open';
    this.api.openZone(zone.id, { open: !zone.open }).subscribe({
      next: () => {
        alert(`Zone ${zone.name} ${action}d!`);
        this.getZones();
      },
      error: () => {
        alert(`Failed to ${action} zone.`);
      }
    });
  }

  addRushHour() {
    const start = prompt('Rush hour start (e.g. 08:00):');
    const end = prompt('Rush hour end (e.g. 10:00):');
    if (start && end) {
      this.api.addRushHour({ start, end }).subscribe({
        next: () => alert('Rush hour added!'),
        error: () => alert('Failed to add rush hour.')
      });
    }
  }

  addVacation() {
    const date = prompt('Vacation date (YYYY-MM-DD):');
    if (date) {
      this.api.addVacation({ date }).subscribe({
        next: () => alert('Vacation added!'),
        error: () => alert('Failed to add vacation.')
      });
    }
  }

  getSubscriptions() {
    this.api.getAdminSubscriptions().subscribe({
      next: (data: any) => this.subscriptions = data,
      error: () => this.subscriptions = { error: 'Failed to load subscriptions' }
    });
  }

  constructor(public api: ApiService) {}

  getParkingState() {
    this.api.getParkingState().subscribe((data: any) => this.parkingState = data);
  }

  getCategories() {
    this.api.getCategories().subscribe((data: any) => this.categories = data);
  }

  editCategory(cat: any) {
    const newRate = prompt(`Edit rate for ${cat.name}:`, cat.rate);
    if (newRate !== null && newRate !== '' && !isNaN(Number(newRate))) {
    this.api.updateCategoryRates(cat.id, { 
        user: localStorage.getItem('user') || '',
      rateNormal: Number(newRate), 
      rateSpecial: cat.rateSpecial, 
      name: cat.name, 
      description: cat.description 
    }).subscribe({
      next: () => {
          alert('Rate updated!');
          this.getCategories();
        },
        error: () => {
          alert('Failed to update rate.');
        }
      });
    }
  }

//   getReports() {
//     this.api.getReports().subscribe({
//       next: (data: any) => {
//         this.reports = data;
//       },
//       error: () => {
//         this.reports = { error: 'Failed to load reports' };
//       }
//     });
//   }


    async ngOnInit(): Promise<void> {
      this.getParkingState();
      this.getCategories();
      this.getZones();
      this.getSubscriptions();
    }
}
