import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule} from 'primeng/fieldset';
import { ProgressBarModule } from 'primeng/progressbar';
import {DropdownModule} from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {CarouselModule} from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { EditorModule } from 'primeng/editor';


@NgModule({
    exports:[
      EditorModule,
      ImageModule,
      CarouselModule,
      ProgressSpinnerModule,
      ProgressBarModule,
      MenubarModule,
      FieldsetModule,
      DividerModule,
      CardModule,
      AccordionModule,
      TabViewModule,
      TableModule,
      ButtonModule,
      DialogModule,
      OrganizationChartModule,
      TagModule,
      DropdownModule
    ]
  })

export class PrimengModule {}