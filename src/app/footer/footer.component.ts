import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WhatsappTrackingService } from '../service/whatsapp-tracking.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private whatsappTracking: WhatsappTrackingService) {}

  contacterWhatsapp(event: Event): void {
    this.whatsappTracking.openWhatsapp('https://wa.me/237676476096', event);
  }
}
