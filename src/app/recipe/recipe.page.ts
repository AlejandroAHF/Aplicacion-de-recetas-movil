import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonList, IonItem, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonCard, IonCardContent, IonButton, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonList, IonItem, IonButtons, IonBackButton]
})
export class RecipePage implements OnInit {
  receta: any = null;
  apiSource: 'dummy' | 'local' = 'dummy';
  recipeData: {
    name: string;
    image: string;
    difficulty?: string;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
    servings?: number;
    ingredients?: string[];
    instructions?: string[];
    description?: string;
    rating?: number;
    cuisine?: string;
    mealType?: string[];
    tags?: string[];
  } = {
    name: '',
    image: ''
  };

  constructor(private router: Router) {
    // Obtener los datos del state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.receta = navigation.extras.state['receta'];
      this.apiSource = navigation.extras.state['source'] || 'dummy';
    }
  }

  ngOnInit() {
    // Si no hay receta, redirigir al home
    if (!this.receta) {
      console.log('No hay datos de receta');
      this.router.navigate(['/home']);
    } else {
      console.log('Receta recibida:', this.receta);
      this.mapearDatosReceta();
    }
  }

  mapearDatosReceta() {
    if (this.apiSource === 'local') {
      // Mapeo para la API local
      this.recipeData = {
        name: this.receta.name,
        image: this.receta.image,
        difficulty: this.receta.difficulty,
        prepTimeMinutes: this.receta.prepTimeMinutes,
        description: this.receta.description,
        ingredients: this.receta.ingredients?.split('\n'),
        instructions: this.receta.instructions?.split('\n'),
        servings: this.receta.servings
      };
    } else {
      // Mapeo para la API dummy
      this.recipeData = {
        name: this.receta.name,
        image: this.receta.image,
        difficulty: 'N/A',
        prepTimeMinutes: this.receta.preparationMinutes,
        cookTimeMinutes: this.receta.cookingMinutes,
        servings: this.receta.servings,
        ingredients: this.receta.ingredients,
        instructions: this.receta.instructions,
        cuisine: this.receta.cuisine,
        tags: this.receta.tags,
        mealType: [this.receta.mealType]
      };
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
