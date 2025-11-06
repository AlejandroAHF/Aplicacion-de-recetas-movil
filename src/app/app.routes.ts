import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'recipe',
    loadComponent: () => import('./recipe/recipe.page').then( m => m.RecipePage)
  },  {
    path: 'form-recipe',
    loadComponent: () => import('./form-recipe/form-recipe.page').then( m => m.FormRecipePage)
  },

];
