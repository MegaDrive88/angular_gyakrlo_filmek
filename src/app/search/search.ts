import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import { Genre } from '../interfaces/movieDetails.interface';
import Movie from '../interfaces/movie.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'search-root',
  imports: [CommonModule, FormsModule, RouterOutlet, TranslatePipe],
  templateUrl: './search.html',
  styleUrl: '../app.scss'
})
export class Search extends App implements OnInit {
    protected userEmail = localStorage.getItem("userEmail")
    protected movieTitle = localStorage.getItem("movieTitle") ?? ""
    protected logout(){
        localStorage.removeItem("userEmail")
        this.router.navigateByUrl("")
    }
    protected movies:Movie[] = []
    private genres:Genre[] = []
    protected onType(){
        localStorage.setItem("movieTitle", this.movieTitle)
        if (this.movieTitle.length < 3) return
        setTimeout(() => {
            this.http.get<any>(`${this.url}/search/movie?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language}`)
            .subscribe({
                next: (data) => {
                    this.movies = (data.results as Movie[])
                    this.cdr.detectChanges()
                },
                error: (err) => {
                    console.error('Error: ', err);
                }
            });
        }, 500);
    }
    protected getGenre(id:number) : string{
        return (this.genres.find(x=> x.id == id) ?? {name:"no genre found"}).name
    }
    private getAllGenres(){
        this.http.get<any>(`${this.url}/genre/movie/list?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language}`)
        .subscribe(data => {
            this.genres = data.genres
        })
    }
    override ngOnInit(): void {
        super.ngOnInit()
        this.getAllGenres()
        document.querySelector("#langSelector")?.addEventListener("change", ()=>{
            this.getAllGenres()
            this.onType()
        })
        this.onType()
    }
    protected movieClicked(movieId :number){
        this.router.navigateByUrl(`details/${movieId}`)
    }
}