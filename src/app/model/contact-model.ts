export class Contact {
    nom!: string;
    prenom!: string;
    born!: number;
    pays!: string;
    email!: string;
    phone!: {
        countryCode:string;
        dialCode:string;
        e164Number:string;
        internationalNumber:string;
        nationalNumber:string;
        number:string;
    };
}