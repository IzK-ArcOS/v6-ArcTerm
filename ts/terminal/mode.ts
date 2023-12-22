import { formatBytes } from "$ts/bytes";
import { Log } from "$ts/console";
import { getFSQuota } from "$ts/server/fs/quota";
import { getServer } from "$ts/server/multi";
import { ConnectedServer } from "$ts/stores/server";
import { UserCache, UserName } from "$ts/stores/user";
import type { ArcTerm } from "./main";
import { authPrompt } from "./mode/auth";

export async function arcTermModeIntro(a: ArcTerm) {
  Log(`ArcTerm ${a.referenceId}`, "Viewing ArcTermMode intro");

  if (!(await authPrompt(a))) return;

  UserCache.clear();

  const server = getServer();
  const user = UserName.get();
  const quota = await getFSQuota();

  const used = formatBytes(quota.used);
  const max = formatBytes(quota.max);
  const percentage = ((100 / quota.max) * quota.used).toFixed(2);

  const platform = ConnectedServer.get().meta.name;

  a.std.clear();

  if (a.app) return;

  disclaimer(a);
  auth(a, user, platform);
  api(a, server);
  usage(a, used, max, percentage);
}

function disclaimer(term: ArcTerm) {
  term.std.writeColor(
    `[█] You are currently in [ArcTerm mode].\n[█] Commands that require the ArcOS desktop have been disabled.\n\n`,
    "orange"
  );

  term.std.writeColor(`ArcTerm reference ID: [${term.referenceId}]`, "blue");
}

function auth(term: ArcTerm, user: string, platform: string) {
  term.std.writeColor(
    `\nAuthenticated as [${user}] at [${platform}]`,
    "aqua",
    "white",
    true
  );
}

function api(term: ArcTerm, server: string) {
  term.std.writeColor(` [(${server})]`, "gray", "white", true);
}

function usage(term: ArcTerm, used: string, max: string, percent: string) {
  term.std.writeColor(
    `\n[ArcFS]: You are using [${used}] of [${max}] total (${percent}%)\n`,
    "yellow"
  );
}
