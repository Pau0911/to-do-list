import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Storage} from '@ionic/storage-angular';
import {TaskModel} from '../model/task.model';
import {CategoryModel} from '../model/category.model';
import {UUIDTypes} from "uuid";

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private categories: CategoryModel[] = [];
  private categoriesSubject = new BehaviorSubject<CategoryModel[]>(this.categories);
  categories$ = this.categoriesSubject.asObservable();
  private tasks: TaskModel[] = [];
  private tasksSubject = new BehaviorSubject<TaskModel[]>(this.tasks);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private storage: Storage) {
    this.init()
  }

  async init() {
    this.storage = await this.storage.create();
    this.tasks = (await this.storage.get('tasks')) || [];
    this.categories = (await this.storage.get('categories')) || [];

    const hasDefaultCategory = this.categories.some((category: CategoryModel) => category.name === 'Sin Categoría');
    if (!hasDefaultCategory) {
      const defaultCategory: CategoryModel = {id: "123-W", name: 'Sin Categoría'};
      this.categories.push(defaultCategory);
      await this.storage.set('categories', this.categories);
    }
    this.tasksSubject.next(this.tasks);
    this.categoriesSubject.next(this.categories);
  }

  async addCategory(name: string): Promise<CategoryModel | undefined> {
    const newCategory = this.categories.find((c) => c.name === name);
    if (!newCategory) {
      const category: CategoryModel = {id: crypto.randomUUID(), name};
      this.categories.push(category);
      this.categoriesSubject.next(this.categories);
      await this.storage.set('categories', this.categories);
    }
    return newCategory;
  }

  async deleteCategory(categoryId: UUIDTypes): Promise<boolean> {
    const hasAssociatedTasks = this.tasks.some((task) => task.category.id === categoryId);
    if (hasAssociatedTasks) {
      return false;
    }
    this.categories = this.categories.filter((category) => category.id !== categoryId);
    this.categoriesSubject.next(this.categories);
    await this.storage.set('categories', this.categories);
    return true;
  }

  async updateCategory(updatedCategory: CategoryModel): Promise<void> {
    this.categories = this.categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    await this.storage.set('categories', this.categories);
    this.categoriesSubject.next(this.categories);
    this.tasks = this.tasks.map((task) =>
      task.category.id === updatedCategory.id
        ? {...task, category: updatedCategory}
        : task
    );
    await this.storage.set('tasks', this.tasks);
    this.tasksSubject.next(this.tasks);
  }

  async addTask(name: string, category: CategoryModel): Promise<void> {
    const task: TaskModel = {
      id: crypto.randomUUID(),
      name,
      completed: false,
      category,
    };
    this.tasks.push(task);
    await this.storage.set('tasks', this.tasks);
    this.tasksSubject.next(this.tasks);
  }

  async deleteTask(taskId: UUIDTypes): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    await this.storage.set('tasks', this.tasks);
    this.tasksSubject.next(this.tasks);

  }

  async toggleTaskCompletion(taskId: UUIDTypes): Promise<void> {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? {...task, completed: !task.completed} : task
    );
    await this.updateTasks(this.tasks)
  }

  async updateTask(updatedTask: TaskModel): Promise<void> {
    this.tasks = this.tasks.map((task) => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      return task;
    });
    await this.updateTasks(this.tasks)
  }

  async updateTasks(task: TaskModel[]) {
    await this.storage.set('tasks', task);
    this.tasksSubject.next(task);
  }

}
