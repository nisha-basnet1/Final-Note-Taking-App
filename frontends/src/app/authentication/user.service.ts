import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  private BASE_URL = `${environment.API_URL}/users`;

  constructor() {}

  public profile = () => {
    return this.httpClient.get(`${this.BASE_URL}/profile`);
  };

  updateProfile(profileData: any): Observable<any> {
    return this.httpClient.put(`${this.BASE_URL}/update-profile`, profileData);
  }

  changeProfilePicture(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('profile', file, file.name);

    return this.httpClient.put(
      `${this.BASE_URL}/change-profile-picture`,
      formData
    );
  }
}
