import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { SidebarService } from '../../services/sidebar.service';
import { SharedService } from '../../services/shared.service';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  @ViewChild('modalAddEdit', {static: false}) public modalAddEdit: ModalDirective;
  addEditForm: FormGroup;
  jobForm: FormGroup;
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  jobList: any=[];
  categoryList: any=[];
  job: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageDisplay: number = 10;
  totalRow: number;
  keyword: string = '';
  welfares: any=[];
  welfareTypeList: any=[];
  jobCategories: any=[];
  company: any;
  salaryRange: any;
  province: any;
  level: any;
  workingType: any;
  status: string;
  constructor(private data: SidebarService, private service: SharedService ,private notificationService: NotificationService,
     private title: Title) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
    this.initializeAddEditForm();
    this.title.setTitle("Quản lý công việc")
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }

  initializeForm() {
    this.jobForm = new FormGroup({
      name: new FormControl('')
    });
  }

  initializeAddEditForm() {
    this.addEditForm = new FormGroup({
      job_id: new FormControl(),
      company: new FormControl(),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      seo_alias: new FormControl(),
      province: new FormControl(),
      level: new FormControl(),
      working_type: new FormControl(),
      salary_range: new FormControl(),
      welfares: new FormArray([]),
      job_categories: new FormControl([]),
      address: new FormControl(''),
      status: new FormControl(),
      job_end_date: new FormControl(),
      job_view_count: new FormControl(),
      job_requirement: new FormControl(),
      created_at: new FormControl(),
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
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  loadData() {
    this.service.get('/job/get-all-pending-and-active-paging?keyword=' + this.keyword + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.jobList = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      })
  }
  showEdit(id: string) {
    this.welfares= this.addEditForm.get('welfares') as FormArray;
    this.welfares.clear();
    this.service.get('/job/get-welfares/' + id).subscribe((response: any) => {
      this.service.get('/welfare-type/get-all').subscribe(data => {
        this.welfareTypeList = data;
        for(let item of response) {
          let welfareType = this.welfareTypeList.find(x=> x.welfare_type_id === item.welfare_type_id)
          this.welfares.push(new FormGroup({
            description: new FormControl(item.description),
            welfare_type: new FormControl(welfareType.name),
          }))
        }
      })
    })
    this.service.get('/job/get-categories/' + id).subscribe((response: any) => {
      this.service.get('/category/get-all').subscribe(data => {
        this.jobCategories = [];
        this.categoryList=data;
        for(let item of response) {
          this.jobCategories.push(this.categoryList.find(x=> x.category_id == item.category_id))
        }
        this.addEditForm.patchValue({
          job_categories: this.jobCategories
        })
      })
    })
    this.service.get('/job/detail/' + id).subscribe((response: any) => {
      this.job = response;
      this.service.get('/company/detail/' + this.job.Id).subscribe((response:any) => {
        this.company=response;
      })
      this.service.get('/salary-range/detail/' + this.job.salary_range_id).subscribe((response:any) => {
        this.salaryRange=response;
      })
      this.service.get('/province/detail/' + this.job.province_id).subscribe((response:any)  => {
        this.province=response;
      })
      this.service.get('/level/detail/' + this.job.level_id).subscribe((response:any)  => {
        this.level=response;
      })
      this.service.get('/working-type/detail/' + this.job.working_type_id).subscribe((response:any) => {
        this.workingType=response;
      })
      this.service.get('/company/detail/' + this.job.Id).subscribe((data: any)=> {
        this.company = data
        this.status = this.job.status;
        this.addEditForm.patchValue({
          job_id: this.job.job_id,
          name: this.job.name,
          description: this.job.description,
          province: this.province.name,
          seo_alias: this.job.seo_alias,
          level: this.level.name,
          working_type: this.workingType.name,
          salary_range: this.salaryRange.name,
          job_end_date: moment(new Date(this.job.job_end_date)).format('DD/MM/YYYY'),
          job_view_count: this.job.job_view_count,
          job_requirement: this.job.job_requirement,
          address:this.job.address,
          status: this.job.status,
          created_at: moment(new Date(this.job.created_at)).format('DD/MM/YYYY'),
          company: this.company.name
        })
      })
      this.modalAddEdit.show();
    })

  }

  saveChanges() {
    if(this.job.status==="Active") {
      this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_UPDATE_MSG, ()=> {
        this.service.put('/job/unpublic-job?id='+this.job.job_id).subscribe((response: any) => {
          this.modalAddEdit.hide();
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      })
    }
    else {
      this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_UPDATE_MSG, ()=> {
        this.service.put('/job/public-job?id='+this.job.job_id).subscribe((response: any) => {
          this.modalAddEdit.hide();
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadData();
        }, error => this.service.handleError(error))
      })
    }
  }
}
