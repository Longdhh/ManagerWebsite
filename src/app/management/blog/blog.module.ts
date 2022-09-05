import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedService } from 'src/app/services/shared.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { UploadService } from 'src/app/services/upload.service';

export const routes: Routes = [
  { path: '', component: BlogComponent }
];


@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule,
    PaginationModule,
    FormsModule,
    CKEditorModule,
    NgSelectModule,
  ],
  providers: [SharedService, UploadService]
})
export class BlogModule { }
