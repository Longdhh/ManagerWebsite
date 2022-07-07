import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLevelComponent } from './manage-level.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

export const routes: Routes = [
  { path: '', component: ManageLevelComponent }
];

@NgModule({
  declarations: [ManageLevelComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModalModule,
    PaginationModule,
    FormsModule
  ],
  providers: [
    SharedService
  ]
})
export class LevelModule { }
