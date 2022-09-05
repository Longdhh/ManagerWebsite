import { Component, OnInit } from '@angular/core';
import { SystemConstants } from 'src/app/common/system.constants';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSideBarOpen: boolean;
  isInfoOpen = false;
  isUserOpen = false;
  isTextOpen = false;
  pageElement: HTMLElement;
  constructor(private data: SidebarService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.data.isSideBarOpen.subscribe(data => this.isSideBarOpen = data);
    this.pageElement = document.querySelector<HTMLElement>('.page')
  }

  adjustPage() {
    this.pageElement = document.querySelector<HTMLElement>('.page')
    if(this.isSideBarOpen) {
      this.pageElement.style.left = '350px';
      this.pageElement.style.width = 'calc(100% - 350px)';
    } else {
      this.pageElement.style.left = '60px';
      this.pageElement.style.width = 'calc(100% - 60px)';
    }
  }

  toggleSidebar() {
    this.data.changeState(!this.isSideBarOpen);
    if(this.isSideBarOpen === false && this.isInfoOpen === true) {
      this.isInfoOpen = false;
    }
    if(this.isSideBarOpen === false && this.isUserOpen === true) {
      this.isUserOpen = false;
    }
    if(this.isSideBarOpen === false && this.isTextOpen === true) {
      this.isTextOpen = false;
    }
    this.toggleSideBarActive();
  }

  toggleSideBarActive() {
    if(this.isSideBarOpen) {
      document.querySelector('.sidebar').classList.add('active');
    } else {
      document.querySelector('.sidebar').classList.remove('active');
    }
    this.adjustPage();
  }


  toggleUserSubMenu() {
    this.isUserOpen = !this.isUserOpen;
    if(this.isUserOpen === true && this.isSideBarOpen === false) {
      this.data.changeState(true);
    }
    this.toggleSideBarActive();
  }

  toggleInfoSubMenu() {
    this.isInfoOpen = !this.isInfoOpen;
    if(this.isInfoOpen === true && this.isSideBarOpen === false) {
      this.data.changeState(true);
    }
    this.toggleSideBarActive();
  }
  toggleTextSubMenu() {
    this.isTextOpen = !this.isTextOpen;
    if(this.isTextOpen === true && this.isSideBarOpen === false) {
      this.data.changeState(true);
    }
    this.toggleSideBarActive();
  }
  reset() {
    this.data.changeState(false);
  }
  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.utilityService.navigateToLogin();
  }
}
