import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCol, IonGrid, IonRow, IonCard, IonButton } from '@ionic/angular/standalone';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, CommonModule ,IonCol, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCard],
})
export class HomePage {
  recetas: any[] = [];
  constructor(private router: Router) {}
  ngOnInit(){
    this.obtenerRecetas();
  }

  async obtenerRecetas(){
    try{
      const respuesta = await axios.get('https://dummyjson.com/recipes');
      this.recetas = respuesta.data.recipes;
      console.log(this.recetas);
    }catch(error){
      console.error(error);
    }
  }

  verDetalle(id: number) {
    console.log('ID de la receta:', id);
    
    const recetaSeleccionada = this.recetas.find(r => r.id === id);
    this.router.navigate(['/recipe'], {
      state: { receta: recetaSeleccionada }
    });
  }
}
