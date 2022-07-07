import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private data = new BehaviorSubject<boolean>(false);
  isSideBarOpen = this.data.asObservable();

  constructor() { }
  
  changeState(state: boolean) {
    this.data.next(state);
  }
}
