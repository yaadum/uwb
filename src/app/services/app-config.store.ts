export class AppConfigStore {
  private static appConfig: { [key: string]: any };
  private static versionInfo: { [key: string]: any };

  private constructor() {}

  static setConfig(config: { [key: string]: any }) {
    AppConfigStore.appConfig = config;
  }

  static getConfig() {
    return AppConfigStore.appConfig;
  }

  static getValueArray(parentNode: string) {
    return AppConfigStore.appConfig[parentNode];
  }

  static getValue(parentNode: string, key: string) {
    return AppConfigStore.appConfig[parentNode][key];
  }

  // app version info
  static setVersionInfo(versionInfo: { [key: string]: any }) {
    AppConfigStore.versionInfo = versionInfo;
  }

  static getVersionInfo() {
    return AppConfigStore.versionInfo;
  }
}
