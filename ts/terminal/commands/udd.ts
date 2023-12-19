import { writeFile } from "$ts/server/fs/file";
import { UserDataStore } from "$ts/stores/user";
import type { Command } from "../interface";

export const UDD: Command = {
  keyword: "udd",
  async exec(cmd, argv, term) {
    const filename = `./UserDump-${Math.floor(Math.random() * 1e9)}.txt`;
    term.std.writeColor(`Writing UserData to [${filename}]...\n`, "purple");

    const b = new Blob([JSON.stringify(UserDataStore.get(), null, 2)], {
      type: "text/plain",
    });

    await writeFile(filename, b);

    term.vars.set("uddout", filename);
  },
  description: "Dump the userdata to a file",
  hidden: true,
};
