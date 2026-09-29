import { Directive } from "@angular/core";

@Directive({
    selector: 'select[uiSelect]',
    host: {
        '[class]': 'classes'
    }
})
export class Select {
    protected classes = 'h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring';
}