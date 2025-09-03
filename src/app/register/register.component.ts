import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {



  constructor () { }


  ngOnInit(){}

  discover(){
    let c = encodeURI(`Je souhaite avoir plus d'information sur l'Enregistrement ou la modification d'un établissement sur Camerdiplome`);
    let url = `https://wa.me/237679197112?text=${c}`
    window.location.href = url;
  }
}
