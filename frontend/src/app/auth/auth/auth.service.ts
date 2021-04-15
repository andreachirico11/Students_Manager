import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dbUrl = environment.dbUrl;

  get loggedUser(): IUser | null {
    return (JSON.parse(localStorage.getItem('loggedUser')) as IUser) || null;
  }

  get isUserLogged(): boolean {
    return this.loggedUser ? true : false;
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<IUser[]>(this.dbUrl + 'users').pipe(
      map((users) => {
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
          localStorage.setItem('loggedUser', JSON.stringify(found));
          return true;
        }
        return false;
      })
    );
  }
}
