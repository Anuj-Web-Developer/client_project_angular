import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './loader/loader';
import { Spinkit , NgHttpLoaderComponent} from 'ng-http-loader';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet , NgHttpLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AcsAdmin');
  public myCustomLoader = Loader;
  public spinkit = Spinkit;
}
