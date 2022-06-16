import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MiaAuthInterceptor, MiaAuthModule, MIA_AUTH_PROVIDER } from '@agencycoda/mia-auth';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MiaCoreModule, MIA_GOOGLE_STORAGE_PROVIDER } from '@agencycoda/mia-core';
import { MiaTableModule } from '@agencycoda/mia-table';
import { MiaFormModule } from '@agencycoda/mia-form';
import { MiaLoadingModule } from '@agencycoda/mia-loading';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientService } from './services/client.service';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // Agency Coda Modules
    MiaCoreModule,
    MiaAuthModule,
    MiaTableModule,
    MiaLoadingModule,
    MiaFormModule,

    // Other Modules
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: MIA_AUTH_PROVIDER,
      useValue: {
        baseUrl: environment.baseUrl
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MiaAuthInterceptor,
      multi: true
    },
    {
      provide: MIA_GOOGLE_STORAGE_PROVIDER,
      useValue: {
        bucket: environment.cloudStorageBucket
      }
    },
    ClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
