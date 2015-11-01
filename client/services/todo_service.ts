export interface Todo {
  id?: number;
  title: string;
  status?: string;
  createdAt?: number;
}

let counter = 0;

const data: Todo[] = [
  { id: ++counter, title: 'Angular2 Router', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Component', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Core Directives', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Custom Directives', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Dependence Injection', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Angular2 Form', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Include Development environment', status: 'done', createdAt: Date.now() },
  { id: ++counter, title: 'Include Production environment', status: 'pending', createdAt: Date.now() },
  { id: ++counter, title: 'Unit tests', status: 'done', createdAt: Date.now()}
];

// Our Todo Service that uses Store helper class for managing our state
export class TodoService {

  _todos: Todo[];

  constructor() {
    this._todos = data;
  }

  addOne(todo: Todo) {
    this._todos.push({
      id: ++counter,
      title: todo.title,
      status: 'pending',
      createdAt: Date.now()
    });
  }

  removeOne(id: number) {
    this._todos = this._todos.filter(el => el.id !== id);
  }

  find(): Todo[] {
    return this._todos;
  }
}
