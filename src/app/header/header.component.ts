import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { PrimengModule } from '../shared/primeng.modules';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    PrimengModule
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(){
    this.items = [
        {
            label: 'Métier',
            routerLink: 'info/metier',
            icon: 'pi pi-hammer'
        },
        {
            label: 'Ecoles',
            routerLink: 'info/ecole',
            icon: 'pi pi-building-columns'
        },
        {
            label: 'Formations',
            icon: 'pi pi-graduation-cap',
            items: [
                {
                    label: 'Par domaine',
                    routerLink: 'info/diplome',
                    icon: 'pi pi-building-columns'
                },
                {
                    label: 'Avant Bac',
                    icon: 'pi pi-angle-double-right',
                    items: [
                        {
                            label: 'CAP',
                            routerLink: 'info/cap',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'BAC Technique',
                            routerLink: 'info/bactec',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'CQP / DQP',
                            routerLink: 'info/cqp',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'Capacité en droit',
                            routerLink: 'info/capacite',
                            icon: 'pi pi-circle-fill'
                        }
                    ]
                },
                {
                    label: 'Après BAC',
                    icon: 'pi pi-angle-double-right',
                    items: [
                        {
                            label: 'Prépa',
                            routerLink: 'info/prepa',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'BTS',
                            routerLink: 'info/bts',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'HND',
                            routerLink: 'info/hnd',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'DUT',
                            routerLink: 'info/dut',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'Licence',
                            routerLink: 'info/licence',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'Licence Pro',
                            routerLink: 'info/licencepro',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'Bachelor\'s Degree',
                            routerLink: 'info/bachelor',
                            icon: 'pi pi-circle-fill'
                        },
                        {
                            label: 'Master',
                            routerLink: 'info/master',
                            icon: 'pi pi-circle-fill'
                        },
                    ]
                }
            ]
        },
        {
            label: 'Actualité',
            icon: 'pi pi-building-columns',
            items:[
                {
                    label: 'A la une',
                    routerLink: 'info/actualité',
                    icon: 'pi pi-circle-fill'
                },
                {
                    label: 'Enseignement superieur',
                    routerLink: 'info/superieur',
                    icon: 'pi pi-circle-fill'
                },
                {
                    label: 'Orientation',
                    routerLink: 'info/orientation',
                    icon: 'pi pi-circle-fill'
                },
                {
                    label: 'Vie étudiante',
                    routerLink: 'info/etudiant',
                    icon: 'pi pi-circle-fill'
                },
                {
                    label: 'Vie professionnelle',
                    routerLink: 'info/professionnel',
                    icon: 'pi pi-circle-fill'
                },
            ]
        }        
    ]
  }
}
