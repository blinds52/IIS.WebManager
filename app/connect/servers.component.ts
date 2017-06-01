﻿import { Component } from '@angular/core';
import { OptionsService } from '../main/options.service';

@Component({
    template: `
        <div class="sidebar crumb" [class.nav]="_options.active">
            <ul class="items">
                <li class="home"><a [routerLink]="['/']">Home</a></li>
                <li class="servers color-active">Add or Remove Servers</li>
                <hr />
            </ul>
            <vtabs>
                <item [name]="'Servers'" [ico]="'fa fa-wrench'">
                    <server-list></server-list>
                </item>
            </vtabs>
        </div>
    `,
    styles: [`
        .sidebar .home::before {content: "\\f015";}
        .sidebar .servers::before {content: "\\f233";}

        :host >>> .sidebar > vtabs .vtabs > .items {
            top: 143px;
        }

        :host >>> .sidebar > vtabs .items {
            top: 107px;
        }

        :host >>> .sidebar > vtabs .content {
            margin-top: 15px;
        }
    `]
})
export class ServersComponent {

    constructor(private _options: OptionsService) {
    }
}