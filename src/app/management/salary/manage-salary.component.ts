import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-manage-salary',
  templateUrl: './manage-salary.component.html',
  styleUrls: ['./manage-salary.component.css']
})
export class ManageSalaryComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  salaryForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  salaryList: any=[];
  salary: any;
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
    this.salaryForm = new FormGroup({
      name: new FormControl('')
    });

  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      salary_range_id: new FormControl(),
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
    this.service.get('/salary-range/get-all-paging?keyword=' + this.salaryForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.salaryList = response.Items;
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
    this.salary = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/salary-range/detail/' + id).subscribe((response: any) => {
      this.salary = response;
      this.addEditForm.patchValue({
        salary_range_id: this.salary.salary_range_id,
        name: this.salary.name,
        seo_alias: this.salary.seo_alias,
        seo_title: this.salary.seo_title,
        seo_description: this.salary.seo_description,
        status: this.salary.status
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.salary.salary_range_id == undefined)
      {
        this.salary = this.addEditForm.value;
        delete this.salary.salary_range_id;
        this.service.post('/salary-range/add', JSON.stringify(this.salary)).subscribe((response: any) => {
          this.salary = response;
          this.modalAddEdit.hide();
          this.salary = {};
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/salary-range/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.salary = response;
          this.modalAddEdit.hide();
          this.salary = {};
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
    this.service.delete('/salary-range/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })
  }
}
