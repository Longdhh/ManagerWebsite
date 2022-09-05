import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.css']
})
export class BlogCategoryComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  blogCategoryForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  blogCategoryList: any =[];
  blogCategory: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  keyword: any='';

  constructor(private utilityService: UtilityService, private service: SharedService, private route: ActivatedRoute,
    private notificationService: NotificationService, private data: SidebarService, private title: Title ) {
    
   }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddEditForm();
    
    this.route.queryParams
      .subscribe(params => {
        this.keyword = params.keyword;
        this.blogCategoryForm.patchValue({
          name: this.keyword
        })
      }
    );
    this.title.setTitle("Quản lý phân loại blog")
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
    this.blogCategoryForm = new FormGroup({
      name: new FormControl('')
    });
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      blog_category_id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      seo_alias: new FormControl('', [Validators.required]),
      seo_title: new FormControl(''),
      seo_description: new FormControl(''),
      status: new FormControl(),
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
      this.blogCategoryForm.patchValue({
        name: ''
      })
    }
    this.service.get('/blog-category/get-all-paging?keyword=' + this.blogCategoryForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.blogCategoryList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  showAdd() {
    this.blogCategory = {};
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/blog-category/detail/' + id).subscribe((response: any) => {
      this.blogCategory = response;
      this.addEditForm.patchValue({
        blog_category_id: this.blogCategory.blog_category_id,
        name: this.blogCategory.name,
        seo_alias: this.blogCategory.seo_alias,
        seo_title: this.blogCategory.seo_title,
        seo_description: this.blogCategory.seo_description,
        status: this.blogCategory.status
      })
      this.modalAddEdit.show();
    })
  }
  saveChanges(valid: boolean) {
    if(valid) {
      if(this.blogCategory.blog_category_id == undefined)
      {
        this.blogCategory = this.addEditForm.value;
        delete this.blogCategory.blog_category_id;
        this.service.post('/blog-category/add', JSON.stringify(this.blogCategory)).subscribe((response: any) => {
          this.blogCategoryList = response;
          this.modalAddEdit.hide();
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/blog-category/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.blogCategory = response;
          this.modalAddEdit.hide();
          this.blogCategory = {};
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
    this.service.delete('/blog-category/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })
  }
}
