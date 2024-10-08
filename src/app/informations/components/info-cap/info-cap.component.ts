import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { interestelt } from '../../../model/interest-item-model';
import { TreeNode } from 'primeng/api';
import { InfoServices } from '../../information.services';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-cap',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-cap.component.html',
  styleUrl: './info-cap.component.scss'
})
export class InfoCapComponent implements OnInit {

  titre = "Orientez vous vers un CAP";
  soustitre = "Comme Ngono, elles sont nombreuse à utiliser Camerdiplome pour trouver une formation";
  photo = "./../../assets/images/pexels-3.webp";

  school$!: Observable<interestelt[]>;
  overlayVisible: boolean = false;


  data: TreeNode[] = [
    {
        label: 'Après le CM2',
        expanded: true,
        children: [
            {
                label: 'SAR / SM',
                expanded: true,
                children: [
                  {
                    label: '1ère année',
                    expanded: true,
                    children: [
                      {
                        label: '2e année',
                        expanded: true,
                        children: [
                          {
                            expanded: true,
                                    type: 'person',
                                    data : {
                                      label: 'ATTESTATION'
                                    }
                          } 
                        ]
                      }                                     
                    ]
                  }
                ]
            },
            {
                label: 'CETIC / CETIF',
                expanded: true,
                children: [
                  {
                    label: '1ère année',
                    expanded: true,
                    children: [
                      {
                        label: '2e année',
                        expanded: true,
                        children: [
                          {
                            label: '3e année',
                            expanded: true,
                            children: [
                              {
                                label: '4e année',
                                expanded: true,
                                children: [
                                  {
                                    expanded: true,
                                    type: 'person',
                                    data : {
                                      label: 'CAP'
                                    }
                                    
                                  } 
                                ]
                              } 
                            ]
                          } 
                        ]
                      }                                     
                    ]
                  }
                ]
            }
        ]
    }
  ];

   constructor( 
     private meta: Meta,
     private title:Title) 
      {
        this.title.setTitle("Le Certificat d'Aptitude Professionnel (CAP) au Cameroun | Camerdiplome");
        this.meta.updateTag({ name: 'description', content: 'Optez pour une formation professionnelle avant le Bac dans l\'une des nombreuses spécialités du CAP' });
        this.meta.updateTag({ name: 'keywords', content: 'CAP, métier, metier, emploie, formation, Bac' });
      }

  ngOnInit(): void {

    //this.school$ = this.infoservice.getFirstInterestSchool('cap')

  }

  toggle() {
    this.overlayVisible = !this.overlayVisible;
  };

}
