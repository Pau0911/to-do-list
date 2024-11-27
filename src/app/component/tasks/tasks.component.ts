import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StorageService} from '../../service/storage.service';
import {TaskModel} from '../../model/task.model';
import {CategoryModel} from '../../model/category.model';
import {initializeApp} from 'firebase/app';
import {fetchAndActivate, getRemoteConfig, getString} from 'firebase/remote-config';
import {environment} from '../../../environments/environment';
import {addIcons} from 'ionicons';
import {add, create, save, trash, pricetag, list} from 'ionicons/icons';
import {UUIDTypes} from "uuid";
import {MessageService} from "../../service/message.service";
import {CategoriesComponent} from "../categories/categories.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [IonicModule, NgFor, NgIf, FormsModule, CategoriesComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',

})
export class TasksComponent implements OnInit {
  tasks: TaskModel[] = [];
  categories: CategoryModel[] = [];
  newTask: string = '';
  showDeleteButton: boolean = false;
  editingTaskId: UUIDTypes = "";
  showTaskCard: boolean = false;
  presentingElement = null;

  constructor(private storageService: StorageService, private messageService: MessageService) {
    addIcons({add, create, trash, save, pricetag, list});

  }

  async ngOnInit() {
    await this.loadRemoteConfig();
    this.storageService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.storageService.categories$.subscribe(categories => {
      this.categories = categories;
    });
    // @ts-ignore
    this.presentingElement = document.querySelector('.ion-page');
  }


  async addTask() {
    if (this.newTask.trim()) {
      const defaultCategory = this.categories.find((cat) => cat.name === 'Sin Categoría');
      if (!defaultCategory) {
        return;
      }
      await this.storageService.addTask(this.newTask, defaultCategory);
      this.newTask = '';
      this.showTaskCard = false;
      await this.messageService.showMessage("¡Tarea creada !", "primary")
    }
  }

  async changeShowTaskCard() {
    this.showTaskCard = true;
  }

  async deleteTask(id: UUIDTypes) {
    await this.storageService.deleteTask(id);
  }

  async toggleCompletion(id: UUIDTypes) {
    await this.storageService.toggleTaskCompletion(id);
  }

  async editCategory(task: TaskModel, categoryId: UUIDTypes) {
    const category: CategoryModel | undefined = this.categories.find(c => c.id === categoryId);
    if (category) {
      task = {...task, category};
      await this.storageService.updateTask(task);
    }
  }

  editTask(task: TaskModel) {
    this.editingTaskId = task.id;
  }

  async saveTask(task: TaskModel) {
    this.editingTaskId = "";
    await this.storageService.updateTask(task);
  }

  private async loadRemoteConfig() {
    const app = initializeApp(environment.firebaseConfig);
    const remoteConfig = getRemoteConfig(app);

    remoteConfig.settings = {
      fetchTimeoutMillis: 5000,
      minimumFetchIntervalMillis: 3600000,
    };

    try {
      await fetchAndActivate(remoteConfig);
      const showDeleteButton = getString(remoteConfig, 'show_delete_button');
      this.showDeleteButton = showDeleteButton === 'true';
    } catch (error) {
      console.error('Error al obtener Remote Config:', error);
    }
  }

}
