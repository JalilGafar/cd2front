import {
    Component, Input, OnChanges, OnDestroy, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdvisorService } from '../../advisor.service';

@Component({
    selector: 'app-lead-capture',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './lead-capture.component.html',
    styleUrl: './lead-capture.component.scss',
})
export class LeadCaptureComponent implements OnChanges, OnDestroy {

    // Quand schoolId change (nouvelle école sélectionnée), on remet le formulaire à zéro
    @Input() schoolId: number | null = null;

    leadForm: FormGroup;

    leadSaving$  = this.advisorService.leadSaving$;
    leadSuccess$ = this.advisorService.leadSuccess$;
    leadError$   = this.advisorService.leadError$;

    private successSub?: Subscription;
    private successTimeout?: ReturnType<typeof setTimeout>;

    constructor(
        private fb: FormBuilder,
        private advisorService: AdvisorService,
    ) {
        this.leadForm = this.fb.group({
            name:    ['', Validators.required],
            surname: ['', Validators.required],
            tel:     ['', Validators.required],
            email:   ['', Validators.email],
            statuts: ['lycéen'],
            level:   [''],
            city:    [''],
            degree:  [''],
            field:   [''],
        });

        // Reset du formulaire (champs libres seulement) 3s après un succès
        this.successSub = this.advisorService.leadSuccess$.subscribe(ok => {
            if (ok) {
                this.successTimeout = setTimeout(() => {
                    this.resetForm();
                    // _leadSuccess$ est remis à false par clearSchool() à la fermeture
                    // mais ici on le remet à false pour pouvoir soumettre de nouveau
                    // dans la même session sans fermer le panneau
                }, 3000);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Nouvelle école sélectionnée → reset du formulaire
        if (changes['schoolId'] && !changes['schoolId'].firstChange) {
            this.resetForm();
        }
    }

    ngOnDestroy(): void {
        this.successSub?.unsubscribe();
        if (this.successTimeout) clearTimeout(this.successTimeout);
    }

    onSubmit(): void {
        if (this.leadForm.invalid) return;
        const v = this.leadForm.value;
        this.advisorService.saveLead({
            name:     v.name,
            surname:  v.surname,
            tel:      v.tel,
            email:    v.email   || undefined,
            statuts:  v.statuts || undefined,
            level:    v.level   || undefined,
            city:     v.city    || undefined,
            degree:   v.degree  || undefined,
            field:    v.field   || undefined,
        });
    }

    private resetForm(): void {
        // Conserve les champs pré-remplis (city, degree, field) lors du reset partiel
        const keepCity   = this.leadForm.value.city;
        const keepDegree = this.leadForm.value.degree;
        const keepField  = this.leadForm.value.field;

        this.leadForm.reset({
            name:    '',
            surname: '',
            tel:     '',
            email:   '',
            statuts: 'lycéen',
            level:   '',
            city:    keepCity   || '',
            degree:  keepDegree || '',
            field:   keepField  || '',
        });
    }

    prefillFromSearch(): void {
        this.advisorService.lastSearchParams$.subscribe(params => {
            if (!params) return;
            if (params.diplome) this.leadForm.patchValue({ degree: params.diplome });
            if (params.domaine) this.leadForm.patchValue({ field:  params.domaine });
        }).unsubscribe();
    }

    ngOnInit(): void {
        this.prefillFromSearch();
    }
}
