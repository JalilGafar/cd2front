import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AvisService } from '../../avis.service';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-mon-avis',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './mon-avis.component.html',
  styleUrl: './mon-avis.component.scss'
})
export class MonAvisComponent implements OnInit {

  newAvis!: FormGroup;
  items!: SelectItem[];
  itemsborn!: SelectItem[];
  schoolId!: number;
  campus = [
    {nom_dip:'campus 1', id_dip:'1'},
    {nom_dip:'campus 2', id_dip:'2'},
    {nom_dip:'campus 3', id_dip:'3'},
    {nom_dip:'campus 4', id_dip:'4'}
  ];
  formation = [
    {nom_dip:'formation 1', id_dip:'1'},
    {nom_dip:'formation 2', id_dip:'2'},
    {nom_dip:'formation 3', id_dip:'3'},
    {nom_dip:'formation 4', id_dip:'4'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private avisService: AvisService,
    private route: ActivatedRoute,
    private appRout : Router
  ){
    this.items = [];
    for (let i = 2000; i < 2025; i++) {
        this.items.push({ label:''+ i, value: i });
    }
    this.itemsborn = [];
    for (let i = 1970; i < 2013; i++) {
        this.itemsborn.push({ label:''+ i, value: i });
    }
  }


  ngOnInit(): void {
    this.newAvis  = this.formBuilder.group({
      id_ecole: [null],
      campus_id: [null],
      formation_id: [null],
      note: [null],
      content:[null],
      note_cours:[null],
      content_cours:[null],
      note_ambiance:[null],
      content_ambiance:[null],
      note_locaux:[null],
      content_locaux:[null],
      note_insert:[null],
      content_insert:[null],
      recommande:[null],
      promotion:[null],
      born:[null],
      auteur_avis:[null],
      email:[null],
      justif:[null],
    });

    this.route.params.pipe(
      switchMap(async (params) => this.schoolId = +params['id']),
      tap( ()=> {
        this.newAvis.patchValue({
          id_ecole: this.schoolId, 
        });
      } ) 
      ).subscribe();
      // console.log(this.schoolId)


  }

  
  onSubmitForm(){
    this.avisService.sendAvis(this.newAvis.value);
    console.log(this.newAvis.value);
   // this.appRout.navigate( ['orientation/resultats/'] );
  }
}
