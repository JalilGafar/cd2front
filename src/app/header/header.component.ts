import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { PrimengModule } from '../shared/primeng.modules';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PrimengModule],
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
                icon: 'pi pi-palette'
            },
            {
                label: 'BAC Technique',
                icon: 'pi pi-palette'
            },
            {
                label: 'CQP / DQP',
                icon: 'pi pi-palette'
            },
            {
                label: 'Capacité en droit',
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
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'BTS',
                  icon: 'pi pi-server'
              },
              {
                  label: 'HND',
                  icon: 'pi pi-pencil'
              },
              {
                  label: 'DUT',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'Licence',
                  icon: 'pi pi-server'
              },
              {
                  label: 'Licence Pro',
                  icon: 'pi pi-pencil'
              },
              {
                  label: 'Bachelor\'s Degree',
                  icon: 'pi pi-bolt'
              },
              {
                  label: 'Master',
                  icon: 'pi pi-server'
              },
          ]
      },
      {
          label: 'Ecoles',
          icon: 'pi pi-envelope'
      },
      {
          label: 'Métier',
          icon: 'pi pi-envelope'
      }
    ]
  }
}
