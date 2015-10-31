import {Component, Validators, CORE_DIRECTIVES} from 'angular2/angular2';
import {FORM_DIRECTIVES, ControlGroup, Control} from 'angular2/angular2';

import {TodoService, Todo} from '../../services/todo_service';
import {Autofocus} from '../../directives/Autofocus';
import {CustomOrderByPipe} from '../../pipes/CustomOrderByPipe';

@Component({
  selector: 'todo',
  templateUrl: './components/todo/todo.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, Autofocus],
  pipes: [CustomOrderByPipe]
})
export class TodoCmp {

  todoForm: ControlGroup;

  constructor(private todoService: TodoService) {
    this.todoForm = new ControlGroup({
      title: new Control('', Validators.required)
    });
  }

  addOne(todo: Todo) {
    this.todoService.addOne(todo);
    (<Control>this.todoForm.controls['title']).updateValue('');
  }

  removeOne(todo: Todo) {
    this.todoService.removeOne(todo.id);
  }

  find(): Todo[] {
    return this.todoService.find();
  }
}
