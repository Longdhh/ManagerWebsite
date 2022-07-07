import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-manage-tos',
  templateUrl: './manage-tos.component.html',
  styleUrls: ['./manage-tos.component.css']
})
export class ManageTosComponent implements OnInit {
  @ViewChild('modalEdit', {static: false}) public modalEdit: ModalDirective;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  Editor: any;
  tos: any;
  tosList: any=[];
  editForm: FormGroup;
  
  constructor(private service: SharedService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.initializeEditForm();
  }
  initializeEditForm() {
    this.editForm = new FormGroup({
      tos_id: new FormControl(),
      description: new FormControl()
    });
  }
  adjustPage() {
    if(this.isSideBarOpen) {
      this.pageElement.style.left = '350px';
      this.pageElement.style.width = 'calc(100% - 350px)';
    } else {
      this.pageElement.style.left = '60px';
      this.pageElement.style.width = 'calc(100% - 60px)';
    }
  }
  showEdit(id: string) {
    this.service.get('/tos/detail/' + id).subscribe((response: any) => {
      this.tos = response;
      this.editForm.patchValue({
        tos_id: this.tos.tos_id,
        name: this.tos.name,
        seo_alias: this.tos.seo_alias,
        seo_title: this.tos.seo_title,
        seo_description: this.tos.seo_description,
        status: this.tos.status
      })
      this.modalEdit.show();
    })
  }
  saveChanges(valid: boolean) {
    if(valid) {
      this.service.put('/tos/update', JSON.stringify(this.editForm.value)).subscribe((response: any) => {
        this.tos = response;
        this.modalEdit.hide();
        this.tos = {};
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.loadData();
      }, error => this.service.handleError(error))
    }
  }
  loadData() {
    this.service.get('/tos/get-all')
      .subscribe((response: any) => {
      })
  }
}
