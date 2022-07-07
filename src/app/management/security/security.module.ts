import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSecurityComponent } from './manage-security.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

export const routes: Routes = [
  { path: '', component: ManageSecurityComponent }
];

@NgModule({
  declarations: [ManageSecurityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModalModule,
    PaginationModule,
    FormsModule,
    CKEditorModule,
  ],
  providers: []
})
export class SecurityModule { }
