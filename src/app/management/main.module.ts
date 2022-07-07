import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mainRoutes } from './main.routes';
import { RouterModule } from '@angular/router';
import { TemplateComponent } from './template.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { UtilityService } from '../services/utility.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { TopBarComponent } from '../shared/top-bar/top-bar.component';

@NgModule({
  declarations: [TemplateComponent, SidebarComponent, TopBarComponent],
  imports: [
    CommonModule,
    CollapseModule,
    RouterModule.forChild(mainRoutes),
  ],
  providers: [
    UtilityService, AuthService, NotificationService
  ]
})
export class MainModule { }
