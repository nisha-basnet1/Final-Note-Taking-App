import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NoteService } from '../note.service';
import { Router } from '@angular/router';
import { ImagePreviewPipe } from '../../core/image-preview.pipe';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImagePreviewPipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  notForm: FormGroup;
  selectedImages: File[] = [];
  maxImages = 5;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private _noteService: NoteService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.notForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  onImageSelect(event: any): void {
    const files = event.target.files;

    // Validate number of images
    if (this.selectedImages.length + files.length > this.maxImages) {
      alert(`You can only upload a maximum of ${this.maxImages} images.`);
      return;
    }

    // Validate file types and sizes
    for (let file of files) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        alert('Image size should not exceed 5MB.');
        return;
      }

      this.selectedImages.push(file);
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.notForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }
  
    const noteData = this.notForm.value;
  
    this._noteService.createNote(noteData).subscribe({
      next: (response) => {
        this.errorMessage = ''; // Clear any previous error messages
        this.notForm.reset();
        this._router.navigate(['/dashboard']); 
      },
      error: (error) => {
        console.error('Error registering:', error);
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  // Getter methods for easy access in template
  get title() {
    return this.notForm.get('title');
  }
  get content() {
    return this.notForm.get('content');
  }
}
