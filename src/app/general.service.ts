import { Injectable } from "@angular/core";
import { BEHAVIOR } from "./model/behavior";

@Injectable({
    providedIn: 'root'
})
export class GeneralService {
    
    scrollTo(element: string, behavior: BEHAVIOR): void {
        if (typeof document !== 'undefined') {
          let elementer = document.getElementById(element);
        
          (elementer as HTMLElement).scrollIntoView({behavior: behavior, block:"start", inline:"nearest"})
          // Manipulating the DOM here
       }
    }
}