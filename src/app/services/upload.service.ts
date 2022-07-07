import { Injectable } from '@angular/core';
import { UtilityService } from './utility.service';
import { SharedService } from './shared.service';

@Injectable()
export class UploadService {
  public responseData: any;
  
  constructor(private sharedService: SharedService, private utilityService: UtilityService) { }

  postWithFile(url: string, postData: any, files: File[]) {
    let formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    if (postData !== "" && postData !== undefined && postData !== null) {
      for (var property in postData) {
        if (postData.hasOwnProperty(property)) {
          formData.append(property, postData[property]);
        }
      }
    }
    var returnReponse = new Promise((resolve, reject) => {
      this.sharedService.postFile(url, formData).subscribe(
        res => {
          this.responseData = res;
          resolve(this.responseData);
        },
        error => this.sharedService.handleError(error)
      );
    });
    return returnReponse;
  }
}