
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let role: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    role = localStorage.getItem('role');
  }
  const url = route.routeConfig?.path;
  if (!role) {
    return false;
  }
  if (url === 'admin' && role !== 'admin') {
    return false;
  }
  if (url === 'employee' && role !== 'employee') {
    return false;
  }
  return true;
};
