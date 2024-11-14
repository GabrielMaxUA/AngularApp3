import { Component } from '@angular/core';
import { Character } from '../models/character.model';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent {
  characters: Character[] = [];
  userCharacter: Character | null = null;
  currentView: 'characterSelection' | 'battleScreen' = 'characterSelection';

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characters = this.characterService.getCharacters();
  }

  onCharacterSelected(character: Character): void{
    this.userCharacter = character;
  }

  onNameSubmitted(name: string): void {
    if (this.userCharacter) {
      this.userCharacter.name = name;
      this.currentView = 'battleScreen';
    }
  }

  goToCharacterSelection(): void {
    this.userCharacter = null; // Reset character selection
    this.currentView = 'characterSelection'; // Switch to character selection screen
  }
  
}
