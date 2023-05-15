import { Role } from "./role";

export abstract class RoleAccess {
  static ALLOWED_ROLES: string[] = [
    Role.OWNER,
    Role.ADMIN,
    Role.PRINCIPAL,
    Role.TEACHER,
    Role.STUDENT,
    Role.PARENT,
  ];
  static HOMEWORK_ADD_ACCESS: string[] = [Role.TEACHER];
}
