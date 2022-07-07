import { Component, OnInit } from '@angular/core';
import { SystemConstants } from 'src/app/common/system.constants';
import { LoggedInUser } from 'src/app/domain/loggedin.user';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  user: LoggedInUser;
  avatarUrl: string = SystemConstants.BASE_SERVER;
  constructor() { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER))
  }

}
