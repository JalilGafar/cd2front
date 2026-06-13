import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvisorRoutingModule } from './advisor-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
    imports: [CommonModule, AdvisorRoutingModule, SidebarModule, TabViewModule]
})
export class AdvisorModule {}
