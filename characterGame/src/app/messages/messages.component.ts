import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class Messages{
  @Input() messages: { 
    text: string; type: 'user' | 'enemy' }[] = []; // Accept messages as input

}