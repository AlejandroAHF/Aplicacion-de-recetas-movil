import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonItemDivider, IonButton, IonIcon, IonSelectOption, IonCardSubtitle, IonInput, IonGrid, IonRow, IonCol, IonSelect, IonNote } from '@ionic/angular/standalone';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-recipe',
  templateUrl: './form-recipe.page.html',
  styleUrls: ['./form-recipe.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonButton,
    IonIcon,
    IonSelectOption,
    IonSelect,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonNote
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormRecipePage implements OnInit {
  recipeForm: FormGroup;
  previewImage: string = '';
  formSubmitted = false;
  isEditMode = false;
  recipeId: number | null = null;
  imageError: string = '';

  constructor(private fb: FormBuilder, private router: Router, private cd: ChangeDetectorRef, private ngZone: NgZone) {
    this.recipeForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      ingredients: this.fb.array([this.fb.control('', Validators.required)]),
      instructions: this.fb.array([this.fb.control('', Validators.required)]),
      prepTimeMinutes: ['', [Validators.required, Validators.min(1)]],
      cookTimeMinutes: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      cuisine: ['', Validators.required],
      caloriesPerServing: ['', [Validators.required, Validators.min(1)]],
      // image puede ser una URL (string) o el nombre del archivo cuando se sube desde el dispositivo
      image: [''],
    });

    // Suscribirse a cambios en el control image: si es una URL válida se previsualiza
    this.recipeForm.get('image')?.valueChanges.subscribe(val => {
      if (typeof val === 'string' && val.startsWith('http')) {
        this.previewImage = val;
        this.selectedFile = null;
      }
    });
  }

  // Archivo seleccionado desde el dispositivo
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    // Validación de tipo y tamaño
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    this.imageError = '';

    if (!validTypes.includes(file.type)) {
      this.imageError = 'El archivo debe ser una imagen (jpg, png, gif, webp).';
      this.selectedFile = null;
      this.previewImage = '';
      this.recipeForm.patchValue({ image: '' });
      return;
    }
    if (file.size > maxSize) {
      this.imageError = 'La imagen no debe superar los 2MB.';
      this.selectedFile = null;
      this.previewImage = '';
      this.recipeForm.patchValue({ image: '' });
      return;
    }

    this.selectedFile = file;
    console.log('Archivo seleccionado:', file.name, file.type, file.size, file);

    // Generar preview (FileReader) y forzar la actualización de Angular
    const reader = new FileReader();
    reader.onload = () => {
      this.ngZone.run(() => {
        this.previewImage = reader.result as string;
        try { this.cd.detectChanges(); } catch (e) { /* ignore */ }
      });
    };
    reader.readAsDataURL(file);

    // Guardar el nombre de archivo en el control (opcional)
    this.recipeForm.patchValue({ image: file.name });
  }

  ngOnInit() {
    // Obtener datos de la navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { receta: any, mode: 'create' | 'edit' };
    
    if (state && state.mode === 'edit' && state.receta) {
      this.isEditMode = true;
      this.recipeId = state.receta.id;
      this.loadRecipeData(state.receta);
    }
  }

  private loadRecipeData(receta: any) {
    // Limpiar los FormArrays existentes
    while (this.ingredients.length !== 0) {
      this.ingredients.removeAt(0);
    }
    while (this.instructions.length !== 0) {
      this.instructions.removeAt(0);
    }

    // Cargar ingredientes
    receta.ingredients.forEach((ingredient: string) => {
      this.ingredients.push(this.fb.control(ingredient, Validators.required));
    });

    // Cargar instrucciones
    receta.instructions.forEach((instruction: string) => {
      this.instructions.push(this.fb.control(instruction, Validators.required));
    });

    // Actualizar el resto del formulario
    this.recipeForm.patchValue({
      id: receta.id,
      name: receta.name,
      prepTimeMinutes: receta.prepTimeMinutes,
      cookTimeMinutes: receta.cookTimeMinutes,
      servings: receta.servings,
      difficulty: receta.difficulty,
      cuisine: receta.cuisine,
      caloriesPerServing: receta.caloriesPerServing,
      image: receta.image
    });
  }

  // Getters para los form arrays
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  // Funciones para ingredientes
  addIngredient() {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Funciones para instrucciones
  addInstruction() {
    this.instructions.push(this.fb.control('', Validators.required));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  async onSubmit() {
    if (this.recipeForm.valid) {
      try {
        const recipeData = this.recipeForm.value;

        // Si hay un archivo seleccionado, enviamos multipart/form-data
        if (this.selectedFile) {
          if (this.imageError) {
            console.error('No se puede enviar: ', this.imageError);
            return;
          }
          
          console.log('Enviando archivo:', this.selectedFile);
          const formData = new FormData();
          
          // Imagen como archivo
          formData.append('image', this.selectedFile);

          // Campos simples
          formData.append('name', recipeData.name);
          formData.append('prepTimeMinutes', recipeData.prepTimeMinutes.toString());
          formData.append('cookTimeMinutes', recipeData.cookTimeMinutes.toString());
          formData.append('servings', recipeData.servings.toString());
          formData.append('difficulty', recipeData.difficulty);
          formData.append('cuisine', recipeData.cuisine);
          formData.append('caloriesPerServing', recipeData.caloriesPerServing.toString());

          // Arrays como JSON strings
          formData.append('ingredients', JSON.stringify(recipeData.ingredients));
          formData.append('instructions', JSON.stringify(recipeData.instructions));

          if (this.isEditMode && this.recipeId) {
            // Laravel: para actualizar con archivo, usar POST + _method=PUT
            formData.append('_method', 'PUT');
            
            await axios.post(`http://127.0.0.1:8000/api/recipes/${this.recipeId}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Receta actualizada (con imagen nueva)');
          } else {
            await axios.post('http://127.0.0.1:8000/api/recipes', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Receta creada (con imagen)');
          }
        } else {
          // Envío JSON cuando NO hay archivo nuevo
          
          // CLAVE: Preparar datos con arrays como JSON strings
          const jsonData = {
            name: recipeData.name,
            ingredients: JSON.stringify(recipeData.ingredients),  // Convertir a string
            instructions: JSON.stringify(recipeData.instructions), // Convertir a string
            prepTimeMinutes: recipeData.prepTimeMinutes,
            cookTimeMinutes: recipeData.cookTimeMinutes,
            servings: recipeData.servings,
            difficulty: recipeData.difficulty,
            cuisine: recipeData.cuisine,
            caloriesPerServing: recipeData.caloriesPerServing,
            image: recipeData.image || '' // Mantener URL existente o vacío
          };

          console.log('Enviando JSON (sin archivo):', jsonData);

          if (this.isEditMode && this.recipeId) {
            const response = await axios.put(`http://127.0.0.1:8000/api/recipes/${this.recipeId}`, jsonData);
            console.log('Receta actualizada (sin cambiar imagen):', response.data);
          } else {
            const response = await axios.post('http://127.0.0.1:8000/api/recipes', jsonData);
            console.log('Receta creada (sin imagen):', response.data);
          }
        }

        // Navegar de vuelta a la página principal
        this.router.navigate(['/home']);
        
      } catch (error: any) {
        console.error('Error al guardar la receta:', error);
        
        // Mostrar detalles completos del error
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          console.error('Errors:', error.response.data?.errors);
        }
        
        // Mostrar mensaje al usuario
        const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
        alert(`Error al guardar la receta: ${errorMsg}`);
      }
    } else {
      // Formulario inválido: mostrar errores
      console.error('Formulario inválido');
      
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.recipeForm.controls).forEach(key => {
        this.recipeForm.get(key)?.markAsTouched();
      });
      
      // Marcar arrays también
      this.ingredients.controls.forEach(control => control.markAsTouched());
      this.instructions.controls.forEach(control => control.markAsTouched());
      
      alert('Por favor completa todos los campos requeridos');
    }
  }
}
