import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [EditDialogComponent],
  imports: [
    CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatDialogModule 
  ],
  exports: [EditDialogComponent],
})
export class ComponentsModule {}
