import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import Movie from '../Interfaces/Movie';
import { Genre } from '../Interfaces/MovieDetails';

@Component({
  selector: 'search-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './search.html',
  styleUrl: '../app.scss'
})
export class Search extends App implements OnInit {
    protected userEmail = localStorage.getItem("userEmail")
    protected movieTitle = ""
    protected logout(){
        localStorage.removeItem("userEmail")
        this.router.navigateByUrl("")
    }
    protected movies:Movie[] = []
    private genres:Genre[] = []
    protected onType(){
        if (this.movieTitle.length < 3) return
        this.http.get<any>(`${this.url}/search/movie?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}`)
        .subscribe({
            next: (data) => {
                this.movies = (data.results as Movie[])
                this.cdr.detectChanges()
            },
            error: (err) => {
                console.error('Error: ', err);
            }
        });
    }
    protected get_genre(id:number) : string{
        return (this.genres.find(x=> x.id == id) ?? {name:"no genre found"}).name
    }
    ngOnInit(): void {
        this.http.get<any>(`${this.url}/genre/movie/list?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}`)
        .subscribe(data => {
            this.genres = data.genres
        })
    }
    protected movieClicked(movieId :number){
        this.router.navigateByUrl(`details/${movieId}`)
    }
}