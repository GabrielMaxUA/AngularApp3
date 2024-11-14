import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../models/character.model';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.css']
})
export class CharacterFormComponent {
  @Input() character!: Character;
  @Output() nameSubmitted = new EventEmitter<string>();
  name: string = '';

  submitName(): void {
    if (this.name.trim()) {
      this.nameSubmitted.emit(this.name);
    }
  }
}
