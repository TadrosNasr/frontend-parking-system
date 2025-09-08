
import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'employee', component: EmployeeComponent, canActivate: [authGuard] },
	{ path: 'admin', component: AdminComponent, canActivate: [authGuard] },
	// Add more routes for gates, zones, categories, subscriptions, tickets as needed
];
// ...existing code...
