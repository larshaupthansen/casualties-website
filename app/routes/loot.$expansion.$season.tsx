// import type { FunctionComponent } from "react";
import { 
    LoaderFunctionArgs,
    MetaFunction,
  } from "@remix-run/node";

  import {
    useLoaderData,
  } from "@remix-run/react"
  
import { Database  } from "../database";
import { ExpansionRecord,  SeasonRecord } from "~/model/expansion";
import { LootRecord } from "~/model/loot";
import invariant from "tiny-invariant";

import { json } from "@remix-run/node";
import { loadVitePluginContext } from "@remix-run/dev/dist/vite/plugin";
import { log } from "node:console";



export const meta: MetaFunction = () => {
    return [
      { title: "Casualties Loot" },
      { name: "description", content: "Casualties Loot" },
    ];
  };

type LoaderType = { expansion: string,  season: string, expansions: ExpansionRecord[], loot: LootRecord[]};

type LootWithDate = LootRecord & { jsDate: Date};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.season, "Missing season param");
    invariant(params.expansion, "Missing season param");
    const season = params.season;
    const expansion = params.expansion;

    const [expansions, loot] = await Promise.all([
        loadExpansions(),
        loadLoot(),

     ]);
     return json({expansion, season, expansions, loot });

};
  
async function loadExpansions() {
    const db = new Database<ExpansionRecord>("raids");
    await db.Load();
    return await db.getAll() as ExpansionRecord[];
}

async function loadLoot() {
    const db = new Database<LootRecord>("loot");
    await db.Load();
    return await db.getAll() as LootRecord[];
}


export default function Loot() {

  const  {expansion, season, expansions, loot}  = useLoaderData<LoaderType>() ;

  const theExpansion = expansions.find( (e) => e.Id == expansion) as ExpansionRecord
  const theSeason  = theExpansion.Seasons?.find( (s) => s?.Id == season) as SeasonRecord;
 
  const seasonLoot = loot.map( (loot: LootRecord) => {
    const lootDateParts =  loot.date?.split("/");
    const lootDate = new Date(parseInt(lootDateParts[2])+2000,parseInt(lootDateParts[1])-1,parseInt(lootDateParts[0]));

    const datePart = {
      jsDate: lootDate
    };    
    return  { ...loot, ...datePart};
  }).filter( (loot : LootWithDate) => {
    // const lootDateParts =  loot.date?.split("/");
    // const lootDate = new Date(parseInt(lootDateParts[2])+2000,parseInt(lootDateParts[1])-1,parseInt(lootDateParts[0]));
    return (loot.jsDate > new Date(theSeason.StartDate))&& (loot.jsDate <= new Date(theSeason.EndDate))
  });

  const dates: Date[] = [];
  seasonLoot.forEach( (l) => {
    const lootDateParts = l.date?.split("/");
    const lootDate = new Date(parseInt(lootDateParts[2])+2000,parseInt(lootDateParts[1])-1,parseInt(lootDateParts[0]));
    if (dates.find( (d) => d.toString() == lootDate.toString())  == undefined)   {
      dates.push(lootDate);      
    }
  });
  
  return (
    <div className=" h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-16">
      <header className="flex flex-col items-center gap-9">

      <h1>{theExpansion.Name} - {theSeason.Name}</h1>
      <div >
        <ul className="loot-dates">

      {dates.sort((a,b)=> a.getTime() - b.getTime()).map((d: Date) => (
                  <li key={d.getTime()}  className="loot-date">
                   {d.toLocaleDateString('en-GB', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit'
                })}

                {seasonLoot.filter( (loot: LootWithDate)=> {                  
                  return  d.getTime() == loot.jsDate.getTime(); //lootDate ==  d;
                }).map((loot: LootWithDate) => {
                  const item = explodeItem(loot.itemString);
                  return (
                    <div className={`loot ${loot.class.toLowerCase()}`} key={loot.id}>
                      <div className="itemname">
                        
                      <a className="q3" 
                      href={`https://www.wowhead.com/item=${item.itemId}&bonus=${item.bonuslist()}`} target="_blank"
                      >
                        {loot.itemName}
                        </a>
                      </div>
                      <div className={`looter ${loot.class.toLowerCase()}`}>
                        {shortenName(loot.player)}
                      </div>                    
                    </div>
                  )
                })}
                  </li>
                ))}
        </ul>
      </div>
      </header> 
    </div>
    </div>    
  );
}

function shortenName(name: string) {
  return name.substring(0,name.indexOf("-"));
}

function explodeItem(itemString: string) : WowItem {

  const parts = itemString.split(":");

  const theItem = new WowItem();
  theItem.itemId = parseInt(parts[1]); 

  const noBonusIds  = parseInt(parts[13]);
  for(let b = 0; b < noBonusIds; b++) {
    theItem.bonusIds.push(parseInt(parts[b+14]));
  }
  console.log(theItem);
  return theItem;
}

/*
 * From: https://wowwiki-archive.fandom.com/wiki/ItemString
 * item:itemId:enchantId:gemId1:gemId2:gemId3:gemId4:
 * suffixId:uniqueId:linkLevel:specializationID:upgradeId:instanceDifficultyId:
 * numBonusIds:bonusId1:bonusId2:upgradeValue
  */ 
class WowItem {

    itemId: number =0;
    bonusIds: number [] = [];


    bonuslist(): string  {

      return this.bonusIds.join(":");
    }

}