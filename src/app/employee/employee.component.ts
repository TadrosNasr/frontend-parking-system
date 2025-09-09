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
  selectedGate: any = null;
  lastCheckoutInfo: { licensePlate?: string; zone?: string; checkoutTime?: string } = {};
  lastCheckinInfo: { licensePlate?: string; zone?: string; checkinTime?: string } = {};
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

  ticketSearchError: string = '';

  constructor(public api: ApiService) {}

  ngOnInit() {
    this.getGates();
    this.getZones();
    this.getCategories();
    this.refreshSlots();
  }

  setDefaultGate() {
    if (this.gates && this.gates.length > 0 && !this.selectedGate) {
      this.selectedGate = this.gates[0];
    }
  }

  getGates() {
    this.api.getGates().subscribe({
      next: (data: any) => {
        this.gates = Array.isArray(data) ? data : [];
        this.setDefaultGate();
      },
      error: () => {
        this.gates = [];
        this.selectedGate = null;
      }
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
    const gateId = this.gates && this.gates.length > 0 ? (this.selectedGate?.id ?? this.gates[0]?.id) : null;
    const duplicate = this.recentActivity.some(a => a.type === 'checkin' && a.licensePlate === this.licensePlate && !a.checkedOut);
    
    if (duplicate) {
    alert('This license plate is already checked in.');
    return;
    }
    if (!this.licensePlate || !zoneId || !gateId) {
      alert('Enter license plate, select zone, and gate');
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

    const type = 'visitor';
    const payload: any = {
      gateId,
      zoneId,
      type,
      licensePlate: this.licensePlate
    };

    this.api.checkin(payload).subscribe({
      next: (data: any) => {
        const ticket = data.ticket || {};
        const ticketId = ticket.id ?? '';
        const item = {
          type: 'checkin',
          licensePlate: ticket.licensePlate ?? this.licensePlate,
          zone: ticket.zoneId ?? this.selectedCheckinZone?.name ?? this.selectedZone?.name ?? '',
          time: ticket.checkinAt ?? new Date().toLocaleString(),
          ticketId
        };
        let zoneName = '';
        if (ticket.zoneId && this.zones && this.zones.length > 0) {
          const zoneObj = this.zones.find(z => z.id === ticket.zoneId || z.zoneId === ticket.zoneId);
          zoneName = zoneObj?.name ?? ticket.zoneId;
        } else {
          zoneName = item.zone;
        }
        this.lastCheckinInfo = {
          licensePlate: item.licensePlate,
          zone: zoneName,
          checkinTime: item.time
        };
        this.recentActivity = [item, ...this.recentActivity].slice(0, 50);
        alert('Check-in successful! Ticket ID: ' + ticketId);
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
    if (!this.licensePlate) {
      alert('Enter ticket ID to check out');
      return;
    }


    this.api.getTicket(this.licensePlate).subscribe({
      next: (ticket: any) => {
        const payload = { ticketId: ticket.id };
        this.api.checkout(payload).subscribe({
          next: (data: any) => {
            const item = {
              type: 'checkout',
              licensePlate: ticket.licensePlate ?? this.licensePlate,
              zone: ticket.zoneId ?? '',
              time: data.checkoutAt ?? new Date().toLocaleString()
            };
            this.lastCheckoutInfo = {
              licensePlate: item.licensePlate,
              zone: item.zone,
              checkoutTime: item.time
            };
            this.recentActivity = [item, ...this.recentActivity].slice(0, 50);
            alert('Check-out successful!');
            this.licensePlate = '';
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
      },
      error: (err: any) => {
        console.error('getTicket error', err);
        alert('Ticket not found. Please check the license plate.');
      }
    });
  }

  searchTicket() {
    if (!this.searchTerm) return alert('Enter ticket ID');

    this.selectedTicket = null;
    this.ticketSearchError = '';

    this.api.getTicket(this.searchTerm).subscribe({
      next: (data: any) => {
        this.selectedTicket = data;
        this.ticketSearchError = '';
      },
      error: (err: any) => {
        console.error('getTicket error', err);
        this.selectedTicket = null;
        this.ticketSearchError = 'No ticket found. Try searching with a different ticket ID.';
      }
    });
  }

printTicket() {
  const printContents = document.getElementById('ticket-info-card')?.innerHTML;
  if (printContents) {
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow!.document.write('<html><head><title>Print Ticket</title>');
    printWindow!.document.write('<style>body{font-family:sans-serif;} .card{border:1px solid #ccc;padding:16px;margin:16px;} </style>');
    printWindow!.document.write('</head><body >');
    printWindow!.document.write(printContents);
    printWindow!.document.write('</body></html>');
    printWindow!.document.close();
    printWindow!.focus();
    setTimeout(() => { printWindow!.print(); printWindow!.close(); }, 500);
  }
}

  extendParking(ticket: any) {
    alert('Extend parking for ticket: ' + (ticket?.id ?? 'unknown'));
  }
}
