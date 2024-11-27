import {UUIDTypes} from "uuid";
import {CategoryModel} from "./category.model";

export interface TaskModel {
  id: UUIDTypes;
  name: string;
  category: CategoryModel;
  completed: boolean;
}
