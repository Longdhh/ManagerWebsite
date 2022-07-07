import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionComponent } from './function.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TreeviewModule } from 'ngx-treeview';

export const routes: Routes = [
  { path: '', component: FunctionComponent }
];

@NgModule({
  declarations: [
    FunctionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule,
    PaginationModule,
    FormsModule,
    TreeviewModule.forRoot()
  ]
})
export class FunctionModule { }
