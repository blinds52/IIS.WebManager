import { Component, Input, Output, Inject, ViewChild, EventEmitter } from '@angular/core';

import { Selector } from '../common/selector';
import { NotificationService } from '../notification/notification.service';
import { Humanizer } from '../common/primitives';

import { FilesService } from '../files/files.service';
import { FileNavService } from '../files/file-nav.service';
import { ApiFile, ApiFileType } from './file';

@Component({
    selector: 'file',
    template: `
        <div *ngIf="model && !(_editing && _location)" class="grid-item row" [class.background-editing]="_editing" (keyup.f2)="onRename($event)" tabindex="-1">
            <div class="col-xs-9 col-sm-5 col-lg-4 fi" [ngClass]="[model.type, model.extension, (isRoot ? 'location' : '')]">
                <div *ngIf="!_editing">
                    <a class="color-normal hover-color-active" [href]="href" nofocus (click)="onClickName($event)"><i></i>{{model.alias || model.name}}</a>
                </div>
                <div *ngIf="_editing">
                    <i></i>
                    <input class="form-control inline-block" type="text" 
                           [ngModel]="model.name"
                           (ngModelChange)="rename($event)"
                           (keyup.esc)="onCancel($event)"
                           (keyup.delete)="$event.stopImmediatePropagation()"
                           required throttle autofocus/>
                </div>
            </div>
            <div class="col-sm-3 col-md-2 hidden-xs valign support">
                <span *ngIf="model.last_modified">{{displayDate}}</span>
            </div>     
            <div class="col-md-2 visible-lg visible-md valign support">
                {{this.model.description}}
            </div>
            <div class="col-md-1 visible-lg visible-md valign text-right support">
                <span *ngIf="model.size">{{getSize()}}</span>
            </div>
            <div class="actions">
                <div class="selector-wrapper">
                    <button title="More" (click)="openSelector($event)" (dblclick)="prevent($event)" [class.background-active]="(selector && selector.opened) || false">
                        <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <selector [right]="true">
                        <ul>
                            <li><button *ngIf="!isRoot" class="edit" title="Rename" (click)="onRename($event)">Rename</button></li>
                            <li><button *ngIf="isRoot" class="edit" title="Edit" (click)="onEdit($event)">Edit</button></li>
                            <li><button class="download" title="Download" *ngIf="model.type=='file'" (click)="onDownload($event)">Download</button></li>
                            <li><button *ngIf="!isRoot" class="delete" title="Delete" (click)="onDelete($event)">Delete</button></li>
                            <li><button *ngIf="isRoot" class="delete" title="Delete" (click)="onDelete($event)">Remove</button></li>
                        </ul>
                    </selector>
                </div>
            </div>
        </div>
        <edit-location *ngIf="_location && _editing" [model]="_location" (cancel)="cancel()" (dblclick)="prevent($event)"></edit-location>
    `,
    styles: [`
        a {
            display: inline;
            background: transparent;
        }

        [class*="col-"] {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .support {
            font-size: 85%;
        }

        .form-control {
            width: 90%;
        }

        .row {
            margin: 0px;
        }

        .selector-wrapper {
            position: relative;
        }

        selector {
            position:absolute;
            right:0;
            top: 32px;
        }

        selector button {
            min-width: 125px;
            width: 100%;
        }
    `],
    styleUrls: [
        'app/files/file-icons.css'
    ]
})
export class FileComponent {
    @Input() model: ApiFile;
    @Output() modelChanged: EventEmitter<any> = new EventEmitter();
    private _date = null;
    private _location = null;

    @ViewChild(Selector) selector: Selector;

    private _editing = false;

    constructor(@Inject("FilesService") private _svc: FilesService,
                private _nav: FileNavService) {
    }

    private get isRoot(): boolean {
        return this.model.isLocation;
    }

    private get href() {
        return window.location.pathname + "#" + this.model.physical_path;
    }

    private get displayDate(): string {
        if (!this._date) {
            this._date = Humanizer.date(this.model.last_modified);
        }

        return this._date;
    }

    private rename(name: string) {
        if (this._editing && name) {
            this._svc.rename(this.model, name);
            this.modelChanged.emit(this.model);
        }

        this._editing = false;
    }

    private onRename(e: Event) {
        e.preventDefault();
        this.selector.close();

        this._editing = true;
    }

    private onEdit(e: Event) {
        e.preventDefault();

        this._svc.getLocation(this.model.id)
            .then(loc => {
                this._location = loc;
                this._editing = true;
            })
    }

    private onCancel(e: Event) {
        e.preventDefault();
        this.selector.close();

        this.cancel();
    }

    private onDelete(e: Event) {
        e.preventDefault();
        this.selector.close();

        let msg = this.model.isLocation ? "Are you sure you want to remove the root folder '" + this.model.name + "'?" :
            "Are you sure you want to delete '" + this.model.name + "'?";

        if (confirm(msg)) {

            if (!this.model.isLocation) {
                this._svc.delete([this.model]);
            }
            else {
                this._svc.deleteLocations([this.model]);
            }
        }
    }

    private onDownload(e: Event) {
        e.preventDefault();
        this.selector.close();

        this._svc.download(this.model);
    }

    private prevent(e: Event) {
        e.preventDefault();
    }

    private cancel() {
        if (this.selector) {
            this.selector.close();
        }

        this._editing = false;
        this._location = false;
    }

    private openSelector(e: Event) {
        this.selector.toggle();
    }

    private onClickName(e: Event) {
        e.preventDefault();
        this._nav.load(this.model.physical_path);
    }

    private getSize() {
        return this.model.size ? Humanizer.number(Math.ceil(this.model.size / 1024)) + ' KB' : null;
    }
}
