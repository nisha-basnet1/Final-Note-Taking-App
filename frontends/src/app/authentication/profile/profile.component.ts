import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private _userService: UserService, private _authService:AuthenticationService) {}

  profileData: any;
  editMode = false;
  editPicture = false;
  newProfileImage: File | null = null;

  ngOnInit(): void {
    this.getProfile();
  }

  public getProfile(): void {
    this._userService.profile().subscribe({
      next: (response: any) => {
        this.profileData = response.data;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      },
    });
  }

  // Toggle Edit Mode
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  // Cancel Editing Profile
  cancelEdit() {
    this.editMode = false;
  }

  // Save Profile Changes
  saveProfile() {
    this.updateProfile();
    this.editMode = false;
  }

  // Profile Picture Editing
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileData.profile = URL.createObjectURL(file);
      this.uploadProfileImage(file);
    }
  }

  // Trigger the file input click when icon is clicked
  onEditPictureClick() {
    this.fileInput.nativeElement.click();
  }

  // Save Profile Picture
  saveProfilePicture() {
    console.log('Profile picture saved:', this.profileData.profile);
    this.editPicture = false;
  }

  cancelEditPicture() {
    this.editPicture = false;
  }

  // Update profile details (First Name and Last Name)
  updateProfile() {
    const updatedData = {
      firstName: this.profileData.firstName,
      lastName: this.profileData.lastName,
    };

    this._userService.updateProfile(updatedData).subscribe({
      next: (response) => {
        console.log('Profile updated successfully');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      },
    });
  }

  // Handle profile image file selection and upload
  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newProfileImage = file;
      // Immediately upload the selected image without showing any modal
      this.uploadProfileImage(file);
    }
  }

  // Upload new profile image
  uploadProfileImage(file: File) {
    this._userService.changeProfilePicture(file).subscribe({
      next: (response) => {
        this.getProfile();

        const user = {
          name: this.profileData.name,
          profile: this.profileData.profile,
          email: this.profileData.email
        };
        this._authService.authenticatedUser.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
      },
    });
  }
}
