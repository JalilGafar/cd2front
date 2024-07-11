import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import {AccordionModule} from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';


@NgModule({
    exports:[
        MenubarModule,
        CardModule,
        AccordionModule,
        TabViewModule,
        TableModule,
        ButtonModule
    ]
  })

export class PrimengModule {}