import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { UploadService } from 'src/app/services/upload.service';

export const routes: Routes = [
  { path: '', component: UserComponent }
];

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PaginationModule,
    FormsModule,
    ModalModule,
    NgSelectModule, 
  ],
  providers: [
    SharedService, UploadService
  ]
})
export class UserModule { }
