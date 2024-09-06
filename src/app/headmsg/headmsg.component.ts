import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-headmsg',
  standalone: false,
  //imports: [],
  templateUrl: './headmsg.component.html',
  styleUrl: './headmsg.component.scss'
})
export class HeadmsgComponent implements OnInit{

  @Input() titre!: string;
  @Input() soustitre!: string;
  @Input() photo!: string;

  ngOnInit(){}

}
