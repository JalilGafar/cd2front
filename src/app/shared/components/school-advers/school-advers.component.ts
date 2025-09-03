import { Component, Input, OnInit } from '@angular/core';
import { SchoolAdvers } from '../../../model/school-adv';
import { Router } from '@angular/router';

@Component({
  selector: 'app-school-advers',
  standalone: true,
  imports: [],
  templateUrl: './school-advers.component.html',
  styleUrl: './school-advers.component.scss'
})
export class SchoolAdversComponent implements OnInit {

  @Input() schoolAdv!: SchoolAdvers;

  constructor(
    private appRout: Router,
  ){}

  ngOnInit(): void {
    
  }

  showOnePage(school: number){
    const slug = this.generateSlug(this.schoolAdv.nom_e+'-'+this.schoolAdv.id_ecol);
    this.appRout.navigate(['info/ecole', slug, this.schoolAdv.id_ecol]);
    //this.appRout.navigateByUrl('info/ecole/'+ school);
  }

  splitStringToArray(str: string){
    if(str=== null){
      str = 'noImage'
    }
    return str.split('').reduce((acc:string[], char:string) => {
      if (char ===' '){
        acc.push('');
      }else {
        acc[acc.length - 1] += char;
      } return acc;
    }, ['']);
  }

  generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')                   // décompose les lettres accentuées
      .replace(/[\u0300-\u036f]/g, '')    // supprime les signes diacritiques (accents)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')        // remplace les caractères spéciaux par des -
      .replace(/^-+|-+$/g, '');           // enlève les - au début et à la fin
  }
}
