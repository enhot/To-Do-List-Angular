import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { IToDo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly url: string = 'https://jsonplaceholder.typicode.com/todos';

  public getData<T>(limit: number = 10): Observable<T> {
    return this.http.get<T>(`${this.url}?_limit=${limit}`);
  }

  public postTodo<T>(title: string): Observable<T> {
    return this.http.post<T>(this.url, {
      title,
      completed: false,
      userId: 1,
    });
  }

  public patchToggleTask<T>(id: number, completed: boolean): Observable<T> {
    return this.http.patch<T>(`${this.url}/${id}`, {
      completed: !completed,
    });
  }

  public patchTitleTask<T>(id: number, body: Partial<IToDo>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${id}`, body);
  }

  public deleteTask<T>(id: number): Observable<T> {
    return this.http.delete<T>(`${this.url}/${id}`);
  }
}
