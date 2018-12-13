import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KompassComponent } from './components/kompass/kompass.component';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    AppComponent,
    KompassComponent,
  ],
  imports: [
    BrowserModule
  ],
  // Our component is both here and in declarations
  entryComponents: [KompassComponent],
  // We do _NOT_ bootstrap anything at this time.
  // bootstrap: [AppComponent],
  // We need to tell angular it's ok to have web components.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const msgCompass = createCustomElement(KompassComponent, { injector: this.injector });
    customElements.define('msg-compass', msgCompass);
    console.log('Defined the custom element.');
  }
}
