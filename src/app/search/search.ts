import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import { HttpClient } from '@angular/common/http';
import Movie from '../Movie';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'search-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './search.html',
  styleUrl: '../app.scss'
})
export class Search extends App {
    protected userEmail = localStorage.getItem("userEmail")
    protected movieTitle = ""
    private readonly api_key = "1c5abaaeaa13c66b570ad3042a0d51f4"
    private readonly url = "https://api.themoviedb.org/3"
    protected readonly images_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2"
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef)
    protected logout(){
        localStorage.removeItem("userEmail")
        this.router.navigateByUrl("")
    }
    protected movies:Movie[] = []
    protected onType(){
        if (this.movieTitle.length < 3) return
        this.http.get<any>(`${this.url}/search/multi?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}`)
        .subscribe({
            next: (data) => {
                this.movies = (data.results as Movie[]).filter(x=>x.media_type != "person")
                this.cdr.detectChanges()           
            },
            error: (err) => {
                console.error('Error: ', err);
            }
        });
    }
    protected async get_genre(id:number){
        const data = await firstValueFrom(this.http.get<any>(`${this.url}/genre/movie/list?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}`))
        return (data.genres as {id:number,name:string}[]).filter(x=> x.id == id)[0].name // nincs kész
    }
}