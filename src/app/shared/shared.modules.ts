import { NgModule } from "@angular/core";
import { PrimengModule } from "./primeng.modules";
import { HeadmsgComponent } from "../headmsg/headmsg.component";
import { StartComponent } from "../start/start.component";
import { PubFirstComponent } from "./components/pub-first/pub-first.component";
import { PubInterestItemComponent } from "./components/pub-interest-item/pub-interest-item.component";
import { SideInfoComponent } from "./components/side-info/side-info.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MyFilterPipe } from "./pipes/myfilter.pipe";
import { DomFilterPipe } from "./pipes/domFilter.pipe";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';

// import { NgxIntlTelInputModule } from "ngx-intl-tel-input-gg";

@NgModule({
    declarations:[
        DomFilterPipe,
        MyFilterPipe,
        HeadmsgComponent,
        StartComponent,
        PubFirstComponent,
        PubInterestItemComponent,
        SideInfoComponent
    ],
    imports: [
        PrimengModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        // NgxIntlTelInputModule
    ],
    exports: [
        // NgxIntlTelInputModule,
        DomFilterPipe,
        MyFilterPipe,
        PrimengModule,
        HeadmsgComponent,
        StartComponent,
        PubFirstComponent,
        PubInterestItemComponent,
        SideInfoComponent,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ]
})

export class SharedComponentModule {}