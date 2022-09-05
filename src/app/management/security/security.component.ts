import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageConstants } from 'src/app/common/message.constants';
import { NotificationService } from 'src/app/services/notification.service';
import { SharedService } from 'src/app/services/shared.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import * as CustomBuild from '../../shared/ckeditor/build/ckeditor.js';

@Component({
  selector: 'app-manage-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  isSideBarOpen: boolean;
  pageElement: HTMLElement;
  public Editor = CustomBuild
  security: any;
  editForm: FormGroup;
  constructor(private data: SidebarService,private service: SharedService, private notificationService: NotificationService) { }

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        // editor.ui.editor.addCss( 'body { background-color: red; }' ),
        editor.ui.getEditableElement(),
    );
  }

  ngOnInit(): void {
    this.initializeEditForm();
    this.loadData();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pageElement = document.querySelector<HTMLElement>('.page');
      this.data.isSideBarOpen.subscribe(data => {this.isSideBarOpen = data});
      this.adjustPage();
    }, 1)
  }
  initializeEditForm() {
    this.editForm = new FormGroup({
      public_text_id: new FormControl(),
      title: new FormControl(),
      description: new FormControl(),
      status: new FormControl()
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
  saveChanges(valid: boolean) {
    if(valid) {
      this.service.put('/public-text/update', JSON.stringify(this.editForm.value)).subscribe((response: any) => {
        this.security = response;
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.loadData();
      }, error => this.service.handleError(error))
    }
  }
  loadData() {
    this.service.get('/public-text/get/3')
      .subscribe((response: any) => {
        this.security = response
        this.editForm.patchValue({
          public_text_id: this.security.public_text_id,
          title: this.security.title,
          description: this.security.description,
          status: true
        })
      })
  }
}
