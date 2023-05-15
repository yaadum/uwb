import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";

export const mapJsonToObject = (data: any, classReference: any): any => {
  const jsonStr: string = JSON.stringify(data);
  const jsonObj: object = JSON.parse(jsonStr);
  const jsonConvert: JsonConvert = new JsonConvert();
  jsonConvert.operationMode = OperationMode.ENABLE;
  jsonConvert.ignorePrimitiveChecks = false;
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

  let objToMap: object | undefined;
  try {
    objToMap = jsonConvert.deserialize(jsonObj, classReference);
  } catch (e) {
    console.log(e as Error);
  }
  return objToMap;
};
