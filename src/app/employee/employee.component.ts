// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-employee-dashboard',
//   standalone: true,
//   templateUrl: './employee.component.html',
//   styleUrls: ['./employee.component.css'],
//   imports: [CommonModule, FormsModule]
// })
// export class EmployeeComponent implements OnInit {
//   gates: any;
//   zones: any;
//   categories: any;
//   selectedZone: any; // For parking slots
//   selectedCheckinZone: any; // For check-in/out
//   parkingSlots: any;
//   selectedSlot: any;
//   licensePlate: string = '';
//   checkInZone: any;
//   recentActivity: any;
//   searchTerm: string = '';
//   selectedTicket: any;
//   availableSlots: number = 0;
//   allZonesParkingState: any[] = [];

//   constructor(public api: ApiService) {}

//   ngOnInit() {
//     this.refreshSlots();
//   }

//   getGates() {
//     this.api.getGates().subscribe((data: any) => this.gates = data);
//   }

//   getZones() {
//     this.api.getZones().subscribe((data: any) => this.zones = data);
//   }

//   getCategories() {
//     this.api.getCategories().subscribe((data: any) => this.categories = data);
//   }

//   loadParkingSlots(zoneId?: string) {
//     this.api.getParkingState().subscribe((data: any[]) => {
//       this.allZonesParkingState = data;
//       if (zoneId) {
//         console.log('zoneId', zoneId);
//         const zone = data.find((z: any) => z.zoneId === zoneId);
//         // If zone.slots is undefined, use an empty array
//         this.parkingSlots = zone && Array.isArray(zone.slots) ? zone.slots : [];
//         this.availableSlots = zone ? zone.free : 0;
//         // Also update selectedZone with full zone object for template
//         this.selectedZone = zone || this.selectedZone;
//       } else {
//         this.availableSlots = data.reduce((sum, zone) => sum + (zone.free || 0), 0);
//         this.parkingSlots = [];
//       }
//     });
//   }

//   refreshSlots() {
//     const zoneId = this.selectedZone?.zoneId || this.selectedZone?.id;
//     if (zoneId) {
//       this.loadParkingSlots(zoneId);
//     } else {
//       this.loadParkingSlots(); // Will sum all free slots
//     }
//   }

//   selectSlot(slot: any) {
//     this.selectedSlot = slot;
//   }

//   // Update checkIn and checkOut to use correct zone and ticket logic
//   checkIn() {
//     const zoneId = this.selectedCheckinZone?.zoneId || this.selectedCheckinZone?.id;
//     if (!this.licensePlate || !zoneId) {
//       alert('Enter license plate and select zone');
//       return;
//     }
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('You are not logged in. Please log in again.');
//       return;
//     }
//     const zone = this.allZonesParkingState.find(z => z.zoneId === zoneId || z.id === zoneId);
//     if (zone && zone.free === 0) {
//       alert('No free slots available in this zone.');
//       return;
//     }
//     // Only send required fields to API
//     this.api.checkin({ licensePlate: this.licensePlate, zoneId }).subscribe({
//       next: (data: any) => {
//         this.recentActivity = [data];
//         alert('Check-in successful!');
//         this.refreshSlots();
//       },
//       error: (err: any) => {
//         if (err.status === 401 || err.status === 403) {
//           alert('Authentication failed. Please log in again.');
//         } else if (err.error && err.error.message) {
//           alert('Check-in failed: ' + err.error.message);
//         } else {
//           alert('Check-in failed');
//         }
//       }
//     });
//   }

//   checkOut() {
//     if (!this.searchTerm) {
//         console.log('searchTerm', this.searchTerm);
//       alert('Enter ticket or license plate');
//       return;
//     }
//     this.api.checkout({ ticket: this.searchTerm }).subscribe({
//       next: (data: any) => {
//         this.recentActivity = [data];
//         alert('Check-out successful!');
//         this.refreshSlots();
//       },
//       error: (err: any) => {
//         if (err.status === 401 || err.status === 403) {
//           alert('Authentication failed. Please log in again.');
//         } else if (err.error && err.error.message) {
//           alert('Check-out failed: ' + err.error.message);
//         } else {
//           alert('Check-out failed');
//         }
//       }
//     });
//   }

//   searchTicket() {
//     if (!this.searchTerm) return alert('Enter ticket or license plate');
//     this.api.getTicket(this.searchTerm).subscribe({
//       next: (data: any) => {
//         this.selectedTicket = data;
//       },
//       error: () => alert('Ticket not found')
//     });
//   }

//   printTicket(ticket: any) {
//     window.print();
//   }

//   extendParking(ticket: any) {
//     alert('Extend parking for ticket: ' + ticket.id);
//     // Implement API call if available
//   }
// }

