// Ten seconds at 100 ms. Long enough for a slow load, short enough that a name which never turns
// up ends the wait instead of leaving a timer running for the session.
const WAIT_ATTEMPTS = 100;

// The shell re-runs its scripts on every front-end transition, so a wrapper carries this marker and
// a second run leaves the first one in place instead of wrapping a wrapper on every screen change.
const PATCH_MARKER = "unlockAllMementosContinued";

// The game's log keeps warn and error and drops log and debug, so every line here is a warn.
function report(message) {
	try {
		console.warn(`unlock-all-mementos-continued: ${message}`);
	} catch (e) {
	}
}

function waitForOnline(callback, attempt) {
	const tries = attempt || 0;
	const onlineReady = typeof Online != "undefined" && Online.Metaprogression && Online.UserProfile;
	// DisplayType is read on every slot, so waiting for Online alone left a window where the patch
	// installed and then threw on its first call. If it never arrives, install anyway once the wait
	// is spent: unlockDisplayType hands the value back untouched without it, so the panels behave as
	// though the mod were absent rather than breaking.
	if (!onlineReady || (typeof DisplayType == "undefined" && tries < WAIT_ATTEMPTS)) {
		if (!onlineReady && tries >= WAIT_ATTEMPTS * 3) {
			report("gave up waiting for Online, nothing patched");
			return;
		}
		setTimeout(() => waitForOnline(callback, tries + 1), 100);
		return;
	}
	callback();
}

function unlockDisplayType(displayType) {
	if (typeof DisplayType == "undefined") {
		return displayType;
	}
	return displayType == DisplayType.DISPLAY_LOCKED ? DisplayType.DISPLAY_UNLOCKED : displayType;
}

function patchDisplayTypes(owner, name) {
	const original = owner[name];
	if (typeof original != "function") {
		return "missing";
	}
	if (original[PATCH_MARKER]) {
		return "already";
	}
	const replacement = function () {
		const entries = original.apply(this, arguments);
		let unlocked = 0;
		entries?.forEach((entry) => {
			const before = entry.displayType;
			entry.displayType = unlockDisplayType(before);
			if (entry.displayType != before) {
				unlocked += 1;
			}
		});
		// Whoever asks for this data decides what is selectable, so the count says both that the
		// wrapper is live on the caller's path and how much it had to change for them.
		report(`${name} returned ${entries?.length ?? 0} entries, unlocked ${unlocked}`);
		return entries;
	};
	replacement[PATCH_MARKER] = true;
	owner[name] = replacement;
	return "patched";
}

function patchRewardUnlocked() {
	const original = Online.UserProfile.isRewardUnlocked;
	if (original && original[PATCH_MARKER]) {
		return "already";
	}
	const replacement = function () {
		return true;
	};
	replacement[PATCH_MARKER] = true;
	Online.UserProfile.isRewardUnlocked = replacement;
	return "patched";
}

// Every memento screen builds its pickable list from the slot parameter's own domain and uses the
// metaprogression display type only to decide how a card looks. Unlocking the display type is
// therefore not enough wherever the domain arrives already narrowed to what the account owns.
function mementoAsDomainValue(memento, functionalDescriptionName) {
	const properties = [];
	if (functionalDescriptionName != null && memento.functionalTextDesc) {
		properties.push({ name: functionalDescriptionName, value: memento.functionalTextDesc });
	}
	return {
		value: memento.mementoTypeId,
		name: GameSetup.makeString(memento.mementoName || memento.mementoTypeId),
		description: GameSetup.makeString(memento.functionalTextDesc || ""),
		icon: GameSetup.makeString(memento.mementoIcon || ""),
		additionalProperties: properties
	};
}

function widenMementoDomains(parameters) {
	let functionalDescriptionName = null;
	try {
		functionalDescriptionName = GameSetup.findString("FunctionalDescription");
	} catch (e) {
	}
	const mementos = Online.Metaprogression.getMementosData() || [];
	parameters?.forEach((parameter) => {
		const id = GameSetup.resolveString(parameter.ID) || "";
		if (id.indexOf("Memento") < 0) {
			return;
		}
		const existing = parameter.domain?.possibleValues;
		if (!existing) {
			report(`${id} has no domain to widen`);
			return;
		}
		const before = existing.length;
		const known = {};
		existing.forEach((value) => {
			known[String(value.value)] = true;
		});
		const added = [];
		mementos.forEach((memento) => {
			if (memento.mementoTypeId && !known[memento.mementoTypeId]) {
				added.push(mementoAsDomainValue(memento, functionalDescriptionName));
			}
		});
		if (added.length == 0) {
			report(`${id} domain ${before} values, nothing missing`);
			return;
		}
		// A native array may refuse to grow, so build the replacement and put it back whole. If the
		// domain will not take it, the screen is left exactly as the game built it.
		try {
			parameter.domain.possibleValues = existing.concat(added);
			const after = parameter.domain.possibleValues.length;
			report(`${id} domain ${before} values, added ${added.length}, now ${after}`);
		} catch (e) {
			report(`${id} domain ${before} values, could not add ${added.length}: ${e}`);
		}
	});
	return parameters;
}

function patchMementoParameters() {
	if (typeof GameSetup == "undefined" || typeof GameSetup.getMementoFilteredPlayerParameters != "function") {
		return "missing";
	}
	const original = GameSetup.getMementoFilteredPlayerParameters;
	if (original[PATCH_MARKER]) {
		return "already";
	}
	const replacement = function () {
		const parameters = original.apply(this, arguments);
		try {
			return widenMementoDomains(parameters);
		} catch (e) {
			report(`leaving the memento domains alone: ${e}`);
			return parameters;
		}
	};
	replacement[PATCH_MARKER] = true;
	GameSetup.getMementoFilteredPlayerParameters = replacement;
	return "patched";
}

waitForOnline(() => {
	const slots = patchDisplayTypes(Online.Metaprogression, "getMementoSlotData");
	const mementos = patchDisplayTypes(Online.Metaprogression, "getMementosData");
	const rewards = patchRewardUnlocked();
	const parameters = patchMementoParameters();
	const displayType = typeof DisplayType == "undefined" ? "absent" : "present";
	report(
		`installed getMementoSlotData=${slots} getMementosData=${mementos} isRewardUnlocked=${rewards} mementoParameters=${parameters} DisplayType=${displayType}`
	);
});
