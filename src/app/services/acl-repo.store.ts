export class AclRepo {
  private static KEY_PERMISSION_ACL = "permissionAcls";
  private static KEY_PATH_ACL = "pathAcls";
  public static PATH_PREFIX = "PORTAL_PATH_";
  public static PATH_WILD_CARD = "**";

  private static aclConfig: { [key: string]: any };

  private constructor() {}

  static setConfig(config: { [key: string]: any }) {
    AclRepo.aclConfig = config;
  }

  private static getValue(parentNode: string, key: string) {
    return AclRepo.aclConfig[parentNode][key];
  }

  static getPermissionAcl(key: string) {
    return AclRepo.getValue(AclRepo.KEY_PERMISSION_ACL, key);
  }

  static getPathAcl(key: string): any {
    return AclRepo.getValue(AclRepo.KEY_PATH_ACL, key);
  }
}