// === FILE: src/app/employee/employee.component.ts ===
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EmployeeComponent implements OnInit {
  gates: any[] = [];
  zones: any[] = [];
  categories: any[] = [];

  selectedZone: any = null;
  selectedCheckinZone: any = null;

  parkingSlots: any[] = [];
  selectedSlot: any = null;
  licensePlate: string = '';
  checkInZone: any = null;
  recentActivity: any[] = [];
  searchTerm: string = '';
  selectedTicket: any = null;
  availableSlots: number = 0;
  allZonesParkingState: any[] = [];

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.getGates();
    this.getZones();
    this.getCategories();
    this.refreshSlots();
  }

  getGates() {
    this.api.getGates().subscribe({
      next: (data: any) => this.gates = Array.isArray(data) ? data : [],
      error: () => this.gates = []
    });
  }

  getZones() {
    this.api.getZones().subscribe({
      next: (data: any) => this.zones = Array.isArray(data) ? data : [],
      error: () => this.zones = []
    });
  }

  getCategories() {
    this.api.getCategories().subscribe({
      next: (data: any) => this.categories = Array.isArray(data) ? data : [],
      error: () => this.categories = []
    });
  }

  loadParkingSlots(zoneId?: string) {
    this.api.getParkingState().subscribe({
      next: (data: any[]) => {
        this.allZonesParkingState = Array.isArray(data) ? data : [];

        if (zoneId) {
          const zone = this.allZonesParkingState.find((z: any) => z.zoneId === zoneId || z.id === zoneId);
          this.parkingSlots = zone && Array.isArray(zone.slots) ? zone.slots : [];
          this.availableSlots = zone ? (zone.free ?? zone.available ?? 0) : 0;
          if (zone) {
            this.selectedZone = { ...this.selectedZone, ...zone };
          }
        } else {
          this.availableSlots = this.allZonesParkingState.reduce((sum: number, z: any) => sum + (z.free ?? z.available ?? 0), 0);
          this.parkingSlots = [];
        }
      },
      error: (err: any) => {
        console.error('Failed to load parking state', err);
        this.allZonesParkingState = [];
        this.parkingSlots = [];
        this.availableSlots = 0;
      }
    });
  }

  refreshSlots() {
    const zoneId = this.selectedZone?.zoneId ?? this.selectedZone?.id ?? null;
    if (!this.zones || this.zones.length === 0) {
      this.getZones();
    }
    if (zoneId) {
      this.loadParkingSlots(zoneId);
    } else {
      this.loadParkingSlots();
    }
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
  }

  checkIn() {
    const zoneId = this.selectedCheckinZone?.zoneId ?? this.selectedCheckinZone?.id ?? null;
    if (!this.licensePlate || !zoneId) {
      alert('Enter license plate and select zone');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in again.');
      return;
    }

    const zone = this.allZonesParkingState.find(z => z.zoneId === zoneId || z.id === zoneId);
    if (zone && (zone.free ?? zone.available ?? 0) === 0) {
      alert('No free slots available in this zone.');
      return;
    }

    const payload = { ticketId: this.searchTerm };

    this.api.checkin(payload).subscribe({
      next: (data: any) => {
        const item = {
          type: 'checkin',
          licensePlate: data.licensePlate ?? this.licensePlate,
          zone: data.zone ?? (this.selectedCheckinZone?.name ?? this.selectedZone?.name ?? ''),
          time: data.checkInTime ?? new Date().toLocaleString()
        };
        this.recentActivity = [item, ...this.recentActivity].slice(0, 50);
        alert('Check-in successful!');
        this.licensePlate = '';
        this.selectedSlot = null;
        this.refreshSlots();
      },
      error: (err: any) => {
        console.error('checkin error', err);
        if (err.status === 404) {
          alert('Check-in API endpoint not found. Please contact admin.');
        } else if (err.status === 401 || err.status === 403) {
          alert('Authentication failed. Please log in again.');
        } else if (err.error && err.error.message) {
          alert('Check-in failed: ' + err.error.message);
        } else {
          alert('Check-in failed');
        }
      }
    });
  }

  checkOut() {
    if (!this.searchTerm) {
      alert('Enter ticket or license plate');
      return;
    }

    const payload = { ticket: this.searchTerm };

    this.api.checkout(payload).subscribe({
      next: (data: any) => {
        const item = {
          type: 'checkout',
          licensePlate: data.licensePlate ?? this.searchTerm,
          zone: data.zone ?? '',
          time: data.checkOutTime ?? new Date().toLocaleString()
        };
        this.recentActivity = [item, ...this.recentActivity].slice(0, 50);
        alert('Check-out successful!');
        this.searchTerm = '';
        this.selectedTicket = null;
        this.refreshSlots();
      },
      error: (err: any) => {
        console.error('checkout error', err);
        if (err.status === 401 || err.status === 403) {
          alert('Authentication failed. Please log in again.');
        } else if (err.error && err.error.message) {
          alert('Check-out failed: ' + err.error.message);
        } else {
          alert('Check-out failed');
        }
      }
    });
  }

  searchTicket() {
    if (!this.searchTerm) return alert('Enter ticket or license plate');

    this.selectedTicket = null;

    this.api.getTicket(this.searchTerm).subscribe({
      next: (data: any) => {
        this.selectedTicket = data;
      },
      error: (err: any) => {
        console.error('getTicket error', err);
        this.selectedTicket = null;
        alert('Ticket not found');
      }
    });
  }

  printTicket(ticket: any) {
    window.print();
  }

  extendParking(ticket: any) {
    alert('Extend parking for ticket: ' + (ticket?.id ?? 'unknown'));
  }
}
