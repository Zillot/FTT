import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';

const routes: Routes = [{
    path: "",
    children: [{
      path: "",
      component: HomeComponent,
    }, {
      path: "**",
      redirectTo: '/'
    }]
 }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
