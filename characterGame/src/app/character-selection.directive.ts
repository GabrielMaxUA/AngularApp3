// src/app/character-selection.directive.ts
import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Character } from './models/character.model';

@Directive({
  selector: '[appCharacterSelection]'
})
export class CharacterSelectionDirective {
  @Input('appCharacterSelection') character!: Character; // The character for this element
  @Output() characterSelected = new EventEmitter<Character>(); // Emits the selected character

  constructor() {}

  // Listen for clicks on elements with this directive
  @HostListener('click') onClick() {
    this.characterSelected.emit(this.character); // Emit the character on click
  }
}
