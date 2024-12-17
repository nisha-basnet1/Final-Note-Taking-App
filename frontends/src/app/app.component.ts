import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { UserService } from './authentication/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected authUser: any;

  constructor(
    public authService: AuthenticationService,
    private _userService: UserService,
    private _router: Router
  ) {
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authUser = this.authService.authenticatedUser.getValue();
      this._router.navigate(['/dashboard']);
    }
  }
}
