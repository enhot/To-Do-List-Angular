import { Component, input, output, signal } from '@angular/core';
import { IToDo } from '../../models/todo.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [NgClass],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  public todo = input.required<IToDo>();
  public delete = output<number>();
  public checked = output<number>();
  public edit = output<IToDo>();

  public isEditing = signal(false);
  public editValue = signal('');

  public startEditTitle(): void {
    this.isEditing.set(true);

    this.editValue.set(this.todo().title);
  }

  public saveEditTitle(): void {
    this.edit.emit({ ...this.todo(), title: this.editValue() });
    this.isEditing.set(false);
  }

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.editValue.set(value);
  }
}
