import {
    Component, Input, Output, EventEmitter,
    OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { AdvisorService } from '../../advisor.service';
import { LeadCaptureComponent } from '../lead-capture/lead-capture.component';

@Component({
    selector: 'app-school-panel',
    standalone: true,
    imports: [
        CommonModule,
        SidebarModule,
        TabViewModule,
        TableModule,
        PanelModule,
        ProgressSpinnerModule,
        MessageModule,
        LeadCaptureComponent,
    ],
    templateUrl: './school-panel.component.html',
    styleUrl: './school-panel.component.scss',
})
export class SchoolPanelComponent implements OnChanges {

    @Input() visible: boolean = false;
    @Input() schoolId: number | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();

    selectedSchool$ = this.advisorService.selectedSchool$;
    schoolLoading$  = this.advisorService.schoolLoading$;
    schoolError$    = this.advisorService.schoolError$;

    constructor(private advisorService: AdvisorService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['schoolId'] && this.schoolId !== null) {
            this.advisorService.loadSchoolDetail(this.schoolId);
        }
        if (changes['visible'] && !this.visible) {
            this.advisorService.clearSchool();
        }
    }

    onHide(): void {
        this.advisorService.clearSchool();
        this.visibleChange.emit(false);
    }

    getInitials(sigle: string): string {
        return sigle ? sigle.substring(0, 2).toUpperCase() : '??';
    }

    formatCout(cout: number | undefined): string {
        if (cout == null) return '—';
        return new Intl.NumberFormat('fr-FR').format(cout) + ' FCFA';
    }
}
