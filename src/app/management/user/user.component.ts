import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageConstants } from 'src/app/common/message.constants';
import { SystemConstants } from 'src/app/common/system.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  @ViewChild('avatar') avatar
  addEditForm: FormGroup;
  userForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  userList: any=[];
  roleList: any=[];
  user: any;
  imgRoot: string = SystemConstants.BASE_SERVER;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  constructor(private data: SidebarService, private service: SharedService, private notificationService: NotificationService,
    private uploadService: UploadService, private titleService: Title) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.loadRoles();
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
    this.userForm = new FormGroup({
      name: new FormControl('')
    })
  }
  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      Id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      UserName: new FormControl('', [Validators.required]),
      PhoneNumber: new FormControl(''),
      address: new FormControl(''),
      province_id: new FormControl(),
      description: new FormControl(''),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      re_password: new FormControl('', [Validators.required]),
      avatar: new FormControl(''),
      roles: new FormControl([]),
      status: new FormControl(false),
    });
  }

  validateEqual(): boolean {
    if(this.addEditForm.get('password').value !== this.addEditForm.get('re_password').value) {
      return false;
    }
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
    this.service.get('/account/get-all-paging?filter=' + this.userForm.get('name').value + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.userList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })

  }
  loadRoles() {
    this.service.get('/app-role/get-all').subscribe((response: any)=> {
      for (let role of response) {
        this.roleList.push({ id: role.Name, name: role.Description });
      }
    })
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  showAdd() {
    this.initializeAddEditForm();
    this.modalAddEdit.show();
    this.avatar.nativeElement.value = "";
  }

  showEdit(id: string) {
    this.service.get('/account/detail/' + id).subscribe((response: any) => {
      this.user = response;
      this.avatar.nativeElement.value = "";
      this.addEditForm.patchValue({
        Id: this.user.Id,
        name: this.user.name,
        Email: this.user.Email,
        UserName: this.user.UserName,
        PhoneNumber: this.user.PhoneNumber,
        address: this.user.address,
        province_id: this.user.province_id,
        description: this.user.description,
        roles: this.user.roles,
        avatar: this.user.avatar,
        status: this.user.status
      })
      this.addEditForm.get('re_password').disable();
      this.addEditForm.get('Password').disable();
      this.modalAddEdit.show();
    })
  }

  saveData() {
    if(this.addEditForm.valid) {
      this.user = this.addEditForm.value;
      let fi = this.avatar.nativeElement;
      if(fi.files.length > 0) {
        this.uploadService.postWithFile('/upload/save-image?type=avatar', null, fi.files)
        .then((imageUrl: string ) => {
          this.user.avatar = imageUrl;
        }).then(() => {
          this.saveChanges();
        })
      } else {
        this.saveChanges()
      }
    }
  } 
  private saveChanges() {
    if(this.addEditForm.get('Id').value == undefined)
    {
      this.service.post('/account/add', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
        this.modalAddEdit.hide();
        this.loadData();

        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      }, error => this.service.handleError(error))
    }
    else {
      this.service.put('/account/update', JSON.stringify(this.addEditForm.value)).subscribe((response: any) => {
        this.modalAddEdit.hide();
        this.loadData();
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      }, error => this.service.handleError(error))
    }
  }
  deleteItem(id: any) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, ()=> {
      this.deleteItemConfirm(id);

    })
  }
  deleteItemConfirm(id: any) {
    this.service.delete('/account/delete', 'id', id).subscribe((response: Response)=>{
      this.notificationService.printSuccessMessage(MessageConstants.DELETE_OK_MSG);

      this.loadData();
    })
  }
}
