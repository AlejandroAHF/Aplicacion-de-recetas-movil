import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCol, IonGrid, IonRow, IonCard, IonButton, IonInput, IonLabel, IonItem, IonButtons, IonIcon, IonAlert } from '@ionic/angular/standalone';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule, 
    CommonModule,
    IonLabel, 
    IonInput, 
    IonButton, 
    IonCol, 
    IonCardContent, 
    IonCardTitle, 
    IonCardHeader, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCard, 
    IonItem,
    IonButtons,
    IonIcon
  ],
})
export class HomePage {
  recetas: any[] = [];
  recetas2: any[] = [];
  recetasOriginal: any[] = [];
  recetas2Original: any[] = []; 
  searchTerm: string = '';

  constructor(private router: Router) {}

  ngOnInit(){
    this.obtenerRecetas();
    this.obtenerRecetas2();
  }

  async obtenerRecetas(){
    try{
      const respuesta = await axios.get('https://dummyjson.com/recipes');
      this.recetas = respuesta.data.recipes;
      this.recetasOriginal = [...this.recetas]; // Guardar original de API 1
      console.log('Recetas API 1:', this.recetas);
    }catch(error){
      console.error('Error API 1:', error);
    }
  }

  async obtenerRecetas2(){
    try{
      const respuesta = await axios.get('http://127.0.0.1:8000/api/recipes');
      this.recetas2 = respuesta.data.data;
      this.recetas2Original = [...this.recetas2]; // Guardar original de API 2
      console.log('Recetas API 2:', this.recetas2);
    }catch(error){
      console.error('Error API 2:', error);
    }
  }

  // Busca en ambas APIs
  buscarReceta(){
    const termino = (this.searchTerm || '').trim().toLowerCase();
    
    if(!termino){
      this.recetas = [...this.recetasOriginal];
      this.recetas2 = [...this.recetas2Original]; // Restaurar ambas
      return;
    }
    
    // Filtrar API 1
    this.recetas = this.recetasOriginal.filter(r => {
      const nombre = (r.name || '').toString().toLowerCase();
      return nombre.includes(termino);
    });
    
    // Filtrar API 2
    this.recetas2 = this.recetas2Original.filter(r => {
      const nombre = (r.name || '').toString().toLowerCase();
      return nombre.includes(termino);
    });
  }

  limpiarBusqueda(){
    this.searchTerm = '';
    this.recetas = [...this.recetasOriginal];
    this.recetas2 = [...this.recetas2Original]; // Restaurar ambas
  }

  // Buscar en ambas APIs según de dónde venga el ID
  verDetalle(id: number, source: 'api1' | 'api2') {
    console.log('ID de la receta:', id, 'Fuente:', source);
    
    let recetaSeleccionada;
    
    if (source === 'api1') {
      recetaSeleccionada = this.recetas.find(r => r.id === id);
    } else {
      recetaSeleccionada = this.recetas2.find(r => r.id === id);
    }
    
    if (recetaSeleccionada) {
      this.router.navigate(['/recipe'], {
        state: { receta: recetaSeleccionada, source: source }
      });
    } else {
      console.error('Receta no encontrada');
    }
  }

  editarReceta(receta: any) {
    this.router.navigate(['/form-recipe'], {
      state: { 
        receta: receta,
        mode: 'edit'
      }
    });
  }

  async eliminarReceta(id: number) {
    try {
      // Mostrar confirmación antes de eliminar
      if (!confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        return;
      }

      // Llamar al endpoint de eliminación
      await axios.delete(`http://127.0.0.1:8000/api/recipes/${id}`);
      console.log('Receta eliminada correctamente');

      // Actualizar la lista de recetas (recargar de la API)
      await this.obtenerRecetas2();
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
    }
  }

  agregarReceta() {
    this.router.navigate(['/form-recipe'], {
      state: { 
        mode: 'create'
      }
    });
  }
}
