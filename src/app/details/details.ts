import { Component, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../app';
import { MovieDetails, Genre, ProductionCountry } from '../interfaces/movieDetails.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'details-root',
  imports: [CommonModule, FormsModule, RouterOutlet, TranslatePipe],
  templateUrl: './details.html',
  styleUrl: '../app.scss'
})
export class Details extends App implements OnInit{
    protected movieId=''
    protected movie:MovieDetails|undefined
    private activatedroute = inject(ActivatedRoute)
    constructor(){
        super()
        effect(() => {
            this.getMovieDetails()            
        })
    }
    override ngOnInit(): void {
        super.ngOnInit()
        this.getMovieDetails()
    }
    private getMovieDetails(){
        this.movieId = this.activatedroute.snapshot.paramMap.get('id')!
        this.http.get<MovieDetails>(`${this.url}/movie/${this.movieId}?api_key=${this.api_key}&language=${App.language()}`).subscribe(data=> {
            this.movie = data
            this.cdr.detectChanges()
        })
    }
    protected getNames(genres: Genre[]|ProductionCountry[]){
        return genres.map(x=>x.name)
    }
}














// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import Movie from '../Movie';

// @Component({
//   selector: 'movie-dialog',
//   template: `
//     
//   `,
//   styleUrl: '../app.scss'

// })
// export class MovieDialog {
//     protected readonly images_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2"
//     constructor(@Inject(MAT_DIALOG_DATA) protected movie: Movie) {}
// }