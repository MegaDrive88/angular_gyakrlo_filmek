import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { App } from '../app';
import { Genre } from '../interfaces/movieDetails.interface';
import Movie from '../interfaces/movie.interface';
import Language from '../interfaces/language.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'search-root',
  imports: [CommonModule, FormsModule, RouterOutlet, TranslatePipe, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: '../app.scss'
})
export class Search extends App implements OnInit, AfterViewInit {
    protected userEmail = localStorage.getItem("userEmail")
    protected movieTitle = localStorage.getItem("movieTitle") ?? ""
    protected logout(){
        localStorage.removeItem("userEmail")
        this.router.navigateByUrl("")
    }
    protected currYear = new Date().getFullYear()
    protected movies:Movie[] = []
    protected genres:Genre[] = []
    protected languages:Language[] = []
    @ViewChild('genreSelector') genreSelector!:MatSelect;
    @ViewChild('languageSelector') languageSelector!:MatSelect;
    protected releaseYear:number|Number|undefined
    protected onType(){
        localStorage.setItem("movieTitle", this.movieTitle)
        if (this.movieTitle.length < 3) return
        setTimeout(() => {
            this.http.get<any>(
                `${this.url}/search/movie?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language()}${this.releaseYear != null && this.releaseYear != undefined ? `&primary_release_year=${this.releaseYear}` : ""}`)
            .subscribe({
                next: (data) => {
                    this.movies = (data.results as Movie[])
                    if(this.genreSelector.value.length > 0) 
                        this.movies = this.movies.filter(x => 
                            x.genre_ids.some(y=> this.genreSelector.value.includes(y))
                        )
                    if(this.languageSelector.value.length > 0)
                        this.movies = this.movies.filter(x => this.languageSelector.value.includes(x.original_language))
                    if(this.favoritesOnly)
                        this.movies = this.movies.filter(x => this.favoriteMovies.includes(x.id))
                    this.cdr.detectChanges()
                },
                error: (err) => {
                    console.error('Error: ', err);
                }
            });
        }, 500);
    }
    get siteLanguage(){
        return App.language()
    }
    protected getGenre(id:number) : string{
        return (this.genres.find(x=> x.id == id) ?? {name:"no genre found"}).name
    }
    private getAllGenresAndLanguages(){
        this.http.get<any>(`${this.url}/genre/movie/list?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language()}`)
        .subscribe(data => {
            this.genres = data.genres
        })
        this.http.get<any>(`${this.url}/configuration/languages?api_key=${this.api_key}`)
        .subscribe(data => {
            this.languages = data.sort((x:Language,y:Language)=>x.english_name.localeCompare(y.english_name))
        })
    }
    override ngOnInit(): void {
        super.ngOnInit()
        this.getAllGenresAndLanguages()
        document.querySelector("#langSelector")?.addEventListener("change", ()=>{
            this.getAllGenresAndLanguages()
            this.onType()
            this.cdr.detectChanges()
        })
    }
    ngAfterViewInit(): void {
        this.genreSelector.value = []
        this.languageSelector.value = []
        this.onType()
    }
    protected movieClicked(movieId :number){
        this.router.navigateByUrl(`details/${movieId}`)
    }
    protected toggleFavorite(movieId:number, event:MouseEvent){
        event.stopPropagation()
        if(!this.favoriteMovies.includes(movieId))
            this.favoriteMovies.push(movieId)
        else            
            this.favoriteMovies = this.favoriteMovies.filter(x=> x != movieId)
        localStorage.setItem("favorite_movies", JSON.stringify(this.favoriteMovies))        
    }
}