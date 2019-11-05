import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
    selector: '[appSetReference]'
})
export class SetReferenceDirective implements OnChanges{
    @Input('appSetReference') text: string;

    constructor(private el: ElementRef) {}

    public ngOnChanges(): void {
        this.el.nativeElement.innerText += this.text;
    }
}
