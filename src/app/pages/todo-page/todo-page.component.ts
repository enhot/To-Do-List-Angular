import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { IToDo, Priority } from '../../shared/models/todo.interface';
import { catchError, EMPTY, Observable } from 'rxjs';

import { TodoListComponent } from '../../shared/components/todo-list/todo-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-page',
  imports: [TodoListComponent],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss',
})
export class TodoPageComponent implements OnInit {
  private apiService = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  public todoList = signal<IToDo[]>([]);
  public newTitle = signal<string>('');

  public filter = signal<'all' | 'completed' | 'active'>('all');
  public selectedPriority = signal<Priority>('medium');
  public priorityFilter = signal<Priority | 'all'>('all');

  public priorities: Priority[] = ['low', 'medium', 'high'];

  public filteredList = computed(() => {
    let list = this.todoList();
    const filter = this.filter();
    const priorityFilter = this.priorityFilter();

    if (filter === 'active') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);

    if (priorityFilter !== 'all') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    return list;
  });

  ngOnInit(): void {
    this.getData().subscribe((list) => {
      const listWithPriorities = list.map((task) => ({
        ...task,
        priority: this.priorities[Math.floor(Math.random() * 3)],
      }));
      return this.todoList.set(listWithPriorities);
    });
  }

  public getData(): Observable<IToDo[]> {
    return this.apiService
      .getData<IToDo[]>()
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  public addNewTask(): void {
    if (!this.newTitle().trim()) return;

    this.apiService.postTodo<IToDo>(this.newTitle()).subscribe((task) => {
      this.todoList.update((list) => [
        { ...task, priority: this.selectedPriority() },
        ...list,
      ]);
      this.newTitle.set('');
    });
  }

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.newTitle.set(value);
  }

  public deleteTask(id: number): void {
    this.apiService
      .deleteTask<IToDo>(id)
      .pipe(
        catchError((error) => {
          console.error('Таска не знайдена', error);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.todoList.update((list) => list.filter((data) => data.id !== id));
      });
  }

  public toggleCompleted(id: number): void {
    const todo = this.todoList().find((e) => e.id === id);

    if (!todo) return;

    this.apiService.patchToggleTask<IToDo>(id, todo.completed).subscribe(() => {
      this.todoList.update((list) => {
        return list.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        );
      });
    });
  }

  public editTask(todo: IToDo): void {
    this.apiService
      .patchTitleTask<IToDo>(todo.id, { title: todo.title })
      .subscribe(() => {
        this.todoList.update((list) => {
          return list.map((task) =>
            task.id === todo.id ? { ...task, title: todo.title } : task,
          );
        });
      });
  }

  public onFilterPriority(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Priority | 'all';
    this.priorityFilter.set(value);
  }
}
