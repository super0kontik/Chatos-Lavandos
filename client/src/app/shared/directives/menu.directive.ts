import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appMenu]'
})
export class MenuDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }

}
