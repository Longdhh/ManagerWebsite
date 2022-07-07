import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManageJobComponent } from './manage-job.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';


export const routes: Routes = [
  { path: '', component: ManageJobComponent }
];


@NgModule({
  declarations: [ManageJobComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModalModule,
    PaginationModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [
    SharedService
  ]
})
export class JobModule { }
