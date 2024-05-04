import { GetUserElevation } from "$ts/elevation/index";
import { Authenticate } from "$ts/server/user/auth";
import { PrimaryState } from "$ts/states";
import { ProcessStack } from "$ts/stores/process";
import { UserDataStore, UserName } from "$ts/stores/user";
import { ElevationData } from "$types/elevation";
import { ArcTerm } from "./main";

export async function ArcTermElevate(data: ElevationData, term: ArcTerm) {
  async function _text() {
    const userdata = UserDataStore.get();
    const username = UserName.get();

    const div = document.createElement("div");

    div.className = "part box";

    term.target.append(div);

    term.std.writeLine("\n");
    term.std.writeHTML(`🔒 <b>${data.what}</b>`, false, div);
    term.std.writeLine("\n", false, div);
    term.std.newWriteColor(`§r  ${data.title}`, false, div);
    term.std.newWriteColor(`§G  ${data.description}`, false, div);
    term.std.writeLine("\n", false, div);
    term.std.writeLine(
      !userdata.sh.elevationDisabled
        ? !userdata.sh.securityNoPassword
          ? "➡️ To continue, type in your password, and hit [Enter]."
          : "➡️ To continue, hit [Enter]"
        : "⛔ You can't continue because elevation is disabled.",
      false,
      div
    );

    if (userdata.sh.elevationDisabled) return;

    term.std.writeLine("\n", false, div);

    if (userdata.sh.securityNoPassword) {
      const approve =
        (await term.std.select(["✅ Approve this operation", "🛑 Deny"], "orange", div)) == 0;

      return approve;
    } else {
      const password = await term.std.read(
        `[🔑] Enter the password for ${username}: `,
        "",
        64,
        true,
        "",
        div
      );

      const valid = await Authenticate(username, password, false);

      if (!valid) term.std.Error("Failed to elevate: The password is incorrect.");

      return valid;
    }
  }

  const current = PrimaryState.current.get().key;

  if (term.env.textOnlyElevate || current !== "desktop") return await _text();

  return await GetUserElevation(data, ProcessStack);
}
