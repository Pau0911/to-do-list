import {Component, OnInit} from '@angular/core';
import {IonicModule, ToastController} from '@ionic/angular';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StorageService} from '../../service/storage.service';
import {closeCircle, create, save} from 'ionicons/icons';
import {addIcons} from "ionicons";
import {CategoryModel} from "../../model/category.model";
import {UUIDTypes} from "uuid";
import {MessageService} from "../../service/message.service";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, NgFor, NgIf, FormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  newCategory: string = "";
  editingCategoryId: UUIDTypes | null = null;

  constructor(
    private storageService: StorageService,
    private messageService: MessageService
  ) {
    addIcons({closeCircle, create, save});
  }

  async ngOnInit() {
    this.storageService.categories$.subscribe(categories => {
        this.categories = categories;
      }
    );
  }

  async addCategory() {
    if (this.newCategory.trim()) {
      const category = await this.storageService.addCategory(this.newCategory);
      if (!category) {
        await this.messageService.showMessage("Categoría creada", "primary");
      } else {
        await this.messageService.showMessage("La categoría ya existe", "warning");
      }
      this.newCategory = "";
    }
  }

  async deleteCategory(category: CategoryModel) {
    const isDelete = await this.storageService.deleteCategory(category.id);
    if (isDelete) {
      await this.messageService.showMessage("Categoría eliminada", "primary")
    } else {
      await this.messageService.showMessage("La categoría tiene asociada una tarea, no se puede eliminar", "primary")
    }
  }

  async editCategory(category: CategoryModel) {
    this.editingCategoryId = category.id;
  }

  async saveCategory(category: CategoryModel) {
    if (category.name.trim()) {
      await this.storageService.updateCategory(category);
      this.editingCategoryId = null;
    }
  }

}
