import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../services/character.service';
import { Character } from '../models/character.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  // Define properties
  characters: Character[] = []; // List of all available characters
  userCharacter: Character | null = null; // User-selected character
  enemyCharacter: Character | null = null; // Randomly chosen enemy character
  userCharacterName: string = ''; // Store user-entered name for the character
  fightReady = false; // Flag indicating readiness for the fight
  round = 1; // Track the round number in the current fight
  showLog = false; // Toggle log visibility
  logBook: {
    round: number;
    userName: string;
    userCharacter: string;
    userDamage: number;
    enemyDamage: number;
    enemyCharacter: string;
    userHealth: number;
    enemyHealth: number;
    result: 'User Wins' | 'Enemy Wins' | 'Fight is on';
  }[] = []; // Store logs for each round
  fightMessages: { text: string; type: 'user' | 'enemy' }[] = []; // Messages displayed during fight
  fightStatus: '' | 'win' | 'lose' = ''; // Track fight status

  constructor(private characterService: CharacterService, private http: HttpClient) {}

  ngOnInit(): void {
    this.characters = this.characterService.getCharacters(); // Load available characters
    this.loadLog(); // Load fight log from server on initialization
  }

  chooseUserCharacter(character: Character): void {
    // Set user-selected character details
    this.userCharacter = new Character(
      character.type,
      character.health,
      character.strength,
      character.dexterity,
      character.magic,
      character.image,
      character.name
    );

    this.resetUserCharacter(); // Reset stats for a new fight
    this.chooseEnemyCharacter(); // Randomly select an enemy character
    this.fightReady = false; // Reset fight-ready flag
    this.fightStatus = ''; // Reset fight status
    this.showLog = false; // Hide log if visible
  }

  setCharacterName(): void {
    // Set name entered by the user for the selected character
    if (this.userCharacter) {
      this.userCharacter.name = this.userCharacterName;
      this.fightReady = true; // Mark fight as ready
    }
  }

  chooseEnemyCharacter(): void {
    // Randomly pick an enemy character
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.enemyCharacter = new Character(
      this.characters[randomIndex].type,
      this.characters[randomIndex].health,
      this.characters[randomIndex].strength,
      this.characters[randomIndex].dexterity,
      this.characters[randomIndex].magic,
      this.characters[randomIndex].image,
      this.characters[randomIndex].name
    );
  }

  startFight(): void {
    // Handle the fight logic between user and enemy
    if (!this.userCharacter || !this.enemyCharacter) return;
    this.fightMessages = []; // Clear previous fight messages

    // User attacks enemy
    const userAttack = this.calculateDamage(this.userCharacter);
    this.enemyCharacter.health -= userAttack;
    this.fightMessages.push({
      text: `${this.userCharacter.name} dealt ${userAttack} damage to ${this.enemyCharacter.name}.`,
      type: 'user'
    });

    let roundResult: 'Fight is on' | 'Enemy Wins' | 'User Wins' = 'Fight is on'; // Default to ongoing fight

    // Check if enemy is defeated
    if (this.enemyCharacter.health <= 0) {
      this.enemyCharacter.health = 0;
      this.fightStatus = "win"; // Set status to win
      this.fightMessages.push({
        text: `Congratulations!!! You won!`,
        type: 'user'
      });
      roundResult = 'User Wins'; // Mark result as User Wins
      return;
    }

    // Enemy attacks back
    const enemyAttack = this.calculateDamage(this.enemyCharacter);
    this.userCharacter.health -= enemyAttack;
    this.fightMessages.push({
      text: `${this.enemyCharacter.type} deals ${enemyAttack} damage to Your Character.`,
      type: 'enemy'
    });

    // Check if user is defeated
    if (this.userCharacter.health <= 0) {
      this.userCharacter.health = 0;
      this.fightStatus = 'lose'; // Set status to lose
      this.fightMessages.push({
        text: `Your enemy's ${this.enemyCharacter.type} defeated you(((!`,
        type: 'enemy'
      });
      roundResult = 'Enemy Wins'; // Mark result as Enemy Wins
    }

    // Log the round results
    this.logBook.push({
      userName: this.userCharacter?.name ?? '',
      userCharacter: this.userCharacter.type,
      enemyCharacter: this.enemyCharacter.type,
      round: this.round,
      userDamage: userAttack,
      enemyDamage: enemyAttack,
      userHealth: this.userCharacter.health,
      enemyHealth: this.enemyCharacter.health,
      result: roundResult
    });

    // Save log after each round
    this.saveLog();

    // Increment the round if the fight is ongoing
    if (roundResult === 'Fight is on') {
      this.round++; // Increment round number
    }
  }

  getMessages() {
    // Retrieve fight messages
    return this.fightMessages;
  }

  calculateDamage(character: Character): number {
    // Calculate damage based on character's attributes
    const attributeSum = character.strength + character.dexterity + character.magic;
    const baseDamage = Math.floor(attributeSum / 5);
    const randomModifier = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
    return Math.max(10, randomModifier - baseDamage); // Ensure non-negative damage
  }

  resetUserCharacter(): void {
    // Reset round for the user-selected character
    if (this.userCharacter) {
      this.round = 1;
    }
  }

  fightAnotherEnemy(): void {
    // Prepare for a new enemy by resetting user stats
    if (this.userCharacter) {
      this.characterService.resetCharacterStats(this.userCharacter);
    }
    this.chooseEnemyCharacter(); // Select new enemy character
    this.fightReady = true;
    this.fightStatus = ''; // Reset fight status
    this.fightMessages = []; // Clear messages
    this.fightMessages.push({
      text: `Your character's stats went up.`,
      type: 'user'
    });
    this.round = 1;
  }

  tryAgain(): void {
    // Reset the state for selecting a new character
    this.userCharacter = null;
    this.enemyCharacter = null;
    this.fightReady = false;
    this.fightMessages = []; // Clear messages
  }

  getLog(): void {
    // Toggle log visibility
    this.showLog = !this.showLog;
  }

  saveLog(): void {
    // Save log data to server via POST request
    this.http.post('http://localhost:3000/save-log', this.logBook)
      .subscribe(
        response => console.log('Log saved successfully:', response),
        error => console.error('Error saving log:', error)
      );
  }

  loadLog(): void {
    // Load log data from server via GET request
    this.http.get<any[]>('http://localhost:3000/load-log')
      .subscribe(
        data => {
          this.logBook = data; // Set loaded data to logBook
        },
        error => console.error('Error loading log:', error)
      );
  }

  toggleLog(): void {
    // Toggle log visibility
    this.showLog = !this.showLog;
  }
}
