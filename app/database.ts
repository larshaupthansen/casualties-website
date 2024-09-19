////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

// import { matchSorter } from "match-sorter";
// import { string } from "prop-types";

// import sortBy from "sort-by";
// import invariant from "tiny-invariant";

import { promises as fs } from "fs";

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
export class Database<T>  {

    file: string = "";
    records: Record<string, T> = {};

    constructor(file:string) {
        this.file = file;
      
    }

    async Load() {
        const jsonDirectory = import.meta.dirname + "/data";
        const fileContents =  await  fs.readFile(jsonDirectory + "/"+ this.file + ".json", "utf8");
        
        this.records = JSON.parse(fileContents);
    }

    async getAll(): Promise<T[]> {
       
        return Object.keys(this.records)
            .map((key) => this.records[key]); 
    }

  async get(id: string): Promise<T | null> {
    return this.records[id] || null;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
// export async function get<T>(database: Database<T>, query?: string | null) {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   let rec = await database.getAll();
//   if (query) {
//     contacts = matchSorter(contacts, query, {
//       keys: ["first", "last"],
//     });
//   }
//   return contacts.sort(sortBy("last", "createdAt"));
// }

// export async function createEmptyContact() {
//   const contact = await fakeContacts.create({});
//   return contact;
// }

// export async function getContact(id: string) {
//   return fakeContacts.get(id);
// }

// export async function updateContact(id: string, updates: ContactMutation) {
//   const contact = await fakeContacts.get(id);
//   if (!contact) {
//     throw new Error(`No contact found for ${id}`);
//   }
//   await fakeContacts.set(id, { ...contact, ...updates });
//   return contact;
// }

// export async function deleteContact(id: string) {
//   fakeContacts.destroy(id);
// }

