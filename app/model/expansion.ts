import {BaseRecord} from "./baserecord";

type ExpansionMutation = {
    Id?: string;
    Name?: string;
    Seasons?: SeasonRecord[]
  };
  
  type SeasonMutation = {
    Id?: string;
    Name?: string;    
    StartDate?: string;
    EndDate?: string;
    Raids?: RaidRecord[];
  };

  type RaidMutation = {
    Id?: string;
    Name?: string;    
  };
  
  export type RaidRecord = RaidMutation & BaseRecord;
  export type SeasonRecord = SeasonMutation & BaseRecord;
  export type ExpansionRecord = ExpansionMutation & BaseRecord;
   