import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCol, IonGrid, IonRow, IonCard, IonButton, IonInput, IonLabel, IonItem } from '@ionic/angular/standalone';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [FormsModule, IonLabel, IonInput, IonButton, CommonModule, IonCol, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCard, IonItem],
})
export class HomePage {
  recetas: any[] = [];
  recetasOriginal: any[] = [];
  searchTerm: string = '';
  constructor(private router: Router) {}
  ngOnInit(){
    this.obtenerRecetas();
  }

  async obtenerRecetas(){
    try{
      const respuesta = await axios.get('https://dummyjson.com/recipes');
      this.recetas = respuesta.data.recipes;
      // guardamos la lista original para poder resetear filtros
      this.recetasOriginal = [...this.recetas];
      console.log(this.recetas);
    }catch(error){
      console.error(error);
    }
  }

  // Busca recetas por nombre usando el valor de searchTerm.
  // Si searchTerm está vacío, restaura la lista original.
  buscarReceta(){
    const termino = (this.searchTerm || '').trim().toLowerCase();
    if(!termino){
      this.recetas = [...this.recetasOriginal];
      return;
    }
    this.recetas = this.recetasOriginal.filter(r => {
      const nombre = (r.name || '').toString().toLowerCase();
      return nombre.includes(termino);
    });
  }

  // Opcional: limpiar la búsqueda y restaurar lista
  limpiarBusqueda(){
    this.searchTerm = '';
    this.recetas = [...this.recetasOriginal];
  }

  verDetalle(id: number) {
    console.log('ID de la receta:', id);
    
    const recetaSeleccionada = this.recetas.find(r => r.id === id);
    this.router.navigate(['/recipe'], {
      state: { receta: recetaSeleccionada }
    });
  }
}
