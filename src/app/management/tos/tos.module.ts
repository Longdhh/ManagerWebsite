import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageTosComponent } from './manage-tos.component';
import { RouterModule, Routes } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

export const routes: Routes = [
  { path: '', component: ManageTosComponent }
];

@NgModule({
  declarations: [ManageTosComponent],
  imports: [
    CommonModule,
    PaginationModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule,
    CKEditorModule,
  ],
  providers: [AuthService, SharedService]
})
export class TosModule { }
