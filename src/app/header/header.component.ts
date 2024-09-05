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
          label: 'Diplômes',
          routerLink: 'info/diplome',
          icon: 'pi pi-home'
      },
      {
          label: 'Avant Bac',
          icon: 'pi pi-star',
          items: [
            {
                label: 'CAP',
                routerLink: 'info/cap',
                icon: 'pi pi-palette'
            },
            {
                label: 'BAC Technique',
                routerLink: 'info/bactec',
                icon: 'pi pi-palette'
            },
            {
                label: 'CQP / DQP',
                routerLink: 'info/cqp',
                icon: 'pi pi-palette'
            },
            {
                label: 'Capacité en droit',
                routerLink: 'info/capacite',
                icon: 'pi pi-palette'
            }
        ]
      },
      {
          label: 'Après BAC',
          icon: 'pi pi-search',
          items: [
              {
                  label: 'Prépa',
                  routerLink: 'info/prepa',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'BTS',
                  routerLink: 'info/bts',
                  icon: 'pi pi-server'
              },
              {
                  label: 'HND',
                  routerLink: 'info/hnd',
                  icon: 'pi pi-pencil'
              },
              {
                  label: 'DUT',
                  routerLink: 'info/dut',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'Licence',
                  routerLink: 'info/licence',
                  icon: 'pi pi-server'
              },
              {
                  label: 'Bachelor\'s Degree',
                  routerLink: 'info/bachelor',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'Master',
                  routerLink: 'info/master',
                  icon: 'pi pi-server'
              },
          ]
      },
      {
          label: 'Ecoles',
          routerLink: 'info/ecole',
          icon: 'pi pi-envelope'
      },
      {
          label: 'Métier',
          routerLink: 'info/metier',
          icon: 'pi pi-envelope'
      }
    ]
  }
}
