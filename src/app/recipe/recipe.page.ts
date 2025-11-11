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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardContent, IonButton, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonList, IonItem, IonButtons, IonBackButton]
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
    caloriesPerServing?: number;
    mealType?: string[];
    tags?: string[];
  } = {
    name: '',
    image: ''
  };

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.receta = navigation.extras.state['receta'];
      const rawSource = navigation.extras.state['source'] || 'dummy';
      
      if (rawSource === 'api2' || rawSource === 'local') {
        this.apiSource = 'local';
      } else {
        this.apiSource = 'dummy';
      }
      
      console.log('Source:', this.apiSource);
      console.log('Receta recibida:', this.receta);
    }
  }

  ngOnInit() {
    if (!this.receta) {
      console.log('No hay datos de receta');
      this.router.navigate(['/home']);
    } else {
      this.mapearDatosReceta();
      console.log('RecipeData mapeada:', this.recipeData);
    }
  }

  mapearDatosReceta() {
    // ✅ Helper mejorado para normalizar arrays
    const toArray = (value: any): string[] => {
      if (!value) return [];
      
      // Si ya es un array, retornarlo directamente
      if (Array.isArray(value)) {
        return value.map(item => String(item).trim()).filter(Boolean);
      }
      
      // Si es string, intentar parsearlo
      if (typeof value === 'string') {
        const trimmed = value.trim();
        
        // Si parece JSON, intentar parsear
        if (trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              return parsed.map(item => String(item).trim()).filter(Boolean);
            }
          } catch (e) {
            console.warn('Error parseando JSON:', e);
          }
        }
        
        // Si tiene saltos de línea, dividir por líneas
        if (trimmed.includes('\n')) {
          return trimmed.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        }
        
        // Si no, retornar como array de un elemento
        return [trimmed];
      }
      
      // Fallback
      return [String(value)];
    };

    if (this.apiSource === 'local') {
      // ✅ Mapeo para API local (Laravel)
      this.recipeData = {
        name: this.receta.name || 'Sin nombre',
        image: this.receta.image || '',
        difficulty: this.receta.difficulty || 'N/A',
        prepTimeMinutes: Number(this.receta.prepTimeMinutes) || 0,
        cookTimeMinutes: Number(this.receta.cookTimeMinutes) || 0,
        servings: Number(this.receta.servings) || 0,
        caloriesPerServing: Number(this.receta.caloriesPerServing) || 0,
        cuisine: this.receta.cuisine || 'N/A',
        ingredients: toArray(this.receta.ingredients),
        instructions: toArray(this.receta.instructions),
        description: this.receta.description || ''
      };
    } else {
      // ✅ Mapeo para API dummy
      this.recipeData = {
        name: this.receta.name || 'Sin nombre',
        image: this.receta.image || '',
        difficulty: this.receta.difficulty || 'N/A',
        prepTimeMinutes: Number(this.receta.prepTimeMinutes || this.receta.preparationMinutes) || 0,
        cookTimeMinutes: Number(this.receta.cookTimeMinutes || this.receta.cookingMinutes) || 0,
        servings: Number(this.receta.servings) || 0,
        rating: Number(this.receta.rating) || 0,
        cuisine: this.receta.cuisine || 'N/A',
        ingredients: toArray(this.receta.ingredients),
        instructions: toArray(this.receta.instructions),
        tags: toArray(this.receta.tags),
        mealType: toArray(this.receta.mealType)
      };
    }

    console.log('Datos mapeados:', this.recipeData);
  }

  volver() {
    this.router.navigate(['/home']);
  }
}