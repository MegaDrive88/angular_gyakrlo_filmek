import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected loggedIn = localStorage.getItem("userEmail") ?? false
  protected router = inject(Router);
  protected readonly api_key = "1c5abaaeaa13c66b570ad3042a0d51f4"
  protected readonly url = "https://api.themoviedb.org/3"
  protected readonly images_url = "https://image.tmdb.org/t/p/w300_and_h450_bestv2"
  protected http = inject(HttpClient);
  protected cdr = inject(ChangeDetectorRef)
  protected language = "en-US" // hu-HU
}
