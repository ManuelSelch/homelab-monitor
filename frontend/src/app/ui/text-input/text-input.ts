import { Directive } from "@angular/core";

@Directive({
    selector: 'input[uiTextInput]',
    host: { '[class]': 'classes'}
})
export class TextInput {
    protected classes = 'h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
}