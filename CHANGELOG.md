# Changelog

What changed in Unlock All Mementos Continued, newest first. Only changes a player can notice are listed.
This file is the source of the change notes published to the Steam Workshop and Nexus Mods.

## v1.0.4 - 2026-09-17

- Fixed: the memento patch waits for the game's display-type names before it installs, so it can no longer install and then throw on its first use, which looked like the mod doing nothing.
- Fixed: the wait for those names ends after ten seconds instead of leaving a timer running for the whole session.
- Changed: the patch installs once and is left alone when the front end reloads a screen, instead of wrapping itself again on every transition.
- Added: the mod records in the game log what it patched and, on every request for memento data, how many entries it unlocked for whoever asked, so a report that it did nothing can be answered from the log.
- Fixed: locked mementos are now offered in multiplayer as well, by adding them to the list each memento slot is allowed to hold rather than only marking them unlocked, since the multiplayer lobby builds its picker from that list.

## v1.0.1 - 2026-08-27

- Fixed: mementos no longer show as locked. The mod now unlocks mementos through the game's own metaprogression data instead of replacing the leader select screen, which had gone stale against the current game version.
- Changed: no longer conflicts with other mods that change the leader select screen or the memento editor.

## v1.0.0 - 2026-04-12

- Baseline: the version published on the Steam Workshop on 2026-04-12, imported into this repository on 2026-08-22.
