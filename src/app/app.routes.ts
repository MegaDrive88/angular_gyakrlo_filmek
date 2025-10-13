import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Search } from './search/search';


export const routes: Routes = [
    {path: '', component: Login},
    {path: 'search', component: Search},
];
