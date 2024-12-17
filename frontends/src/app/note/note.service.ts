import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = `${environment.API_URL}/notes`;

  constructor(private http: HttpClient) {}

  // Create a new note
  createNote(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, formData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update an existing note
  updateNote(noteId: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${noteId}`, formData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get details of a specific note
  getNoteDetails(noteId: string): Observable<any> {
    console.log('Getting details', noteId);
    return this.http.get<any>(`${this.apiUrl}/${noteId}`);
  }

  // Delete a specific note
  deleteNote(noteId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${noteId}`);
  }

  // Get all notes for a user with pagination and filters
  getAllNotes(
    page: number = 1,
    limit: number = 10,
    status?: string,
    title?: string,
    sortBy: string = 'title',
    sortOrder: string = 'asc'
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    if (status) params = params.append('status', status);
    if (title) params = params.append('title', title);
    params = params.append('sortBy', sortBy);
    params = params.append('sortOrder', sortOrder);

    return this.http.get<any>(this.apiUrl);
  }

}
