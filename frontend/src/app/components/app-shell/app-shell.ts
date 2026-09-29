import { Component, input } from '@angular/core';
import { UiBox } from '../../ui/layout/box/box';
import { UiContainer } from '../../ui/layout/container/container';
import { UiHStack } from '../../ui/layout/hstack/hstack';
import { UiStack } from '../../ui/layout/stack/stack';
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
