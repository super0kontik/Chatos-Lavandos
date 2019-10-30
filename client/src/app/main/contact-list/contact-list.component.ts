import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {AuthService} from "../../shared/services/auth.service";
//import {ContextMenuComponent} from "../../context-menu/context-menu.component";
import {MenuDirective} from "../../shared/directives/menu.directive";
import {Browser} from "@syncfusion/ej2-base";
import {ContextMenuComponent, MenuEventArgs, MenuItemModel} from '@syncfusion/ej2-angular-navigations';


@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, AfterViewInit {
    @Input() isDisplayed: boolean;
    @ViewChild(MenuDirective, {static: false}) menu: MenuDirective;

    public componentFactory: any;
    public menuComponent: any;
    public list: object[] = [];
    public roomId: string = '';
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(private socketService: SocketService,
                private chatService: ChatService,
                private authService: AuthService,
                private comFacRes: ComponentFactoryResolver,
    ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.chatService.currentRoomUsers.subscribe(users => {
                this.list = users;
            });
        }
        //this.componentFactory = this.comFacRes.resolveComponentFactory(ContextMenuComponent);

    }

    public ngAfterViewInit(): void {
        //this.menuComponent = this.menu.viewContainerRef;
    }

    // public onContextMenu(e): void {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     this.menuComponent.clear();
    //     const contextM = this.menuComponent.createComponent(this.componentFactory);
    //     browser.context.menu
    //     contextM.instance.setPosition(e.offsetX + 30, e.offsetY + 90);
    // }
}
