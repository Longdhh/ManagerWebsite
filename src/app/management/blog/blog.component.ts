import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UtilityService } from 'src/app/services/utility.service';
import * as CustomBuild from '../../shared/ckeditor/build/ckeditor.js';
import { Title } from '@angular/platform-browser';
import { UploadAdapter } from 'src/adapters/upload-adapter';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  @ViewChild('avatar') avatar
  addEditForm: FormGroup;
  blogForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  public Editor = CustomBuild;
  blogList: any = [];
  blogCategoryList: any =[];
  blog: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  keyword: any='';
  status= null;
  blogLink = "http://localhost:4200/main/blog/blog-info/index/"
  public config = {
    shouldNotGroupWhenFull: true
  }
  constructor(private utilityService: UtilityService, private service: SharedService, private route: ActivatedRoute,
    private notificationService: NotificationService, private data: SidebarService, private title: Title, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeAddEditForm();
    
    this.route.queryParams
      .subscribe(params => {
        this.keyword = params.keyword;
        this.blogForm.patchValue({
          name: this.keyword
        })
      }
    );
    this.title.setTitle("Quản lý blog")
    this.loadData();
    this.service.get('/blog-category/get-all').subscribe((response: any) => {
      this.blogCategoryList = response
    })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }
  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
      return new UploadAdapter( loader );
  };
  }
  
  initializeForm() {
    this.blogForm = new FormGroup({
      name: new FormControl('')
    });
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      blog_id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      avatar: new FormControl(),
      seo_alias: new FormControl('', [Validators.required]),
      seo_title: new FormControl(''),
      blog_category_id: new FormControl(),
      description: new FormControl(''),
      status: new FormControl(null),
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
      this.blogForm.patchValue({
        name: '',
      })
    }
    this.service.get('/blog/get-all-paging?keyword=' + this.blogForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.blogList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  showAdd() {
    this.blog = {};
    this.initializeAddEditForm();
    this.status = null;
    this.modalAddEdit.show();
  }

  showEdit(id: string) {
    this.service.get('/blog/detail/' + id).subscribe((response: any) => {
      this.blog = response;
      this.addEditForm.patchValue({
        blog_id: this.blog.blog_id,
        name: this.blog.name,
        avatar: this.blog.avatar,
        seo_alias: this.blog.seo_alias,
        seo_title: this.blog.seo_title,
        blog_category_id: this.blog.blog_category_id,
        seo_description: this.blog.seo_description,
        description: this.blog.description,
        status: this.blog.status
      })
      this.status = this.blog.status;

      this.modalAddEdit.show();
    })
  }
  saveData(valid: boolean) {
    if(this.addEditForm.valid) {
      this.blog = this.addEditForm.value;
      let fi = this.avatar.nativeElement;
      if(fi.files.length > 0) {
        this.uploadService.postWithFile('/upload/save-image?type=blog', null, fi.files)
        .then((imageUrl: string ) => {
          this.blog.avatar = imageUrl;
        }).then(() => {
          this.saveChanges(valid);
        })
      } else {
        this.saveChanges(valid)
      }
    }
  }
  saveChanges(valid: boolean) {
    if(valid) {
      if(this.blog.blog_id == undefined)
      {
        this.blog = this.addEditForm.value;
        this.blog.status = false
        delete this.blog.blog_id;
        this.service.post('/blog/add', JSON.stringify(this.blog)).subscribe((response: any) => {
          this.blog = response;
          this.modalAddEdit.hide();
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
      else {
        this.service.put('/blog/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
          this.blog = response;
          this.modalAddEdit.hide();
          this.blog = {};
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      }
    }
  }
  changeStatus(id: any) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_PUBLISH_MSG, () => {
      this.service.put('/blog/status-change?id='+id).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.PUBLISH_SUCCESS_MSG);
        this.modalAddEdit.hide();
        this.loadData();
      })
    })
  }

  deleteItem(id: any) {
    this.notificationService.printConfirmationDialog(MessageConstants.DELETE_BLOG_MSG, ()=> {
      this.deleteItemConfirm(id);
    })
  }
  deleteItemConfirm(id: any) {
    this.service.delete('/blog/delete', 'id', id).subscribe((response: any)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_BLOG_MSG);
      this.loadData();
    })
  }
}
