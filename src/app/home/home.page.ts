import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardHeader, IonCardTitle, IonCardContent, IonCol, IonGrid, IonRow, IonCard } from '@ionic/angular/standalone';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule ,IonCol, IonCardContent, IonCardTitle, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCard],
})
export class HomePage {
  recetas: any[] = [];
  constructor() {}
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
}
