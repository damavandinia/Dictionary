import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {ProfileComponent} from "./profile/profile.component";

const appRouts: Routes = [
  { path: '', component: DictionaryComponent , pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },

  // {path: '404', component: NotFoundComponent},
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRouts)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
