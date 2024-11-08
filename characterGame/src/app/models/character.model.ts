
export class Character {
  originalHealth: number;
//model of a character
  constructor(
    public type: string,
    public health: number,
    public strength: number,
    public dexterity: number,
    public magic: number,
    public image: string,
    public name?: string
  ) {
    this.originalHealth = health; // Sets the original health when the character is created
  }
}
