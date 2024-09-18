import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TopNews } from '../model/top-news-model';
import { TopNewsService } from '../service/top-news.service';
import { SharedComponentModule } from '../shared/shared.modules';

@Component({
  selector: 'app-top-news-slide',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './top-news-slide.component.html',
  styleUrl: './top-news-slide.component.scss'
})
export class TopNewsSlideComponent {
  
  myTopNews$!: Observable<TopNews[]>;

  
  responsiveOptions;

  constructor( private TopNewsService : TopNewsService ){
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  ngOnInit() {
    this.myTopNews$ = this.TopNewsService.getAllTopNews();
  }

}
