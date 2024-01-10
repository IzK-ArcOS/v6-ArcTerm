import { tryJsonConvert } from "$ts/json";
import { getUsers } from "$ts/server/user/get";
import { UserCache } from "$ts/stores/user";
import { AllUsers } from "$types/user";
import Fuse from "fuse.js";
import { getSwitches } from "../argv";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const Users: Command = {
  keyword: "users",
  async exec(cmd, argv, term) {
    const username = tryJsonConvert<string>(getSwitches(argv)["search"]);

    UserCache.clear();

    if (!username) return allUsers(term);

    return searchFor(username, await getUsers(), term);
  },
  description: "Display ArcAPI users",
};

async function allUsers(term: ArcTerm) {
  const users = (await getUsers()) as AllUsers;
  const entries = Object.entries(users);
  const names = Object.keys(users);

  for (const [name, user] of entries) {
    const role = user.acc.admin ? "Administrator" : "Regular user";
    const nameStr = name.padEnd(getMaxLength(names), " ");
    term.std.writeColor(`[${nameStr}]: ${role}`, "blue");
  }
}

function searchFor(username: string, users: AllUsers, term: ArcTerm) {
  const userObject = Object.entries(users).map((a) => ({
    ...a[1],
    name: a[0],
  }));

  const options: Fuse.IFuseOptions<any> = {
    includeScore: true,
    keys: ["name"],
    threshold: 0.3
  };

  const fuse = new Fuse(userObject, options);
  const result = fuse.search(username);
  const names = Object.keys(users);

  for (const user of result) {
    const role = user.item.acc.admin ? "Administrator" : "Regular user";
    const name = user.item.name.padEnd(getMaxLength(names), " ");

    term.std.writeColor(`[${name}]: ${role}`, "blue");
  }

  return result;
}

function getMaxLength(users: string[]) {
  let length = 0;

  for (const user of users) {
    if (user.length > length) length = user.length;
  }

  return length + 2;
}
