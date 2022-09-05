import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ModalDirective } from 'ngx-bootstrap/modal';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  levelForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  levelList: any=[];
  level: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  constructor(private data: SidebarService, private service: SharedService, private utilityService: UtilityService
    ,private notificationService: NotificationService, private title: Title) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.initializeAddEditForm();
    this.title.setTitle("Quản lý trình độ công việc")
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }

  initializeForm() {
    this.levelForm = new FormGroup({
      name: new FormControl('')
    });
  }

  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      level_id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      seo_alias: new FormControl('', [Validators.required]),
      seo_title: new FormControl(''),
      seo_description: new FormControl(''),
      status: new FormControl(false),
    });
  }
  createSeoTitle() {
    this.addEditForm.patchValue({
      seo_alias: this.utilityService.MakeSeoTitle(this.addEditForm.get('name').value)
    }) 
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
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  loadData() {
    this.service.get('/level/get-all-paging?keyword=' + this.levelForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.levelList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  showAdd() {
    this.level = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/level/detail/' + id).subscribe((response: any) => {
      this.level = response;
      this.addEditForm.patchValue({
        level_id: this.level.level_id,
        name: this.level.name,
        seo_alias: this.level.seo_alias,
        seo_title: this.level.seo_title,
        seo_description: this.level.seo_description,
        status: this.level.status
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.level.level_id == undefined)
      {
        this.level = this.addEditForm.value;
        delete this.level.level_id;
        this.service.post('/level/add', JSON.stringify(this.level)).subscribe((response: any) => {
          this.level = response;
          this.modalAddEdit.hide();
          this.level = {};
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/level/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.level = response;
          this.modalAddEdit.hide();
          this.level = {};
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
    this.service.delete('/level/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })
  }
}
