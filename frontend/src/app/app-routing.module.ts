import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { DiffDetailComponent }  from './diff-detail/diff-detail.component';
import { HomePageComponent }    from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'diff/:id', component: DiffDetailComponent },

  // Match all and reditect to homepage
  { path: '**', redirectTo: '' },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule { }
