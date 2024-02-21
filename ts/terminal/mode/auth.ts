import { ArcOSVersion } from "$ts/env";
import { ARCOS_MODE } from "$ts/metadata";
import { setAuthcode } from "$ts/server/authcode";
import { addServer, getServer } from "$ts/server/multi";
import { testConnection } from "$ts/server/test";
import { Authenticate, doRememberedAuth } from "$ts/server/user/auth";
import { UserName } from "$ts/stores/user";
import { sleep } from "$ts/util";
import { get } from "svelte/store";
import type { ArcTerm } from "../main";

export async function authPrompt(term: ArcTerm, usr = "", keep = false) {
  const udata = UserName.get();

  if (udata) return true;

  let api = getServer();

  if (!api) api = await serverConnect(term);

  await doRememberedAuth();

  await sleep(0);

  if (get(UserName)) return true;

  if (!keep) {
    term.std.clear();
    term.std.writeLine(`ArcTerm ${ArcOSVersion} ${ARCOS_MODE} ${api} atm1\n\n`);
  }

  const { username, password } = await authPromptFields(term, api, usr);

  await Authenticate(username, password);

  if (!get(UserName)) {
    term.std.writeLine("\nLogin incorrect");

    localStorage.removeItem("arcos-remembered-token");

    return await authPrompt(term, usr, true);
  }

  return true;
}

async function authPromptFields(term: ArcTerm, api: string, usr: string) {
  const username = await term.std.read(`${api} login: `, "", 100, false, usr);

  if (!username) {
    term.std.writeLine("\nLogin incorrect");
    return await authPromptFields(term, api, usr);
  }

  const password = await term.std.read("Password: ", "", 100, true);

  return { username, password };
}

async function serverConnect(term: ArcTerm) {
  term.std.clear();
  term.std.writeLine(`ArcTerm ${ArcOSVersion} - Connect to server\n\n`);

  const server = await term.std.read("Server: ", "", 50);
  const authCode = await term.std.read("Code (optional): ", "", 64, true);

  term.std.writeLine(`Connecting to ${server}...`);

  if (!(await testConnection(server, authCode))) return await serverConnect(term);

  addServer(server);
  setAuthcode(server, authCode);

  return server;
}
