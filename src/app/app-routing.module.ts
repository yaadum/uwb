import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';


const routes: Routes = [
  {
    path:"site",
    component:DefaultLayoutComponent,
    children:[
      {
        path:"",
        loadChildren:()=>import("./modules/modules.module").then(m=>m.ModulesModule)
      }
    ]
  }
  // {path:'', loadChildren:()=>import('./mainmodule/mainmodule-routing.module').then(m=>m.MainmoduleRoutingModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
