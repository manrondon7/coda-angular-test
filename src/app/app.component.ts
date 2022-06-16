import { MiaField, MiaFormConfig, MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';
import { MiaTableComponent, MiaTableConfig } from '@agencycoda/mia-table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { Client } from './entities/client';
import { ClientService } from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('tableComp') tableComponent!: MiaTableComponent;
  tableConfig: MiaTableConfig = new MiaTableConfig();
  formConfig: MiaFormModalConfig = new MiaFormModalConfig();

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) {
    this.clientService.all().then(resp => console.log(resp))
  }

  ngOnInit(): void {
    this.loadClientsTableConfig();
    this.loadClientsFormConfig();
  }

  loadClientsTableConfig(): void {
    this.tableConfig.service = this.clientService;
    this.tableConfig.id = 'clients-table';
    this.tableConfig.columns = [
      { key: 'firstName', type: 'string', title: 'Nombre', field_key: 'firstname'},
      { key: 'lastName', type: 'string', title: 'Apellido', field_key: 'lastname'},
      { key: 'email', type: 'string', title: 'Mail', field_key: 'email' },
      {
        key: 'more', type: 'more', title: '',
        extra: {
          actions: [
            { icon: 'create', title: 'Editar', key: 'edit' },
            { icon: 'delete', title: 'Eliminar', key: 'remove' },
          ]
        }
      }
    ];

    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No tienes cargado ningun cliente todavia';

    this.tableConfig.onClick.subscribe(result => {
      switch (result.key) {
        case 'edit':
          this.openCreateEditModal(result.item);
          break;
        case 'remove':
          this.removeClient(result.item);
          break;
        default:
          break;
      }
      console.log(result);
    });
  }

  loadClientsFormConfig(): void {
    this.formConfig.service = this.clientService;
    this.formConfig.titleNew = 'Registrar Cliente';
    this.formConfig.titleEdit = 'Editar Cliente';

    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      { key: 'firstname', type: MiaField.TYPE_STRING, label: 'Nombre', validators: [Validators.required] },
      { key: 'lastname', type: MiaField.TYPE_STRING, label: 'Apellido', validators: [Validators.required] },
      { key: 'email', type: MiaField.TYPE_EMAIL, label: 'Correo Electrónico', validators: [Validators.required] },
      { key: 'address', type: MiaField.TYPE_STRING, label: 'Dirección', validators: [Validators.required] },
    ];
    config.errorMessages = [
      { key: 'required', message: 'Requerimos saber su "%label%".' }
    ];
    this.formConfig.config = config;
  }

  openCreateEditModal(client?: Client): void {
    this.formConfig.item = client ?? new Client();
    this.dialog.open(MiaFormModalComponent, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: this.formConfig
    }).afterClosed().subscribe((result) => {
      if(result !== "") this.tableComponent.loadItems()
    });
  }

  removeClient(client: Client): void{
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: "¿Seguro que quieres eliminar el cliente?"
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.clientService.delete(`${environment.baseUrl}/client/remove/${client.id.toString()}`).then(() => this.tableComponent.loadItems())
      }
    })
  }
}
