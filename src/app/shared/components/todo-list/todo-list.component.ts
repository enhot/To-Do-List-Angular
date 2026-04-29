import { Component, input, output } from '@angular/core';
import { IToDo } from '../../models/todo.interface';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  public toDoList = input<IToDo[]>([]);
  public delete = output<number>();
  public checked = output<number>();
  public edit = output<IToDo>();
}
