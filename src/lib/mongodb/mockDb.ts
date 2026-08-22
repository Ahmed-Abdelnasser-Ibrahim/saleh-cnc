import fs from "fs";
import path from "path";

const DB_JSON_PATH = path.join(process.cwd(), "data", "db.json");

function readDb() {
  if (fs.existsSync(DB_JSON_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_JSON_PATH, "utf8"));
    } catch (e) {
      console.error("Error reading mock DB:", e);
    }
  }
  return { products: [], orders: [], settings: {} };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing mock DB:", e);
  }
}

class MockQuery {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  sort(sortQuery: any) {
    // Return self to support chain calls
    return this;
  }

  lean() {
    // Return self to support chain calls
    return this;
  }

  then(resolve: any, reject?: any) {
    const cloned = JSON.parse(JSON.stringify(this.data));
    if (Array.isArray(cloned)) {
      resolve(cloned.map((item: any) => ({
        ...item,
        _id: item.id || item._id,
        id: item.id || item._id,
        toObject: function() { return this; }
      })));
    } else if (cloned) {
      const itemWithId = {
        ...cloned,
        _id: cloned.id || cloned._id,
        id: cloned.id || cloned._id,
        toObject: function() { return this; }
      };
      resolve(itemWithId);
    } else {
      resolve(null);
    }
  }
}

export function createMockModel(modelName: "products" | "orders" | "settings") {
  return {
    find: (query?: any) => {
      const db = readDb();
      const list = db[modelName] || [];
      return new MockQuery(list);
    },
    findOne: (query?: any) => {
      const db = readDb();
      const list = db[modelName];
      let found: any = null;

      if (modelName === "settings") {
        found = list || {};
      } else if (query && query.phone) {
        found = (list || []).find((item: any) => item.phone === query.phone);
      } else if (query && query.$expr) {
        const regexVal = query.$expr.$regexMatch.regex;
        const cleanSuffix = regexVal.replace("$", "");
        found = (list || []).find((item: any) => {
          const idStr = String(item.id || item._id || "");
          return idStr.endsWith(cleanSuffix);
        });
      }
      return new MockQuery(found);
    },
    findById: (id: any) => {
      const db = readDb();
      const list = db[modelName] || [];
      const found = list.find((item: any) => String(item.id || item._id) === String(id));
      return new MockQuery(found);
    },
    create: async (data: any) => {
      const db = readDb();
      if (modelName === "settings") {
        db[modelName] = {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        writeDb(db);
        return {
          ...db[modelName],
          _id: "settings",
          toObject: function() { return this; }
        };
      } else {
        const newId = modelName === "orders" 
          ? "ORD-" + Math.floor(1000 + Math.random() * 9000) 
          : String((db[modelName] || []).length + 1);
        
        const newItem = {
          ...data,
          id: newId,
          _id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (!db[modelName]) db[modelName] = [];
        db[modelName].push(newItem);
        writeDb(db);
        
        return {
          ...newItem,
          toObject: function() { return this; }
        };
      }
    },
    insertMany: async (arr: any[]) => {
      const db = readDb();
      if (!db[modelName] || db[modelName].length === 0) {
        db[modelName] = arr.map((item, idx) => ({
          ...item,
          id: String(idx + 1),
          _id: String(idx + 1),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        writeDb(db);
      }
      return db[modelName].map((item: any) => ({
        ...item,
        toObject: function() { return this; }
      }));
    },
    findByIdAndUpdate: async (id: any, update: any, options?: any) => {
      const db = readDb();
      const list = db[modelName] || [];
      const idx = list.findIndex((item: any) => String(item.id || item._id) === String(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...update, updatedAt: new Date().toISOString() };
        writeDb(db);
        const updated = list[idx];
        return {
          ...updated,
          _id: updated.id || updated._id,
          id: updated.id || updated._id,
          toObject: function() { return this; }
        };
      }
      return null;
    },
    findOneAndUpdate: async (filter: any, update: any, options?: any) => {
      const db = readDb();
      if (modelName === "settings") {
        db[modelName] = { ...db[modelName], ...update, updatedAt: new Date().toISOString() };
        writeDb(db);
        const settings = db[modelName];
        return {
          ...settings,
          _id: "settings",
          toObject: function() { return this; }
        };
      }
      return null;
    },
    findByIdAndDelete: async (id: any) => {
      const db = readDb();
      const list = db[modelName] || [];
      const idx = list.findIndex((item: any) => String(item.id || item._id) === String(id));
      if (idx !== -1) {
        const deleted = list[idx];
        db[modelName] = list.filter((item: any) => String(item.id || item._id) !== String(id));
        writeDb(db);
        return {
          ...deleted,
          _id: deleted.id || deleted._id,
          id: deleted.id || deleted._id,
          toObject: function() { return this; }
        };
      }
      return null;
    }
  };
}
