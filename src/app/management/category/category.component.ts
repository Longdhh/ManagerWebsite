import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  categoryForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  categoryList: any = [];
  category: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  keyword: any='';
  constructor(private data: SidebarService, private service: SharedService, private utilityService: UtilityService
    ,private notificationService: NotificationService,private route: ActivatedRoute, private title: Title) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddEditForm();
    
    this.route.queryParams
      .subscribe(params => {
        this.keyword = params.keyword;
        this.categoryForm.patchValue({
          name: this.keyword
        })
      }
    );
    this.title.setTitle("Quản lý danh mục")
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }
  initializeForm() {
    this.categoryForm = new FormGroup({
      name: new FormControl('')
    });
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      category_id: new FormControl(),
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
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
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
    if(this.keyword===undefined){
      this.keyword = ''
      this.categoryForm.patchValue({
        name: ''
      })
    }
    this.service.get('/category/get-all-paging?keyword=' + this.categoryForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.categoryList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  showAdd() {
    this.category = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/category/detail/' + id).subscribe((response: any) => {
      this.category = response;
      this.addEditForm.patchValue({
        category_id: this.category.category_id,
        name: this.category.name,
        seo_alias: this.category.seo_alias,
        seo_title: this.category.seo_title,
        seo_description: this.category.seo_description,
        status: this.category.status
      })
      this.modalAddEdit.show();
    })
  }

  saveChanges(valid: boolean) {
    if(valid) {
      if(this.category.category_id == undefined)
      {
        this.category = this.addEditForm.value;
        delete this.category.category_id;
        this.service.post('/category/add', JSON.stringify(this.category)).subscribe((response: any) => {
          this.category = response;
          this.modalAddEdit.hide();
          console.log(response)
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/category/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.category = response;
          this.modalAddEdit.hide();
          this.category = {};
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
    this.service.delete('/category/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })
  }
}
