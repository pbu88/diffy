import { DiffyLayoutComponent } from './components/layout/diffy-layout/diffy-layout.component';
import { SiteLayoutComponent } from './components/layout/site-layout/site-layout.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DiffDetailComponent } from "./pages/diff-detail/diff-detail.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";

const routes: Routes = [
  { 
    path: '', 
    component: SiteLayoutComponent, 
    children: [{
      path: '',
      component: HomePageComponent,
      pathMatch: "full"
    }]
  },
  { 
    path: '', 
    component: DiffyLayoutComponent, 
    children: [{
      path: 'diff/:id',
      component: DiffDetailComponent,
    }]
  },

  // Match all and reditect to homepage
  { path: "**", redirectTo: "" },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
