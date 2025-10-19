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

  constructor(private router: Router) {
    // Obtener los datos del state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.receta = navigation.extras.state['receta'];
    }
  }

  ngOnInit() {
    // Si no hay receta, redirigir al home
    if (!this.receta) {
      console.log('No hay datos de receta');
      this.router.navigate(['/home']);
    } else {
      console.log('Receta recibida:', this.receta);
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
