import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-working-type',
  templateUrl: './working-type.component.html',
  styleUrls: ['./working-type.component.css']
})
export class WorkingTypeComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  workingTypeForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  workingTypeList: any=[];
  workingType: any;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public totalRow: number;
  constructor(private data: SidebarService, private service: SharedService, private utilityService: UtilityService,
      private notificationService: NotificationService) { }

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
    this.workingTypeForm = new FormGroup({
      name: new FormControl('')
    })
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      working_type_id: new FormControl(),
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
  loadData() {
    this.service.get('/working-type/get-all-paging?keyword=' + this.workingTypeForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.workingTypeList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  createSeoTitle() {
    this.addEditForm.patchValue({
      seo_alias: this.utilityService.MakeSeoTitle(this.addEditForm.get('name').value)
    }) 
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    console.log('123')
    this.loadData();
  }

  showAdd() {
    this.workingType = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/working-type/detail/' + id).subscribe((response: any) => {
      this.workingType = response;
      this.addEditForm.patchValue({
        working_type_id: this.workingType.working_type_id,
        name: this.workingType.name,
        seo_alias: this.workingType.seo_alias,
        seo_title: this.workingType.seo_title,
        seo_description: this.workingType.seo_description,
        status: this.workingType.status
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.workingType.working_type_id == undefined)
      {
        this.workingType = this.addEditForm.value;
        delete this.workingType.working_type_id;
        this.service.post('/working-type/add', JSON.stringify(this.workingType)).subscribe((response: any) => {
          this.workingType = response;
          this.modalAddEdit.hide();
          this.workingType = {};
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/working-type/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.workingType = response;
          this.modalAddEdit.hide();
          this.workingType = {};
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
    this.service.delete('/working-type/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })

  }
}
