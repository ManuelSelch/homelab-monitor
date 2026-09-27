import { Component, input } from '@angular/core';
import { UiBox } from '../../ui/box/box';
import { UiContainer } from '../../ui/container/container';
import { UiHStack } from '../../ui/hstack/hstack';
import { UiStack } from '../../ui/stack/stack';
import { UiText } from '../../ui/text/text';
import { UiTitle } from '../../ui/title/title';

@Component({
  imports: [UiBox, UiContainer, UiHStack, UiStack, UiText, UiTitle],
  selector: 'app-shell',
  templateUrl: './app-shell.html',
})
export class AppShell {
  title = input.required<string>();
  subtitle = input.required<string>();
}
