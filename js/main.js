var agility,
    body,
    reaction,
    strength,
    resonance,
    logic,
    willpower,
    intuition,
    charisma,
    computer,
    cybercombat,
    hardware,
    software,
    compiling,
    decompiling,
    registering,
    electronicWarfare,
    hacking,
    attackUpgrade,
    dataProcessingUpgrade,
    firewallUpgrade,
    neuroFilter,
    overclocking,
    sleazeUpgrade,
    deviceRating,
    sleaze,
    attack,
    dataProcessing,
    firewall,
    limit,
    noise,
    grid,
    runSilent,
    wound,
    stun,
    attributes,
    skills,
    defaultSkills,
    programEdit,
    programBiofeedbackFilter,
    programToolbox,
    programDefuse,
    programEncryption,
    programSignalScrub,
    programArmor,
    programShell,
    programDecryption,
    programExploit,
    programStealth,
    programTrack,
    sustainedForms,
    hotSim = false,
    x,
    baseMods,
    actions = ["bruteForce1Dice", "bruteForce2Dice", "bruteForce3Dice", "checkOverwatchScoreDice", "crackFileDice", "crashProgramDice", "dataSpikeDice", "disarmDataBombDice", "editFileDice", "protectFileDice", "erase1MarkDice", "erase2MarkDice", "erase3MarkDice", "eraseMatrixSignatureDice", "formatDeviceDice", "hackOnTheFly1Dice", "hackOnTheFly2Dice", "hackOnTheFly3Dice", "hideDice", "jackOutDice", "jamSignalsDice", "jumpIntoRiggedDeviceDice", "matrixPerceptionDice", "matrixSearchDice", "rebootDeviceDice", "setDataBombDice", "snoopDice", "spoofDice", "traceIconDice", "compileSpriteDice", "decompileSpriteDice", "killComplexFormDice", "registerSpriteDice", "threadComplexFormDice", "fadingDice"],
    defenseActions = ["bruteForce1Defense", "bruteForce2Defense", "bruteForce3Defense",  "crashProgramDefense", "dataSpikeDefense", "editFileDefense", "erase1MarkDefense", "erase2MarkDefense", "erase3MarkDefense", "formatDeviceDefense", "hackOnTheFly1Defense", "hackOnTheFly2Defense", "hackOnTheFly3Defense", "hideDefense", "jackOutDefense", "jumpIntoRiggedDeviceDefense", "matrixPerceptionDefense", "rebootDeviceDefense", "snoopDefense", "spoofDefense", "traceIconDefense", "diffusionDefense", "editorDefense", "pulseStormDefense", "puppeteerDefense", "resonanceSpikeDefense", "resonanceVeilDefense", "staticBombDefense", "stitchesDefense", "resistDamageDefense", "resistBiofeedbackDefense", "resistDataBombDefense"],
    matrixAttributes = ["deviceRating", "attack", "sleaze", "dataProcessing", "firewall"],
    VERSION = "v0.2.1";

function floor(int) {
    if (int < 0) {
        return 0;
    } else {
        return int;
    }
}

function getLimit(attr) {
    attack = charisma;
    deviceRating = resonance;
    sleaze = intuition;
    dataProcessing = logic;
    firewall = willpower;
    switch (attr) {
    case ("attack"):
        attack += attackUpgrade;
        return attack;
    case ("sleaze"):
        sleaze += sleazeUpgrade;
        return sleaze;
    case ("dataProcessing"):
        dataProcessing += dataProcessingUpgrade;
        return dataProcessing;
    case ("firewall"):
        firewall += firewallUpgrade;
        return firewall;
    case ("deviceRating"):
        return deviceRating;
    case ("mental"):
        return Math.ceil(((logic * 2) + intuition + willpower) / 3);
    default:
        return 0;
    }
}

function setInitiative() {
    var initiative;
    if (hotSim) {
        initiative = intuition + getLimit("dataProcessing");
        if (overclocking) {
            return initiative + " + 5d6";
        } else {
            return initiative + " + 4d6";
        }
    } else {
        initiative = intuition + reaction;
        return initiative + " + 1d6";
    }
}

