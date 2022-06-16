import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-message-dialog-confirm",
  template: `
    <h1 mat-dialog-title>{{message}}</h1>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">{{cancelButton}}</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>{{confirmButton}}</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  cancelButton = "Cancelar";
  confirmButton = "Aceptar";
  message = "";

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cancelButton = data.cancelButton || this.cancelButton;
    this.confirmButton = data.confirmButton || this.confirmButton;
    this.message = data.message || this.message;
  }
}
