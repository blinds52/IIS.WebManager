import { NgModule, Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'toolbar',
    template: `
        <div>
            <button class="delete" title="Delete" (click)="onDelete.next()" *ngIf="delete !== null" [attr.disabled]="delete === false || null"></button>
            <button title="Upload" (click)="onUpload.next()" *ngIf="upload !== null" [attr.disabled]="upload === false || null"><i class="fa fa-upload"></i></button>
            <button title="New Folder" (click)="onNewFolder.next()" *ngIf="newFolder !== null" [attr.disabled]="newFolder === false || null"><i class="fa fa-folder manila"></i></button>
            <button title="New File" (click)="onNewFile.next()" *ngIf="newFile !== null" [attr.disabled]="newFile === false || null"><i class="fa fa-file-o"></i></button>
            <button class="refresh" title="Refresh" (click)="onRefresh.next()" *ngIf="refresh !== null" [attr.disabled]="refresh === false || null"></button>
        </div>
        <div class="clear"></div>
    `,
    styles: [`
        ul {
            margin-bottom: 0;
        }

        .grid-item {
            padding: 0;
        }

        .grid-item:last-of-type {
            border-bottom: none;
        }

        button span {
            font-size: 85%;
        }

        button {
            border: none;
            float: right;
        }
    `]
})
export class ToolbarComponent {
    @Input() refresh: boolean;
    @Input() newFile: boolean = null;
    @Input() newFolder: boolean = null;
    @Input() upload: boolean = null;
    @Input() delete: boolean = null;

    @Output() onRefresh: EventEmitter<any> = new EventEmitter<any>();
    @Output() onNewFile: EventEmitter<any> = new EventEmitter<any>();
    @Output() onNewFolder: EventEmitter<any> = new EventEmitter<any>();
    @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
}

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        ToolbarComponent
    ],
    declarations: [
        ToolbarComponent
    ]
})
export class Module { }
