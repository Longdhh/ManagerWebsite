import { Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { UploadService } from 'src/app/services/upload.service';
import { SystemConstants } from 'src/app/common/system.constants';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class HomeSlideComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  @ViewChild('homeSlideImage') homeSlideImage
  addEditForm: FormGroup;
  homeSlideForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  homeSlideList: any=[];
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  homeSlide: any;
  imageServer: string = SystemConstants.BASE_SERVER;
  constructor(private data: SidebarService, private service: SharedService, private notificationService: NotificationService,
    private uploadService: UploadService, private title: Title) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.initializeAddEditForm();
    this.title.setTitle("Quản lý slide trang chủ")
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }

  initializeForm() {
    this.homeSlideForm = new FormGroup({
      home_slide_name: new FormControl('', [Validators.required]),
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
    this.service.get('/home-slide/get-all-paging?keyword=' + this.homeSlideForm.get('home_slide_name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.homeSlideList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  } 
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      home_slide_id: new FormControl(),
      link: new FormControl(''),
      home_slide_name: new FormControl(''),
      home_slide_image: new FormControl(''),
      isShowing: new FormControl(false),
    });
  }
  showAdd() {
    this.initializeAddEditForm();
    this.modalAddEdit.show();
  }
  showEdit(id: number) {
    this.service.get('/home-slide/detail/' + id).subscribe((response: any) => {
      this.homeSlide = response;
      this.addEditForm.patchValue({
        home_slide_id: this.homeSlide.home_slide_id,
        link: this.homeSlide.link,
        home_slide_name: this.homeSlide.home_slide_name,
        home_slide_image: this.homeSlide.home_slide_image,
        isShowing: this.homeSlide.isShowing,
      })
      this.modalAddEdit.show();
    })
  }

  saveData() {
    if(this.addEditForm.valid) {
      this.homeSlide = this.addEditForm.value;
      let fi = this.homeSlideImage.nativeElement;
      if(fi.files.length > 0) {
        this.uploadService.postWithFile('/upload/save-image?type=homeslide', null, fi.files)
        .then((imageUrl: string ) => {
          this.homeSlide.home_slide_image = imageUrl;
        }).then(() => {
          this.saveChanges();
        })
      } else {
        this.saveChanges()
      }
    }
  }
  saveChanges() {
    if(this.homeSlide.home_slide_id == undefined)
    {
      this.homeSlide = this.addEditForm.value;
      delete this.homeSlide.home_slide_id;
      this.service.post('/home-slide/add', JSON.stringify(this.homeSlide)).subscribe((response: any) => {
        this.homeSlide = response;
        this.modalAddEdit.hide();
        this.homeSlide = {};
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.loadData();
      }, error => this.service.handleError(error))
    }
    else {
      this.service.put('/home-slide/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
        this.homeSlide = response;
        this.modalAddEdit.hide();
        this.homeSlide = {};
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.loadData();
      }, error => this.service.handleError(error))
    }
  }
  deleteItem(id: any) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, ()=> {
      this.deleteItemConfirm(id);
    })
  }
  deleteItemConfirm(id: any) {
    this.service.delete('/home-slide/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);
      this.loadData();
    })
  }
}
