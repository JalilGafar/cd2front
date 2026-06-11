import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { OrientationService } from '../../orientation.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    SharedComponentModule,
    NgxIntlTelInputModule
  ],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  
  newContact!: FormGroup  ;
  items!: SelectItem[];
  selectedItem!: string;
  // separateDialCode = true;
  // SearchCountryField = SearchCountryField;
  // CountryISO = CountryISO;
  // PhoneNumberFormat = PhoneNumberFormat;
 
  // preferredCountries: CountryISO[] = [CountryISO.UnitedStates, 
  //  CountryISO.UnitedKingdom];

  constructor(private formBuilder: FormBuilder,
              private orientationService: OrientationService,
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object) {
                this.items = [];
                for (let i = 1970; i < 2010; i++) {
                    this.items.push({ label:''+ i, value: i });
                }
              }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newContact  = this.formBuilder.group({
      nom : [null, [Validators.required]],
      prenom: [null, [Validators.required]],
      born: [null, [Validators.required]], 
      pays:  [null, [Validators.required]],
      email:  [null, [Validators.required]],
      phone: new FormControl(null, [Validators.required]),
     // phone: [null, [Validators.required]]
    })
  }


  get nom(){
    return this.newContact.get('nom');
  }
  get prenom(){
    return this.newContact.get('prenom');
  }
  get born(){
    return this.newContact.get('born');
  }
  get pays(){
    return this.newContact.get('pays');
  }
  get email(){
    return this.newContact.get('email');
  }
  get phone(){
    return this.newContact.get('phone');
  }

  onSubmitForm(){
    this.orientationService.saveContact(this.newContact.value);
    this.appRout.navigate( ['orientation/resultats/'] );
   // console.log(this.newContact.value)
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if(ctrl.hasError('required')){
      return 'Ce champ est requis'
    }else{
      return null
    }
  }

}
