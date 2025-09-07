import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
	{ path: '', component: DashboardComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'admin', component: AdminComponent },
	// Add more routes for gates, zones, categories, subscriptions, tickets as needed
];
// ...existing code...
