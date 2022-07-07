import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';


@Component({
  selector: 'app-role',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  role: any = {
  };
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  rolesForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  roleList: any=[];
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  constructor(private data: SidebarService,private service: SharedService, private modalService: BsModalService
    ,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.initializeAddEditForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }

  initializeForm() {
    this.rolesForm = new FormGroup({
      Name: new FormControl('')
    });
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      Id: new FormControl(),
      Name: new FormControl('', [Validators.required]),
      Description: new FormControl(''),  
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
  loadData() {
    this.service.get('/app-role/get-list-paging?filter=' + this.rolesForm.get('Name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.roleList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  showAdd() {
    this.role = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/app-role/detail/' + id).subscribe((response: any) => {
      this.role = response;
      this.addEditForm.patchValue({
        Id: this.role.Id,
        Name: this.role.Name,
        Description: this.role.Description
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.role.Id == undefined)
      {
        this.role = this.addEditForm.value;
        delete this.role.Id;
        this.service.post('/app-role/add', JSON.stringify(this.role)).subscribe((response: any) => {
          this.role = response;
          this.modalAddEdit.hide();
          this.role = {};
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/app-role/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.role = response;
          this.modalAddEdit.hide();
          this.role = {};
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
    }
  }
  deleteItem(id: any) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, ()=> {
      this.deleteItemConfirm(id);
    })
  }
  deleteItemConfirm(id: any) {
    this.service.delete('/app-role/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
    })
    this.loadData();
  }
}
