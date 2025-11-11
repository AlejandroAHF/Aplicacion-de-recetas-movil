import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCol, IonGrid, IonRow, IonCard, IonButton, IonInput, IonLabel, IonItem, IonButtons, IonIcon, IonSelect, IonSelectOption, IonChip } from '@ionic/angular/standalone';
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
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonChip
  ],
})
export class HomePage {
  recetas: any[] = [];
  recetas2: any[] = [];
  recetasOriginal: any[] = [];
  recetas2Original: any[] = [];
  
  // Filtros
  searchTerm: string = '';
  filterDifficulty: string = '';
  filterCuisine: string = '';
  filterMaxTime: number | null = null;
  
  // Opciones para los selectores
  difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  cuisines: string[] = [];
  showFilters: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(){
    this.obtenerRecetas();
    this.obtenerRecetas2();
  }

  async obtenerRecetas(){
    try{
      const respuesta = await axios.get('https://dummyjson.com/recipes');
      this.recetas = respuesta.data.recipes;
      this.recetasOriginal = [...this.recetas];
      this.extraerCocinas();
      console.log('Recetas API 1:', this.recetas);
    }catch(error){
      console.error('Error API 1:', error);
    }
  }

  async obtenerRecetas2(){
    try{
      const respuesta = await axios.get('http://127.0.0.1:8000/api/recipes');
      this.recetas2 = respuesta.data.data;
      this.recetas2Original = [...this.recetas2];
      this.extraerCocinas();
      console.log('Recetas API 2:', this.recetas2);
    }catch(error){
      console.error('Error API 2:', error);
    }
  }

  // Extraer tipos de cocina únicos de ambas APIs
  extraerCocinas() {
    const cocinasSet = new Set<string>();
    
    // De API 1
    this.recetasOriginal.forEach(r => {
      if (r.cuisine) cocinasSet.add(r.cuisine);
    });
    
    // De API 2
    this.recetas2Original.forEach(r => {
      if (r.cuisine) cocinasSet.add(r.cuisine);
    });
    
    this.cuisines = Array.from(cocinasSet).sort();
  }

  // Toggle para mostrar/ocultar filtros
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  // Aplicar todos los filtros
  aplicarFiltros() {
    this.recetas = this.filtrarRecetas(this.recetasOriginal);
    this.recetas2 = this.filtrarRecetas(this.recetas2Original);
    console.log('Filtros aplicados');
  }

  // Función principal de filtrado
  filtrarRecetas(recetas: any[]): any[] {
    let resultado = [...recetas];

    // Filtro por búsqueda de texto (nombre)
    if (this.searchTerm && this.searchTerm.trim()) {
      const termino = this.searchTerm.trim().toLowerCase();
      resultado = resultado.filter(r => {
        const nombre = (r.name || '').toString().toLowerCase();
        return nombre.includes(termino);
      });
    }

    // Filtro por dificultad
    if (this.filterDifficulty) {
      resultado = resultado.filter(r => {
        const difficulty = (r.difficulty || '').toString().toLowerCase();
        return difficulty === this.filterDifficulty.toLowerCase();
      });
    }

    // Filtro por tipo de cocina
    if (this.filterCuisine) {
      resultado = resultado.filter(r => {
        return r.cuisine === this.filterCuisine;
      });
    }

    // Filtro por tiempo máximo de preparación
    if (this.filterMaxTime && this.filterMaxTime > 0) {
      resultado = resultado.filter(r => {
        const prepTime = Number(r.prepTimeMinutes || r.prepTimeMinutes || 0);
        return prepTime <= this.filterMaxTime!;
      });
    }

    return resultado;
  }

  // Limpiar todos los filtros
  limpiarFiltros() {
    this.searchTerm = '';
    this.filterDifficulty = '';
    this.filterCuisine = '';
    this.filterMaxTime = null;
    this.recetas = [...this.recetasOriginal];
    this.recetas2 = [...this.recetas2Original];
    console.log('Filtros limpiados');
  }

  // Función de búsqueda rápida (solo por nombre)
  buscarReceta() {
    this.aplicarFiltros();
  }

  // Limpiar solo la búsqueda de texto
  limpiarBusqueda() {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  // Contador de filtros activos
  get filtrosActivos(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.filterDifficulty) count++;
    if (this.filterCuisine) count++;
    if (this.filterMaxTime) count++;
    return count;
  }

  // Ver detalle de receta
  verDetalle(id: number, source: 'api1' | 'api2') {
    console.log('ID de la receta:', id, 'Fuente:', source);
    
    let recetaSeleccionada;
    
    if (source === 'api1') {
      recetaSeleccionada = this.recetasOriginal.find(r => r.id === id);
    } else {
      recetaSeleccionada = this.recetas2Original.find(r => r.id === id);
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
    const isFromApi2 = !!this.recetas2Original.find(r => r.id === receta.id);
    const source = isFromApi2 ? 'api2' : 'api1';

    this.router.navigate(['/form-recipe'], {
      state: { 
        receta: receta,
        mode: 'edit',
        source: source
      }
    });
  }

  async eliminarReceta(id: number) {
    try {
      if (!confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/recipes/${id}`);
      console.log('Receta eliminada correctamente');
      await this.obtenerRecetas2();
      this.aplicarFiltros();
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
