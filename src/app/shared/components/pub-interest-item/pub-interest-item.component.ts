import { Component, Input, OnInit } from '@angular/core';
import { interestelt } from '../../../model/interest-item-model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pub-interest-item',
  // standalone: true,
  // imports: [],
  templateUrl: './pub-interest-item.component.html',
  styleUrl: './pub-interest-item.component.scss'
})
export class PubInterestItemComponent implements OnInit {

  @Input() school!: interestelt;
  visible!: boolean;
  visibleCall!: boolean;
  userPhone!: string;


  constructor( private  appRout : Router ){}
 
  ngOnInit(): void {

  }

  showDialog() {
    this.visible = true;
  }

  showOnePage(school: string){
    //const url = this.appRout.serializeUrl(this.appRout.createUrlTree(['etablissement/'], { queryParams: {school:school} }));
    //window.open(url, '_blank');
    this.appRout.navigate(['etablissement/'], { queryParams: {school:school} } );
  }

  sendNumber(){
    this.visible = false;
    this.visibleCall = true;
  }

  // onSubmitPhone(form : NgForm){
  //   console.log(form.value)
  // }

}
