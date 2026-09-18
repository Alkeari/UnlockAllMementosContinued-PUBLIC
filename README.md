# Unlock All Mementos Continued

Every memento slot offers every memento, for any leader, whether you have earned it or not, in single player and in multiplayer lobbies alike. Your unlock progress itself is never touched, so you keep earning mementos as before.

> **Civilization VII, any build. It marks saves as depending on it, so add it before a run you care about.**

---

## Availability

- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3705752585)
- [Nexus Mods](https://www.nexusmods.com/civilizationvii/mods/32)

## What It Does

- **Every slot, every memento, from your first game** - major and minor slots offer everything they can hold, for any leader, with nothing to grind first.
- **Multiplayer lobbies too** - a multiplayer lobby offers each slot only what your account has really unlocked, a far shorter list than single player gets. The mod widens that list as well, so the lobby picker matches.
- **Your progression is left alone** - it changes what the game reports, not what it stores, so nothing you have earned is rewritten and you keep unlocking normally.
- **Hidden content stays hidden** - mementos the game withholds from play are untouched. Only the ones that exist and are merely locked behind progress are opened.
- **It does not fight other leader select mods** - it wraps the game's own metaprogression data instead of replacing the screen, so another mod's leader select panel or memento editor still loads.
- **Reads in your language** - its name and description ship in English and 11 more: Chinese (Simplified and Traditional), French, German, Italian, Spanish, Portuguese (Brazil), Russian, Polish, Japanese and Korean.
- Rewritten and maintained by Alkeari, continuing Unlock All Mementos by UzukiShimamura and XiaoXiaoCat.

---

## Requirements

- Civilization VII on any build. The mod declares no minimum game version.
- The base game's `base-standard` module, which every install already has.
- Verified on game version 1.5.0.

## Installation

1. Fully close and reopen the game. The unlock runs as the front end loads, so mementos stay locked for the rest of the session you enabled it in.
2. Open leader select. Every slot now offers every memento it can hold.

## Configuration

There is nothing to configure. The mod is on whenever it is enabled under Additional Content and off when it is not.

## Compatibility

- **It marks saves as depending on it.** A game started with it enabled cannot safely be continued with it removed.
- **It hooks rather than replaces.** Another mod that changes the leader select screen, the memento editor or the multiplayer lobby still loads, and this one does not go stale when the game patches those screens.
- **A mod with its own unlock checks may still show locks.** Anything that decides unlocks for itself, instead of reading the game's metaprogression data, is unaffected by this.
- **One marker row.** It writes a single row to the game's `GlobalParameters` table so that it always loads. No gameplay value changes with it.

## Support

- Include your game version, the mod version, and the other mods you have enabled.

## License

License terms are in the [Alkeari License Agreement](https://gist.github.com/Alkeari/2c6ec0cdf3dafee375b1a00b28ca190a).
