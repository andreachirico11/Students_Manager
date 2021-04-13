import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLogged: Observable<boolean>;
  public loaded = true;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.loaded = false;
    this.auth.autoLogin().subscribe(() => {
      this.loaded = true;
    });
  }
}
