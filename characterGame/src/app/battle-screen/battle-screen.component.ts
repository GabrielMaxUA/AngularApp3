// src/app/battle-screen/battle-screen.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Character } from '../models/character.model';
import { CharacterService } from '../services/character.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-battle-screen',
  templateUrl: './battle-screen.component.html',
  styleUrls: ['./battle-screen.component.css']
})
export class BattleScreenComponent implements OnInit {
  @Input() userCharacter!: Character; // Mark as Input to receive data from parent
  @Output() restart = new EventEmitter<void>();
  
  characters: Character[] = []; 
  enemyCharacter: Character | null = null; 
  userCharacterName: string = ''; 
  fightReady = false; 
  round = 1; 
  showLog = false; 
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
  }[] = []; 
  fightMessages: { text: string; type: 'user' | 'enemy' }[] = []; 
  fightStatus: '' | 'win' | 'lose' = '';
   

  constructor(private characterService: CharacterService, private http: HttpClient) {}

  ngOnInit(): void {
    this.characters = this.characterService.getCharacters();
    this.chooseRandomEnemy();
    this.loadLog();
  }

  chooseRandomEnemy(): void {
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.enemyCharacter = new Character(
      this.characters[randomIndex].type,
      this.characters[randomIndex].health,
      this.characters[randomIndex].strength,
      this.characters[randomIndex].dexterity,
      this.characters[randomIndex].magic,
      this.characters[randomIndex].image
    );
  }

  startFight(): void {
    // Handle the fight logic between user and enemy
    if (!this.userCharacter || !this.enemyCharacter) return;
    this.fightMessages = []; // Clear previous fight messages
    this.fightMessages.push({ text: 'Let the strongest win!', type: 'user' });
    // User attacks enemy
    const userAttack = this.calculateDamage(this.userCharacter);
    this.enemyCharacter.health -= userAttack;
    this.fightMessages.push({
      text: `${this.userCharacter.name} dealt ${userAttack} damage to ${this.enemyCharacter.type}.`,
      type: 'user'
    });

    let roundResult: 'Fight is on' | 'Enemy Wins' | 'User Wins' = 'Fight is on'; // Default to ongoing fight

    // Check if enemy is defeated
    if (this.enemyCharacter.health <= 0) {
      this.enemyCharacter.health = 0;
      this.fightStatus = "win"; 
      this.fightMessages.push({
        text: `Congratulations!!! You won!`,
        type: 'user'
      });
      roundResult = 'User Wins'; // Mark result as User Wins

      // Update user stats and generate a new enemy
      this.updateUserStats();
      this.chooseRandomEnemy(); // Generate a new enemy

      return; // Exit after winning
    }

    // Enemy attacks back if not defeated
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
        text: `Your enemy's ${this.enemyCharacter.type} defeated you!`,
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
      userHealth: Math.round(this.userCharacter.health),
      enemyHealth: Math.round(this.enemyCharacter.health),
      result: roundResult
    });

    // Save log after each round
    this.saveLog();

    // Increment the round if the fight is ongoing
    if (roundResult === 'Fight is on') {
      this.round++; // Increment round number
    }
  }

  updateUserStats(): void {
    // Update the user's stats after winning
    this.userCharacter.health = Math.round(this.userCharacter.originalHealth * 1.1);
    this.userCharacter.strength += 5;
    this.userCharacter.dexterity += 5;
    this.userCharacter.magic += 5;

    // Add a message about the updated stats
    this.fightMessages.push({
      text: `Your character's stats have improved: +10% Health, +5 Strength, +5 Dexterity, +5 Magic.`,
      type: 'user'
    });
  }

  calculateDamage(character: Character): number {
    // Calculate damage based on character's attributes
    const attributeSum = character.strength + character.dexterity + character.magic;
    const baseDamage = Math.floor(attributeSum / 5);
    const randomModifier = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
    return Math.max(10, randomModifier - baseDamage); // Ensure non-negative damage
  }

  restartGame(): void {
    this.characterService.resetCharacterStats(this.userCharacter);
    this.fightStatus = ''; // Reset fight status
    this.round = 1; // Reset round
    this.fightMessages = []; // Clear messages
    this.restart.emit(); // Notify parent component to restart
    this.showLog = false;
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

  addLogEntry(logEntry: any): void {
    this.logBook.push(logEntry);
    this.saveLog(); // Save the log after each entry
  }
}
