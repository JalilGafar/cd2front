import { NgModule } from "@angular/core";
import { PrimengModule } from "./primeng.modules";
import { HeadmsgComponent } from "../headmsg/headmsg.component";
import { StartComponent } from "../start/start.component";
import { PubFirstComponent } from "./components/pub-first/pub-first.component";
import { PubInterestItemComponent } from "./components/pub-interest-item/pub-interest-item.component";
import { SideInfoComponent } from "./components/side-info/side-info.component";

@NgModule({
    declarations:[
        HeadmsgComponent,
        StartComponent,
        PubFirstComponent,
        PubInterestItemComponent,
        SideInfoComponent
    ],
    imports: [
        PrimengModule
    ],
    exports: [
        PrimengModule,
        HeadmsgComponent,
        StartComponent,
        PubFirstComponent,
        PubInterestItemComponent,
        SideInfoComponent
    ]
})

export class SharedComponentModule {}