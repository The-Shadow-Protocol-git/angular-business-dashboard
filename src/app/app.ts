import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header';
import { SidebarComponent } from './layout/sidebar/sidebar';

@Component({
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
