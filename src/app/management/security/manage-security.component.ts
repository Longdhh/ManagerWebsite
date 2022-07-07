import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-manage-security',
  templateUrl: './manage-security.component.html',
  styleUrls: ['./manage-security.component.css']
})
export class ManageSecurityComponent implements OnInit {
  @ViewChild('modalEdit', {static: false}) public modalEdit: ModalDirective;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  Editor: any;
  security: any;
  securityList: any=[];
  editForm: FormGroup;
  constructor(private service: SharedService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }
  initializeEditForm() {
    this.editForm = new FormGroup({
      tos_id: new FormControl(),
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
    this.service.get('/security/detail/' + id).subscribe((response: any) => {
      this.security = response;
      this.editForm.patchValue({
        security_id: this.security.security_id,
        description: this.security.description
      })
      this.modalEdit.show();
    })
  }
  saveChanges(valid: boolean) {
    if(valid) {
      this.service.put('/security/update', JSON.stringify(this.editForm.value)).subscribe((response: any) => {
        this.security = response;
        this.modalEdit.hide();
        this.security = {};
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.loadData();
      }, error => this.service.handleError(error))
    }
  }
  loadData() {
    this.service.get('/security/get-all')
      .subscribe((response: any) => {
      })
  }
}
