import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BookInspectionComponent} from './book-inspection/book-inspection.component';

const routes: Routes = [
  {
    path: '',
    component: BookInspectionComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
