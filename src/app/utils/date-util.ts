export class DateUtil {
  static ISO_FORMAT = "YYYY-MM-DD";

  //
  // accepted input formats
  //  ISO Date "2015-03-25" (The International Standard)
  //  Short Date "03/25/2015"
  //  Long Date "Mar 25 2015" or "25 Mar 2015"
  //
  // return format: 2020-02-27T10:09:35.000Z  (json format)
  //
  public static toJsonFormat(dateString: string): string {
    if (dateString === undefined || dateString === null || dateString === "") {
      return "";
    }
    const date = new Date(dateString);

    if (DateUtil.isValidDate(date)) {
      return date.toJSON();
    } else {
      return "";
    }
  }

  public static currDateInJsonFormat(): string {
    return DateUtil.toJsonFormat(new Date().toDateString());
  }

  // @ts-ignore TS2345
  public static isValidDate(date: any) {
    // @ts-ignore TS2345
    return date instanceof Date && !isNaN(date);
  }
}
