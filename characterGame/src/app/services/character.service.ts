// src/app/services/character.service.ts
import { Injectable } from '@angular/core';
import { Character } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
// setting a list of characters available
export class CharacterService {
  characters: Character[] = [
    new Character('Orc', 120, 80, 40, 20,   'orc.webp'),
    new Character('Human', 100, 60, 70, 30, 'human.webp'),
    new Character('Wizard', 80, 30, 50, 90, 'wizzard.webp'),
    new Character('Elf', 90, 40, 80, 60,    'elf.webp')
  ];
//getting an array of characters
  getCharacters() {
    return this.characters;
  }
//getting a character from array based on index
  getCharacter(index: number) {
    return this.characters[index];
  }
//resetting the character after win
  resetCharacterStats(character: Character) {
    character.health = character.originalHealth * 1.1;
    character.strength += 30;
    character.dexterity += 30;
    character.magic += 30;
  }
}
