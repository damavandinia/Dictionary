import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";

const appRouts: Routes = [
  { path: '', component: DictionaryComponent , pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // {path: '404', component: NotFoundComponent},
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRouts)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
