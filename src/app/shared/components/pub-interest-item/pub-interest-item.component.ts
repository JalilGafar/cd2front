import { Component, Input, OnInit } from '@angular/core';
import { interestelt } from '../../../model/interest-item-model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { WhatsappTrackingService } from '../../../service/whatsapp-tracking.service';

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
  name!:string;


  constructor(
    private appRout: Router,
    private whatsappTracking: WhatsappTrackingService
  ){}
 
  ngOnInit(): void {

    this.name = this.school.sigle + this.school.nom_e

  }

  showDialog() {
    this.visible = true;
  }

  showOnePage(school: string){
    //const url = this.appRout.serializeUrl(this.appRout.createUrlTree(['etablissement/'], { queryParams: {school:school} }));
    //window.open(url, '_blank');
    this.appRout.navigate(['etablissement/'], { queryParams: {school:school} } );
  }

  discover(event?: Event){
    let c = encodeURI(`Je souhaite avoir plus d'information sur le diplôme ${this.school.nom_dip}  de l'école ${this.school.sigle} || ${this.school.nom_e} dans la ville de ${this.school.ville_cam} `);
    let url = `https://wa.me/237676476096?text=${c}`
    this.whatsappTracking.openWhatsapp(url, event);
  }

  toSchool(){
    const slug = this.generateSlug(this.name);
    this.appRout.navigate(['info/ecole', slug, this.school.id_ecol]);
  }

  generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')                   // décompose les lettres accentuées
      .replace(/[\u0300-\u036f]/g, '')    // supprime les signes diacritiques (accents)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')        // remplace les caractères spéciaux par des -
      .replace(/^-+|-+$/g, '');           // enlève les - au début et à la fin
  }

  sendNumber(){
    this.visible = false;
    this.visibleCall = true;
  }

  // onSubmitPhone(form : NgForm){
  //   console.log(form.value)
  // }

}
