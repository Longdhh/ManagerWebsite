import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemConstants } from '../common/system.constants';
import { AuthService } from './auth.service';
import { catchError, throwError} from 'rxjs';
import { NotificationService } from './notification.service';
import { MessageConstants } from '../common/message.constants';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private headers = new HttpHeaders;
  constructor(private http: HttpClient, private authenService: AuthService, private notificationService: NotificationService,
  private utilityService: UtilityService) {
      this.headers = this.headers.set('Content-Type', 'application/json');
      this.headers = this.headers.set("Authorization", "Bearer " + authenService.getLoggedInUser().access_token);
  }
  get(uri: string) {
    return this.http.get<any>(SystemConstants.BASE_API + uri,  {headers: this.headers}).pipe(catchError(this.handleError));
  }
  post(uri: string, data? : any) {
    return this.http.post(SystemConstants.BASE_API + uri, data, {headers: this.headers}).pipe(catchError(this.handleError));
  }
  put(uri: string, data? : any) {
    return this.http.put(SystemConstants.BASE_API + uri, data, {headers: this. headers}).pipe(catchError(this.handleError));
  }
  delete(uri: string, key: string, id: string) {
    return this.http.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, {headers: this. headers}).pipe(catchError(this.handleError));
  }
  postFile(uri: string, data? : any) {
    let newHeader = new HttpHeaders();
    newHeader.set("Authorization", "Bearer " + this.authenService.getLoggedInUser().access_token);
    return this.http.post(SystemConstants.BASE_API + uri, data, {headers: newHeader}).pipe(catchError(this.handleError));
  }
  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this.notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MSG);
      this.utilityService.navigateToLogin();
    }
    else if (error.status == 403) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this.notificationService.printErrorMessage(MessageConstants.FORBIDDEN);
      this.utilityService.navigateToLogin();
    }
    else {
      let errMsg = JSON.parse(error._body).Message;
      this.notificationService.printErrorMessage(errMsg);

      return throwError(errMsg);
    }
  }
}

