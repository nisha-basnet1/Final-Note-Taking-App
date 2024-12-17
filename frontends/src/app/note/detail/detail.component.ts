import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../note.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  note: any = {
    _id: '',
    title: '',
    content: '',
    images: [],
    createdBy: {},
    modifiedBy: {},
  };
  isEditMode: boolean = false;
  noteId:string ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    // Get note ID from route params
    this.noteId = this.route.snapshot.paramMap.get('id');
    if (this.noteId) {
      this.getNoteDetails(this.noteId);
    }
  }

  // Fetch the note details from the server
  getNoteDetails(noteId: string): void {
    this.noteService.getNoteDetails(this.noteId).subscribe({
      next: (response) => {
        if (response.success) {
          this.note = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching note details:', error);
      },
    });
  }

  // Switch to edit mode
  editNote(): void {
    this.isEditMode = true;
  }

  // Save the updated note
  saveNote(): void {
    this.noteService.updateNote(this.noteId,this.note).subscribe({
      next: () => {
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error saving note:', error);
      },
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.isEditMode = false;
    this.getNoteDetails(this.note._id); // Reset the changes by fetching the original note
  }
}
