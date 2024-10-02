import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
              private appRout : Router) {
                this.items = [];
                for (let i = 1970; i < 2010; i++) {
                    this.items.push({ label:''+ i, value: i });
                }
              }

  ngOnInit(): void {
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

  onSubmitForm(){
    this.orientationService.saveContact(this.newContact.value);
    this.appRout.navigate( ['orientation/resultats/'] );
   // console.log(this.newContact.value)
  }


}
