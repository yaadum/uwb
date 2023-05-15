export class DateFormatter {
  public static toJson(date: any): string {
    const dateFormat = new Date(date);
    return dateFormat.toJSON();
  }
}
