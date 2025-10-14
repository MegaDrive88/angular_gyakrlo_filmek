import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Search } from './search/search';
import { Details } from './details/details';


export const routes: Routes = [
    {path: '', component: Login},
    {path: 'search', component: Search},
    {path: 'details/:id', component: Details},
];
