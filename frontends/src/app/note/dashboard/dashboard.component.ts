import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any;
  notes: any[] = [];
  pagination: any = {};

  constructor(private _noteService: NoteService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getNotes();
  }

  getNotes(page: number = 1, limit: number = 10): void {
    this._noteService.getAllNotes(page, limit).subscribe({
      next: (response) => {
        this.notes = response.data;
        this.pagination = response.pagination;
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
      },
    });
  }

  deleteNote(noteId: string): void {
    this._noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter((note) => note._id !== noteId);
      },
      error: (error) => {
        console.error('Error deleting note:', error);
      },
    });
  }

  // Handle pagination: Go to the previous page
  prevPage(): void {
    if (this.pagination.page > 1) {
      this.getNotes(this.pagination.page - 1, this.pagination.limit);
    }
  }

  // Handle pagination: Go to the next page 
  nextPage(): void {
    if (this.pagination.page < this.pagination.totalPages) {
      this.getNotes(this.pagination.page + 1, this.pagination.limit);
    }
  }
}
