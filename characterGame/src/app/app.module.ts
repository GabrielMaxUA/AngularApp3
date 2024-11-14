import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BattleScreenComponent } from './battle-screen/battle-screen.component';
import { CharacterFormComponent } from './character-form/character-form.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CharacterSelectionDirective } from './character-selection.directive';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Messages } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    BattleScreenComponent,
    CharacterFormComponent,
    MainScreenComponent,
    CharacterSelectionDirective,
    Messages
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    FormsModule,
    MatCardModule,
    MatGridListModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
