import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CarService {
    // methods to retrieve and return data
    getCars(){
        return 'the really Life'
    }
}