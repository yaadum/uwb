export class TreeDataConverter2 {
    public static convert(dataArray: any) {
      const map: any = {};
      for (const obj of dataArray) {
        if (!(obj.value in map)) {
          map[obj.value] = {};
          map[obj.value].app = obj.app;
          map[obj.value].filter = obj.filter;
          map[obj.value].url = obj.url;
          map[obj.value].menu = obj.menu;
          map[obj.value].checked = obj.checked;
          map[obj.value].parent = obj.parent;
          map[obj.value].value = obj.value;
          map[obj.value].children = [];
        }
  
  
  
        const parent: any = obj.parent || "-";
        if (!(parent in map)) {
          map[parent] = {};
          map[parent].children = [];
        }
  
        map[parent].children.push(map[obj.value]);
      }
  
      return map["-"];
    }
  }