function getMods() {
    baseMods = 0;
    if (hotSim) {
        baseMods += 2;
    }
    if (grid) {
        baseMods -= 2;
    }
    if (runSilent) {
        baseMods -= 2;
    }
    // Noise Mods
    if (noise > 0) {
        if (programSignalScrub) {
            noise -= 2;
        }
        if (noise < 0) {
            noise = 0;
        }
        baseMods -= noise;
    }
    baseMods += wound;
    baseMods += stun;
    return baseMods;
}

function getDice(action) {
    var returnString,
        dice = 0,
        span = document.getElementById(action);
    switch (action) {
    case ("bruteForce1Dice"):
        dice = cybercombat + logic;
        dice += getMods();
        span.title = "Cybercombat: " + cybercombat + " Logic: " + logic + " Mods: " + getMods();
        if (cybercombat === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("bruteForce2Dice"):
        dice = cybercombat + logic - 4;
        dice += getMods();
        span.title = "Cybercombat: " + cybercombat + " Logic: " + logic + " Mods: " + getMods() + " - 4";
        if (cybercombat === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("bruteForce3Dice"):
        dice = cybercombat + logic - 10;
        dice += getMods();
        span.title = "Cybercombat: " + cybercombat + " Logic: " + logic + " Mods: " + getMods() + " - 10";
        if (cybercombat === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("checkOverwatchScoreDice"):
        if (electronicWarfare === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Electronic Warfare skill.";
        } else {
            dice = electronicWarfare + logic;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
            span.innerHTML = returnString;
            span.title = "Electronic Warfare: " + electronicWarfare + " Logic: " + logic + " Mods: " + getMods();
        }
        break;
    case ("crackFileDice"):
        dice = hacking + logic;
        dice += getMods();
        span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods();
        if (hacking === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("crashProgramDice"):
        dice = cybercombat + logic;
        dice += getMods();
        span.title = "Cybercombat: " + cybercombat + " Logic: " + logic + " Mods: " + getMods();
        if (cybercombat === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("dataSpikeDice"):
        dice = cybercombat + logic;
        dice += getMods();
        if (cybercombat === 0) { dice -= 1; }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        span.title = "Cybercombat: " + cybercombat + " Logic: " + logic + " Mods: " + getMods();
        break;
    case ("disarmDataBombDice"):
        if (software === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Software skill.";
        } else {
            dice = software + intuition;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("firewall") + "]";
            span.title = "Software: " + software + " Intuition: " + intuition + " Mods: " + getMods();
            span.innerHTML = returnString;
        }
        break;
    case ("editFileDice"):
        limit = getLimit("dataProcessing");
        if (programEdit) {
            limit += 2;
            span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods() + " +2 to limit (Edit Program)";
        } else {
            span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods();
        }
        dice = computer + logic;
        dice += getMods();
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("protectFileDice"):
        limit = getLimit("dataProcessing");
        if (programEdit) {
            limit += 2;
            span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods() + " +2 to limit (Edit Program)";
        } else {
            span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods();
        }
        dice = computer + logic;
        dice += getMods();
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("erase1MarkDice"):
        dice = computer + logic;
        dice += getMods();
        span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods();
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("erase2MarkDice"):
        dice = computer + logic - 4;
        dice += getMods();
        span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods() + " - 4";
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("erase3MarkDice"):
        dice = computer + logic - 10;
        dice += getMods();
        span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods() + " - 10";
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("eraseMatrixSignatureDice"):
        dice = computer + resonance;
        dice += getMods();
        span.title = "Computer: " + computer + " Resonance: " + resonance + " Mods: " + getMods();
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + getLimit("attack") + "]";
        span.innerHTML = returnString;
        break;
    case ("formatDeviceDice"):
        dice = computer + logic;
        dice += getMods();
        span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods();
        if (computer === 0) {
            dice -= 1;
            span.title += " (-1 for defaulting)";
        }
        returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
        span.innerHTML = returnString;
        break;
    case ("hackOnTheFly1Dice"):
        limit = getLimit("sleaze");
        if (programExploit) {
            limit += 2;
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods() + " +2 to limit (Exploit Program)";
        } else {
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods();
        }
        dice = hacking + logic;
        dice += getMods();
        if (hacking === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("hackOnTheFly2Dice"):
        limit = getLimit("sleaze");
        if (programExploit) {
            limit += 2;
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods() + " +2 to limit (Exploit Program) - 4";
        } else {
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods() + " - 4";
        }
        dice = hacking + logic - 4;
        dice += getMods();
        if (hacking === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("hackOnTheFly3Dice"):
        limit = getLimit("sleaze");
        if (programExploit) {
            limit += 2;
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods() + " +2 to limit (Exploit Program) - 10";
        } else {
            span.title = "Hacking: " + hacking + " Logic: " + logic + " Mods: " + getMods() + " - 10";
        }
        dice = hacking + logic - 10;
        dice += getMods();
        if (hacking === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("hideDice"):
        if (electronicWarfare === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Electronic Warfare skill.";
        } else {
            dice = electronicWarfare + intuition;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
            span.innerHTML = returnString;
            span.title = "Electronic Warfare: " + electronicWarfare + " Intuition: " + intuition + " Mods: " + getMods();
        }
        break;
    case ("jackOutDice"):
        if (hardware === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Hardware skill.";
        } else {
            dice = hardware + willpower;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("firewall") + "]";
            span.innerHTML = returnString;
            span.title = "Hardware: " + hardware + " Willpower: " + willpower + " Mods: " + getMods();
        }
        break;
    case ("jamSignalsDice"):
        if (electronicWarfare === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Electronic Warfare skill.";
        } else {
            dice = electronicWarfare + logic;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("attack") + "]";
            span.innerHTML = returnString;
            span.title = "Electronic Warfare: " + electronicWarfare + " Logic: " + logic + " Mods: " + getMods();
        }
        break;
    case ("jumpIntoRiggedDeviceDice"):
        if (electronicWarfare === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Electronic Warfare skill.";
        } else {
            dice = electronicWarfare + logic;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("dataProcessing") + "]";
            span.innerHTML = returnString;
            span.title = "Electronic Warfare: " + electronicWarfare + " Logic: " + logic + " Mods: " + getMods();
        }
        break;
    case ("matrixPerceptionDice"):
        dice = computer + intuition + 2;
        dice += getMods();
        span.title = "Computer: " + computer + " Intuition: " + intuition + " Mods: " + getMods();
        if (computer === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("dataProcessing") + "]";
        span.innerHTML = returnString;
        break;
    case ("matrixSearchDice"):
        dice = computer + intuition;
        dice += getMods();
        span.title = "Computer: " + computer + " Intuition: " + intuition + " Mods: " + getMods();
        if (computer === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("dataProcessing") + "]";
        span.innerHTML = returnString;
        break;
    case ("rebootDeviceDice"):
        dice = computer + logic;
        dice += getMods();
        span.title = "Computer: " + computer + " Logic: " + logic + " Mods: " + getMods();
        if (computer === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("dataProcessing") + "]";
        span.innerHTML = returnString;
        break;
    case ("setDataBombDice"):
        if (software === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Software skill.";
        } else {
            dice = software + logic;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
            span.innerHTML = returnString;
            span.title = "Software: " + software + " Logic: " + logic + " Mods: " + getMods();
        }
        break;
    case ("snoopDice"):
        if (electronicWarfare === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Electronic Warfare skill.";
        } else {
            dice = electronicWarfare + intuition;
            dice += getMods();
            returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
            span.innerHTML = returnString;
            span.title = "Electronic Warfare: " + electronicWarfare + " Intuition: " + intuition + " Mods: " + getMods();
        }
        break;
    case ("spoofDice"):
        dice = hacking + intuition;
        dice += getMods();
        span.title = "Hacking: " + hacking + " Intuition: " + intuition + " Mods: " + getMods();
        if (hacking === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + getLimit("sleaze") + "]";
        span.innerHTML = returnString;
        break;
    case ("traceIconDice"):
        limit = getLimit("dataProcessing");
        if (programTrack) {
            limit += 2;
        }
        dice = computer + intuition;
        dice += getMods();
        span.title = "Computer: " + computer + " Intuition: " + intuition + " Mods: " + getMods();
        if (computer === 0) { dice -= 1; span.title += " (-1 for defaulting)"; }
        returnString = floor(dice) + " [" + limit + "]";
        span.innerHTML = returnString;
        break;
    case ("compileSpriteDice"):
        if (compiling === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Compiling skill.";
        } else {
            var mods = getMods();
            if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
            dice = compiling + resonance;
            dice += mods;
            returnString = floor(dice) + " [Level]";
            span.innerHTML = returnString;
            span.title = "Compiling: " + compiling + " Resonance: " + resonance + " Mods: " + mods;
        }
        break;
    case ("decompileSpriteDice"):
        if (decompiling === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Decompiling skill.";
        } else {
            var mods = getMods();
            if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
            dice = decompiling + resonance;
            dice += mods;
            returnString = floor(dice) + " [Level]";
            span.innerHTML = returnString;
            span.title = "Decompiling: " + decompiling + " Resonance: " + resonance + " Mods: " + mods;
        }
        break;
    case ("killComplexFormDice"):
        if (software === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Software skill.";
        } else {
            var mods = getMods();
            if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
            dice = software + resonance;
            dice += mods;
            returnString = floor(dice) + " [Level]";
            span.innerHTML = returnString;
            span.title = "Software: " + software + " Resonance: " + resonance + " Mods: " + mods;
        }
        break;
    case ("registerSpriteDice"):
        if (registering === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Registering skill.";
        } else {
            var mods = getMods();
            if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
            dice = registering + resonance;
            dice += mods;
            returnString = floor(dice) + " [Level]";
            span.innerHTML = returnString;
            span.title = "Registering: " + registering + " Resonance: " + resonance + " Mods: " + mods;
        }
        break;
    case ("threadComplexFormDice"):
        if (software === 0) {
            returnString = "N/A";
            span.innerHTML = returnString;
            span.title = "Cannot default on Software skill.";
        } else {
            var mods = getMods();
            if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
            dice = software + resonance;
            dice += mods;
            returnString = floor(dice) + " [Level]";
            span.innerHTML = returnString;
            span.title = "Software: " + software + " Resonance: " + resonance + " Mods: " + mods;
        }
        break;
    case ("fadingDice"):
        var mods = getMods();
        if (hotSim) { mods -= 2; } // Resonance skills don't get the +2 bonus
        dice = willpower + resonance;
        dice += mods;
        returnString = floor(dice) + " [" + getLimit("mental") + "]";
        span.innerHTML = returnString;
        span.title = "Willpower: " + willpower + " Resonance: " + resonance + " Mods: " + mods;
        break;
    default:
        span.innerHTML = 0;
        break;
    }
}

function getDefenseDice(action) {
    var returnString,
        dice = 0,
        span = document.getElementById(action);
    switch (action) {
    case ("bruteForce1Defense"):
    case ("bruteForce2Defense"):
    case ("bruteForce3Defense"):
    case ("erase1MarkDefense"):
    case ("erase2MarkDefense"):
    case ("erase3MarkDefense"):
    case ("formatDeviceDefense"):
    case ("jumpIntoRiggedDeviceDefense"):
    case ("rebootDeviceDefense"):
    case ("diffusionDefense"):
    case ("puppeteerDefense"):
    case ("resonanceSpikeDefense"):
        dice = willpower + getLimit("firewall");
        dice += getMods();
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("crashProgramDefense"):
    case ("dataSpikeDefense"):
    case ("editFileDefense"):
    case ("hackOnTheFly1Defense"):
    case ("hackOnTheFly2Defense"):
    case ("hackOnTheFly3Defense"):
        dice = intuition + getLimit("firewall");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("hideDefense"):
    case ("editorDefense"):
    case ("resonanceVeilDefense"):
    case ("staticBombDefense"):
        dice = intuition + getLimit("dataProcessing");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("jackOutDefense"):
        dice = logic + getLimit("attack");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("matrixPerceptionDefense"):
        dice = logic + getLimit("sleaze");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("snoopDefense"):
    case ("spoofDefense"):
        dice = logic + getLimit("firewall");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("traceIconDefense"):
        dice = willpower + getLimit("sleaze");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("pulseStormDefense"):
    case ("stitchesDefense"):
        dice = logic + getLimit("dataProcessing");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("resistDamageDefense"):
        dice = resonance + getLimit("firewall");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        if (programArmor) {
            dice += 2;
        }
        if (programShell) {
            dice += 1;
        }
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("resistDataBombDefense"):
        dice = resonance + getLimit("firewall");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        if (programArmor) {
            dice += 2;
        }
        if (programDefuse) {
            dice += 4;
        }
        if (programShell) {
            dice += 1;
        }
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    case ("resistBiofeedbackDefense"):
        dice = willpower + getLimit("firewall");
        if (hotSim) { dice -= 2; } // Not a matrix action, hotsim bonus doesn't apply
        dice += getMods();
        if (neuroFilter > 0) {
            dice += neuroFilter;
        }
        if (programBiofeedbackFilter) {
            dice += 2;
        }
        if (programShell) {
            dice += 1;
        }
        returnString = floor(dice);
        span.innerHTML = returnString;
        break;
    default:
        span.innerHTML = 0;
        break;
    }
}

function displayDice() {
    getMods();
    for (x = 0; x < actions.length; x += 1) {
        getDice(actions[x]);
    }
    for (x = 0; x < defenseActions.length; x += 1) {
        getDefenseDice(defenseActions[x]);
    }
    document.getElementById("initiative").innerHTML = "Initiative: " + setInitiative();
    for (x = 0; x < matrixAttributes.length; x += 1) {
        limit = getLimit(matrixAttributes[x]);
        span = document.getElementById(matrixAttributes[x] + "Span");
        switch (matrixAttributes[x]) {
        case ("deviceRating"):
            span.title = "Resonance: " + resonance;
            break;
        case ("attack"):
            span.title = "Charisma: " + charisma;
            if (attackUpgrade > 0) {
                span.title += " + " + attackUpgrade;
            }
            break;
        case ("sleaze"):
            span.title = "Intuition: " + intuition;
            if (sleazeUpgrade > 0) {
                span.title += " + " + sleazeUpgrade;
            }
            break;
        case ("dataProcessing"):
            span.title = "Logic: " + logic;
            if (dataProcessingUpgrade > 0) {
                span.title += " + " + dataProcessingUpgrade;
            }
            break;
        case ("firewall"):
            span.title = "Willpower: " + willpower;
            if (firewallUpgrade > 0) {
                span.title += " + " + firewallUpgrade;
            }
            break;
        default:
            break;
        }
        span.innerHTML = limit;
    }
}



function vrMode() {
    var modeButton = document.getElementById("modeButton"),
        modeSpan = document.getElementById("modeSpan");
    
    if (hotSim === false) {
        hotSim = true;
        modeButton.classList.remove("btn-danger");
        modeButton.classList.add("btn-success");
        modeSpan.classList.remove("glyphicon-unchecked");
        modeSpan.classList.add("glyphicon-ok");
    } else {
        hotSim = false;
        modeButton.classList.remove("btn-success");
        modeButton.classList.add("btn-danger");
        modeSpan.classList.remove("glyphicon-ok");
        modeSpan.classList.add("glyphicon-unchecked");
    }
    displayDice();
}

function setAttributes() {
    agility = Number(document.getElementById("agility").value) + Number(document.getElementById("agilityMod").value);
    strength = Number(document.getElementById("strength").value) + Number(document.getElementById("strengthMod").value);
    body = Number(document.getElementById("body").value) + Number(document.getElementById("bodyMod").value);
    reaction = Number(document.getElementById("reaction").value) + Number(document.getElementById("reactionMod").value);
    logic = Number(document.getElementById("logic").value) + Number(document.getElementById("logicMod").value);
    intuition = Number(document.getElementById("intuition").value) + Number(document.getElementById("intuitionMod").value);
    charisma = Number(document.getElementById("charisma").value) + Number(document.getElementById("charismaMod").value);
    willpower = Number(document.getElementById("willpower").value) + Number(document.getElementById("willpowerMod").value);
    resonance = Number(document.getElementById("resonance").value) + Number(document.getElementById("resonanceMod").value);
    attributes = [agility, body, strength, reaction, resonance, logic, willpower, intuition, charisma];
    for (x = 0; x < attributes.length; x += 1) {
        if (attributes[x] < 1) {
            attributes[x] = 1;
        }
    }
    displayDice();
}

function setSkills() {
    compiling = Number(document.getElementById("compiling").value) + Number(document.getElementById("compilingMod").value);
    decompiling = Number(document.getElementById("decompiling").value) + Number(document.getElementById("decompilingMod").value);
    registering = Number(document.getElementById("registering").value) + Number(document.getElementById("registeringMod").value);
    computer = Number(document.getElementById("computer").value) + Number(document.getElementById("computerMod").value);
    cybercombat = Number(document.getElementById("cybercombat").value) + Number(document.getElementById("cybercombatMod").value);
    electronicWarfare = Number(document.getElementById("electronicWarfare").value) + Number(document.getElementById("electronicWarfareMod").value);
    hacking = Number(document.getElementById("hacking").value) + Number(document.getElementById("hackingMod").value);
    hardware = Number(document.getElementById("hardware").value) + Number(document.getElementById("hardwareMod").value);
    software = Number(document.getElementById("software").value) + Number(document.getElementById("softwareMod").value);
    skills = [compiling, decompiling, registering, computer, cybercombat, electronicWarfare, hacking, hardware, software];
    defaultSkills = [hacking, cybercombat, computer];
    for (x = 0; x < skills.length; x += 1) {
        if (skills[x] < 1) {
            skills[x] = 0;
        }
    }
    for (x = 0; x < defaultSkills.length; x += 1) {
        if (defaultSkills[x] === 0) {
            defaultSkills[x] = -1;
        }
    }
    displayDice();
}

function setEchoes() {
    if (document.getElementById("attackUpgrade").checked) {
        attackUpgrade = Number(document.getElementById("attackUpgradeLevel").value);
    } else {
        attackUpgrade = 0;
    }
    if (document.getElementById("dataProcessingUpgrade").checked) {
        dataProcessingUpgrade = Number(document.getElementById("dataProcessingUpgradeLevel").value);
    } else {
        dataProcessingUpgrade = 0;
    }
    if (document.getElementById("firewallUpgrade").checked) {
        firewallUpgrade = Number(document.getElementById("firewallUpgradeLevel").value);
    } else {
        firewallUpgrade = 0;
    }
    if (document.getElementById("sleazeUpgrade").checked) {
        Number(sleazeUpgrade = document.getElementById("sleazeUpgradeLevel").value);
    } else {
        sleazeUpgrade = 0;
    }
    if (document.getElementById("neuroFilter").checked) {
        neuroFilter = Number(document.getElementById("neuroFilterLevel").value);
    } else {
        neuroFilter = 0;
    }
    overclocking = document.getElementById("overclocking").checked;
    programBiofeedbackFilter = document.getElementById("biofeedbackFilterProgram").checked;
    programEdit = document.getElementById("editProgram").checked;
    programArmor = document.getElementById("armorProgram").checked;
    programDefuse = document.getElementById("defuseProgram").checked;
    programShell = document.getElementById("shellProgram").checked;
    programEncryption = document.getElementById("encryptionProgram").checked;
    if (programEncryption) {
        firewallUpgrade += 1;
    }
    programSignalScrub = document.getElementById("signalScrubProgram").checked;
    programToolbox = document.getElementById("toolboxProgram").checked;
    if (programToolbox) {
        dataProcessingUpgrade += 1;
    }
    programDecryption = document.getElementById("decryptionProgram").checked;
    if (programDecryption) {
        attackUpgrade += 1;
    }
    programExploit = document.getElementById("exploitProgram").checked;
    programStealth = document.getElementById("stealthProgram").checked;
    if (programStealth) {
        sleazeUpgrade += 1;
    }
    programTrack = document.getElementById("trackProgram").checked;
    displayDice();
}

function setOptions() {
    sustainedForms = document.getElementById("sustainedForms").value;
    noise = Number(document.getElementById("noiseLevel").value);
    grid = document.getElementById("differentGrid").checked;
    runSilent = document.getElementById("runningSilent").checked;
    wound = Number(document.getElementById("woundModifier").value);
    stun = Number(document.getElementById("stunModifier").value);
    displayDice();
}

function initialize() {
    setAttributes();
    setEchoes();
    setOptions();
    setSkills();
    displayDice();
    document.getElementById("version").innerHTML = VERSION;
}

initialize();
