import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { SystemConstants } from "../common/system.constants";
import { URLConstants } from "../common/url.constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate(activateRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        if(localStorage.getItem(SystemConstants.CURRENT_USER)) {
            return true;
        }
        else {
            this.router.navigate([URLConstants.LOGIN], {queryParams: {
                returnUrl: routerState.url
            }});
            return false;
        }
    }
}