import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BlogCategoryComponent } from './blog-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedService } from 'src/app/services/shared.service';

export const routes: Routes = [
  { path: '', component: BlogCategoryComponent }
];


@NgModule({
  declarations: [BlogCategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ModalModule,
    PaginationModule,
    FormsModule,
    CKEditorModule,
  ],
  providers: [SharedService]
})
export class BlogCategoryModule { }
