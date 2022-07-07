import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-manage-welfare-type',
  templateUrl: './manage-welfare-type.component.html',
  styleUrls: ['./manage-welfare-type.component.css']
})
export class ManageWelfareTypeComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  welfareTypeForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  welfareTypeList: any=[];
  welfareType:any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  constructor(private data: SidebarService, private service: SharedService, private utilityService: UtilityService
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
    this.welfareTypeForm = new FormGroup({
      name: new FormControl('')
    });
  }

  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      welfare_type_id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      seo_alias: new FormControl('', [Validators.required]),
      seo_title: new FormControl(''),
      seo_description: new FormControl(''),
      status: new FormControl(false),
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
  createSeoTitle() {
    this.addEditForm.patchValue({
      seo_alias: this.utilityService.MakeSeoTitle(this.addEditForm.get('name').value)
    }) 
  }
  loadData() {
    this.service.get('/welfare-type/get-all-paging?keyword=' + this.welfareTypeForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.welfareTypeList = response.Items;
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
    this.welfareType = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/welfare-type/detail/' + id).subscribe((response: any) => {
      this.welfareType = response;
      this.addEditForm.patchValue({
        welfare_type_id: this.welfareType.welfare_type_id,
        name: this.welfareType.name,
        seo_alias: this.welfareType.seo_alias,
        seo_title: this.welfareType.seo_title,
        seo_description: this.welfareType.seo_description,
        status: this.welfareType.status
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.welfareType.welfare_type_id == undefined)
      {
        this.welfareType = this.addEditForm.value;
        delete this.welfareType.welfare_type_id;
        this.service.post('/welfare-type/add', JSON.stringify(this.welfareType)).subscribe((response: any) => {
          this.welfareType = response;
          this.modalAddEdit.hide();
          this.welfareType = {};
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/welfare-type/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.welfareType = response;
          this.modalAddEdit.hide();
          this.welfareType = {};
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
    this.service.delete('/welfare-type/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })

  }
}
