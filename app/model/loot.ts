import { BaseRecord } from "./baserecord";


type LootMutation = {
    id?: string;
    itemName?: string;    
    player?: string;    
    class?: string;    
    date?: string; 
    itemID: string; 
    itemString: string; 
    
  }; 
  
  export type LootRecord = LootMutation & BaseRecord ;