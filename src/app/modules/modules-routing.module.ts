import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RestorantComponent } from './restorant/restorant.component';
import { RoomsComponent } from './rooms/rooms.component';

const routes: Routes = [
  {path:':name',component:HomeComponent,
  data: {
    title: "Home",
  }
},
  {path:':name/home',component:HomeComponent},
  {path:':name/about',component:AboutComponent},
  {path:':name/room',component:RoomsComponent},
  {path:':name/resto',component:RestorantComponent},
  {path:':name/blogs',component:BlogsComponent},
  {path:':name/contact',component:ContactComponent},
  {path:':name/login',component:LoginComponent},
  {path:':name/cart',component:CartComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
