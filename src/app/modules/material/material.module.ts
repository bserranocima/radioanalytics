import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatTabsModule,
  MatDatepickerModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDatepickerModule
  ],

  exports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDatepickerModule
  ],
  
  declarations: []
})
export class MaterialModule { }
