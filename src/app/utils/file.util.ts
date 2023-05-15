import { Injectable } from "@angular/core";

@Injectable()
export class FileUtil {
  constructor() {}

  static isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  static getHeaderArray(csvRecordsArr: any, tokenDelimeter: any) {
    const headers = csvRecordsArr[0].split(tokenDelimeter);
    const headerArray = [];
    // for (let j = 0; j < headers.length; j++) {
    for (const j of headers) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  static validateHeaders(origHeaders: any, fileHeaaders: any) {
    if (origHeaders.length !== fileHeaaders.length) {
      return false;
    }

    let fileHeaderMatchFlag = true;
    for (let j = 0; j < origHeaders.length; j++) {
      if (origHeaders[j] !== fileHeaaders[j]) {
        fileHeaderMatchFlag = false;
        break;
      }
    }
    return fileHeaderMatchFlag;
  }

  static getDataRecordsArrayFromCSVFile(
    csvRecordsArray: any,
    headerLength: any,
    validateHeaderAndRecordLengthFlag: any,
    tokenDelimeter: any
  ) {
    const dataArr = [];

    for (let i = 0; i < csvRecordsArray.length; i++) {
      const data = csvRecordsArray[i].split(tokenDelimeter);

      if (validateHeaderAndRecordLengthFlag && data.length !== headerLength) {
        if (data === "") {
          alert(
            "Extra blank line is present at line number " +
              i +
              ", please remove it."
          );
          return null;
        } else {
          alert(
            "Record at line number " +
              i +
              " contain " +
              data.length +
              " tokens, and is not matching with header length of :" +
              headerLength
          );
          return null;
        }
      }

      const col = [];
      // for (let j = 0; j < data.length; j++) {
      for (const j of data) {
        col.push(data[j]);
      }
      dataArr.push(col);
    }
    return dataArr;
  }
}
