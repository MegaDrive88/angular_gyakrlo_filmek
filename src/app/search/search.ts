import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import { Genre } from '../interfaces/movieDetails.interface';
import Movie from '../interfaces/movie.interface';
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
    protected movies:Movie[] = []
    protected genres:Genre[] = []
    @ViewChild('genreSelector') genreSelector!:MatSelect;
    @ViewChild('languageSelector') languageSelector!:MatSelect;
    
    protected onType(){
        localStorage.setItem("movieTitle", this.movieTitle)
        if (this.movieTitle.length < 3) return
        setTimeout(() => {
            this.http.get<any>(`${this.url}/search/movie?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language()}`)
            .subscribe({
                next: (data) => {
                    this.movies = (data.results as Movie[])
                    if(this.genreSelector.value.length > 0) 
                        this.movies = this.movies.filter(x => 
                            x.genre_ids.some(y=> this.genreSelector.value.includes(y))
                        )

                    if(this.languageSelector.value.length > 0)
                        this.movies = this.movies.filter(x => this.languageSelector.value.includes(x.original_language))
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
        this.http.get<any>(`${this.url}/genre/movie/list?api_key=${this.api_key}&include_adult=false&query=${this.movieTitle}&language=${App.language()}`)
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
}