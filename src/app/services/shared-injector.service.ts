import { Injectable, Injector } from "@angular/core";

export let InjectorInstance: Injector;

@Injectable()
export class SharedInjector {
  public static set(injector: Injector) {
    InjectorInstance = injector;
  }
}
