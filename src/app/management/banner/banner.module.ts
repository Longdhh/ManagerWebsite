import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HomeSlideComponent } from './banner.component';
import { UploadService } from 'src/app/services/upload.service';

export const routes: Routes = [
  { path: '', component: HomeSlideComponent }
];

@NgModule({
  declarations: [HomeSlideComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ModalModule
  ],
  providers: [
    SharedService, UploadService
  ]
})
export class BannerModule { }
