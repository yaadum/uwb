import { parse, ParseConfig, ParseError, ParseResult } from "papaparse";

export class CsvFileParser {
  constructor(private pushDataCallback: any) {}

  private getConfig(): ParseConfig {
    const config: ParseConfig = {
      delimiter: "", // auto-detect
      newline: "", // auto-detect
      quoteChar: '"',
      header: true,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: false,
      step: undefined,
      complete: this.completeCallback,
      error: this.errorCallback,
      download: false,
      skipEmptyLines: true,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined,
      transform: undefined,
    };
    return config;
  }

  public parseFile(file: File | null) {
    // @ts-ignore TS2345
    parse(file, this.getConfig());
  }

  // @ts-ignore TS6133
  completeCallback = (result: ParseResult, file?: File) => {
    // @ts-ignore TS2532
    console.log(
      // @ts-ignore TS2532
      "Total records in file " + file.name + " are: " + result.data.length
    );
    this.pushDataCallback(result.data);
  };

  // @ts-ignore TS6133
  errorCallback(error: ParseError, file?: File): void {
    // @ts-ignore TS2532
    console.log("csv error: " + error.message);
  }
}
