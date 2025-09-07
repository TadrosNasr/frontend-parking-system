import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  totalgates: any[] = [];
  totalzones = 0
  totalcategories = 0;
  totalsubscriptions = 0;
  totaltickets = 0;
    constructor(private api: ApiService) {}
    async ngOnInit(): Promise<void> {
      (await this.api.getGates()).subscribe((data: any[]) => this.totalgates = data, error => console.error('Error fetching gates:', error)
);
      (await this.api.getZones()).subscribe((data: any[]) => this.totalzones = data.length);
      (await this.api.getCategories()).subscribe((data: any[]) => this.totalcategories = data.length);
   //   (await this.api.getSubscriptions()).subscribe((data: any[]) => this.totalsubscriptions = data.length);
     // (await this.api.getTickets()).subscribe((data: any[]) => this.totaltickets = data.length);
      console.log(this.totalgates);
    console.log(this.totalzones);
    console.log(this.totalcategories);
    console.log(this.totalsubscriptions);
    console.log(this.totaltickets);
    }
   
}
