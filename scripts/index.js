function zoomed() {
    g.attr('transform', d3.event.transform);
}

function resetZoom() {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([window.innerWidth / 2, window.innerHeight / 2])
    );
}

function setVariables() {
    window.zoom = d3.zoom()
        .scaleExtent([1, 12])
        .translateExtent(
            [
                [-0.2 * window.innerWidth, -0.2 * window.innerHeight],
                [1.2 * window.innerWidth, 1.2 * window.innerHeight]
            ]
        )
        .on('zoom', zoomed);

    window.tipOn = false;
    window.tooltipTimeout = undefined;
    window.factionInfoTimeout = undefined;
    window.onmousemove = function(e) {
        let mouse_x = e.clientX;
        let mouse_y = e.clientY;

        if (tipOn) {
            let t = getElem('tooltip');
            let tip_h = t.offsetHeight;
            let scale_h = Math.min(window.innerHeight / tip_h, 1);
            t.style.transform = `scale(${scale_h})`;

            if (x_offset) {
                t.style.left = mouse_x - t.offsetWidth - 20 + 'px';
            } else {
                t.style.left = mouse_x + 20 + 'px';
            }

            if (y_offset) {
                if (scale_h === 1) {
                    t.style.top = Math.max(mouse_y - t.offsetHeight - 20, 5) + 'px';
                } else {
                    t.style.top = '0';
                    let rect = t.getBoundingClientRect();
                    t.style.top = `-${rect.top - 1}px`;
                }
            } else {
                if (scale_h === 1) {
                    t.style.top = Math.min(mouse_y + 20, window.innerHeight - t.offsetHeight - 5) + 'px';
                } else {
                    t.style.top = '0';
                    let rect = t.getBoundingClientRect();
                    t.style.top = `-${rect.top - 1}px`;
                }
            }
        } else {
            x_offset = mouse_x > window.innerWidth * 0.5;
            y_offset = mouse_y > window.innerHeight * 0.5;
        }
    };
    window.assets = {
        'Smugglers': {
            'STAT': 'Cunning',
            'STAT_TIER': 1,
            'ASSET': 'Smugglers',
            'HP': 4,
            'COST': 2,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'For one FacCred, the smugglers asset can transport itself and/or any one Special Forces unit to a planet up to two hexes away.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Informers': {
            'STAT': 'Cunning',
            'STAT_TIER': 1,
            'ASSET': 'Informers',
            'HP': 3,
            'COST': 2,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'They can choose to Attack a faction without specifying a target asset. On a successful Cunning vs. Cunning attack, all Stealthed assets on the planet belonging to that faction are revealed. Informers can target a faction even if none of their assets are visible on a world; at worst, they simply learn that there are no stealthed assets.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'False Front': {
            'STAT': 'Cunning',
            'STAT_TIER': 1,
            'ASSET': 'False Front',
            'HP': 2,
            'COST': 1,
            'TL': 0,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'If another asset on the planet suffers enough damage to destroy it, the faction can sacrifice the false front instead to nullify the killing blow.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Lobbyists': {
            'STAT': 'Cunning',
            'STAT_TIER': 2,
            'ASSET': 'Lobbyists',
            'HP': 4,
            'COST': 4,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Usable to block the governmental permission that is sometimes required to buy an asset or transport it into a system. When a rival faction gains permission to do so, the Lobbyists can make an immediate Cunning vs. Cunning test against the faction; if successful, the permission is with- drawn and cannot be re-attempted until next turn.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Saboteurs': {
            'STAT': 'Cunning',
            'STAT_TIER': 2,
            'ASSET': 'Saboteurs',
            'HP': 6,
            'COST': 5,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'An asset attacked by saboteurs cannot apply any Use Asset Ability action until the start of the attacking faction’s next turn. This applies whether or not the attack was successful.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Blackmail': {
            'STAT': 'Cunning',
            'STAT_TIER': 2,
            'ASSET': 'Blackmail',
            'HP': 4,
            'COST': 4,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': 1,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Any attempt to attack or defend against Blackmail loses any bonus dice earned by tags.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Seductrox': {
            'STAT': 'Cunning',
            'STAT_TIER': 2,
            'ASSET': 'Seductrox',
            'HP': 4,
            'COST': 4,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, a Seductrox can travel to any world within one hex. As an attack, a Seductrox does no damage, but an asset that has been successfully attacked immediately reveals any other Stealthed assets of that faction on the planet. Only Special Forces units can attack a Seductrox.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Cyberninjas': {
            'STAT': 'Cunning',
            'STAT_TIER': 3,
            'ASSET': 'Cyberninjas',
            'HP': 4,
            'COST': 6,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Covert Shipping': {
            'STAT': 'Cunning',
            'STAT_TIER': 3,
            'ASSET': 'Covert Shipping',
            'HP': 4,
            'COST': 8,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Any one Special Forces unit can be moved between any worlds within three hexes of the Covert Shipping at the cost of one FacCred.',
            'UPKEEP': 0,
            'RANGE': 3
        },
        'Party Machine': {
            'STAT': 'Cunning',
            'STAT_TIER': 4,
            'ASSET': 'Party Machine',
            'HP': 10,
            'COST': 8,
            'TL': 0,
            'TYPE': 'Facility',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Each turn, a Party Machine provides 1 FacCred to its owning faction.',
            'UPKEEP': 1,
            'RANGE': 0
        },
        'Vanguard Cadres': {
            'STAT': 'Cunning',
            'STAT_TIER': 4,
            'ASSET': 'Vanguard Cadres',
            'HP': 12,
            'COST': 8,
            'TL': 3,
            'TYPE': 'Military Unit',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Tripwire Cells': {
            'STAT': 'Cunning',
            'STAT_TIER': 4,
            'ASSET': 'Tripwire Cells',
            'HP': 8,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Whenever a stealthed asset lands or is purchased on a planet with tripwire cells, the Cells make an immediate Cunning vs. Cunning attack against the owning faction. If successful, the asset loses its stealth.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Seditionists': {
            'STAT': 'Cunning',
            'STAT_TIER': 4,
            'ASSET': 'Seditionists',
            'HP': 8,
            'COST': 12,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'For a cost of 1d4 FacCreds, the Seditionists can attach themselves to an enemy asset. Until they attach to a different asset or no longer share the same planet, the affected asset cannot attack. If the asset is destroyed, the Seditionists survive.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Organization Moles': {
            'STAT': 'Cunning',
            'STAT_TIER': 5,
            'ASSET': 'Organization Moles',
            'HP': 8,
            'COST': 10,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Cracked Comms': {
            'STAT': 'Cunning',
            'STAT_TIER': 5,
            'ASSET': 'Cracked Comms',
            'HP': 6,
            'COST': 14,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'If the Cracked Comms succeeds in defending against an attack, it can immediately cause the attacking asset to make an attack against itself for normal damage or counterattack results.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Boltholes': {
            'STAT': 'Cunning',
            'STAT_TIER': 5,
            'ASSET': 'Boltholes',
            'HP': 6,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'If a faction Special Forces or Military Unit asset on the same planet as the Boltholes suffers damage sufficient to destroy it, it is instead set at 0 HP and rendered untouchable and unusable until it is repaired to full strength. If the Boltholes are destroyed before this happens, the asset is destroyed with them.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Transport Lockdown': {
            'STAT': 'Cunning',
            'STAT_TIER': 6,
            'ASSET': 'Transport Lockdown',
            'HP': 10,
            'COST': 20,
            'TL': 4,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'On a successful Cunning vs. Cunning attack against a rival faction, the rival faction cannot transport assets onto that planet without spending 1d4 FacCreds and waiting one turn.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Covert Transit Net': {
            'STAT': 'Cunning',
            'STAT_TIER': 6,
            'ASSET': 'Covert Transit Net',
            'HP': 15,
            'COST': 18,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, any Special Forces assets can be moved between any worlds within three hexes of the Covert Transit Net.',
            'UPKEEP': 0,
            'RANGE': 3
        },
        'Demagogue': {
            'STAT': 'Cunning',
            'STAT_TIER': 6,
            'ASSET': 'Demagogue',
            'HP': 10,
            'COST': 20,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 8,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Popular Movement': {
            'STAT': 'Cunning',
            'STAT_TIER': 7,
            'ASSET': 'Popular Movement',
            'HP': 16,
            'COST': 25,
            'TL': 4,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'A planet-wide surge of enthusiasm for a cause controlled by the faction. This support pervades all levels of government, and the government always grants any asset purchase or movement requests made by the faction.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Book Of Secrets': {
            'STAT': 'Cunning',
            'STAT_TIER': 7,
            'ASSET': 'Book Of Secrets',
            'HP': 10,
            'COST': 20,
            'TL': 4,
            'TYPE': 'Tactic',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Once per turn, a Book of Secrets allows the faction to reroll one die for an action taken on that world or force an enemy faction to reroll one die. This reroll can only be forced once per turn, no matter how many Books of Secrets are owned.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Treachery': {
            'STAT': 'Cunning',
            'STAT_TIER': 7,
            'ASSET': 'Treachery',
            'HP': 5,
            'COST': 10,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'On a successful attack, the Treachery asset is lost, 5 FacCreds are gained, and the targeted asset switches sides to join the traitor’s faction, even if the faction does not otherwise have the attributes necessary.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Panopticon Matrix': {
            'STAT': 'Cunning',
            'STAT_TIER': 8,
            'ASSET': 'Panopticon Matrix',
            'HP': 20,
            'COST': 30,
            'TL': 5,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Every rival Stealthed asset on the planet must succeed in a Cunning vs. Cunning test at the beginning of every turn or lose their Stealth. The owner also gains an additional die on all Cunning attacks and defenses on that planet.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Security Personnel': {
            'STAT': 'Force',
            'STAT_TIER': 1,
            'ASSET': 'Security Personnel',
            'HP': 3,
            'COST': 2,
            'TL': 0,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 3,
            'ATK_MOD': 1,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Hitmen': {
            'STAT': 'Force',
            'STAT_TIER': 1,
            'ASSET': 'Hitmen',
            'HP': 1,
            'COST': 2,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Force',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Militia Unit': {
            'STAT': 'Force',
            'STAT_TIER': 1,
            'ASSET': 'Militia Unit',
            'HP': 4,
            'COST': 4,
            'TL': 3,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': 1,
            'PERM': 'P',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Heavy Drop Assets': {
            'STAT': 'Force',
            'STAT_TIER': 2,
            'ASSET': 'Heavy Drop Assets',
            'HP': 6,
            'COST': 4,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, any one non-Starship asset, including this one, may be moved to any world within one hex for one FacCred.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Elite Skirmishers': {
            'STAT': 'Force',
            'STAT_TIER': 2,
            'ASSET': 'Elite Skirmishers',
            'HP': 5,
            'COST': 5,
            'TL': 4,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': 1,
            'PERM': 'P',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Hardened Personnel': {
            'STAT': 'Force',
            'STAT_TIER': 2,
            'ASSET': 'Hardened Personnel',
            'HP': 4,
            'COST': 4,
            'TL': 3,
            'TYPE': 'Special Forces',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': 1,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Guerilla Populace': {
            'STAT': 'Force',
            'STAT_TIER': 2,
            'ASSET': 'Guerilla Populace',
            'HP': 6,
            'COST': 4,
            'TL': 0,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': 1,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Zealots': {
            'STAT': 'Force',
            'STAT_TIER': 3,
            'ASSET': 'Zealots',
            'HP': 4,
            'COST': 6,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Zealots take 1d4 damage every time they launch a successful attack or perform a counterattack.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Cunning Trap': {
            'STAT': 'Force',
            'STAT_TIER': 3,
            'ASSET': 'Cunning Trap',
            'HP': 2,
            'COST': 5,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': 3,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Counterintel Unit': {
            'STAT': 'Force',
            'STAT_TIER': 3,
            'ASSET': 'Counterintel Unit',
            'HP': 4,
            'COST': 6,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': 1,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Beachhead Landers': {
            'STAT': 'Force',
            'STAT_TIER': 4,
            'ASSET': 'Beachhead Landers',
            'HP': 10,
            'COST': 10,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the asset may move any number of assets on the planet, including itself, to any world within one hex at a cost of one FacCred per asset moved.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Extended Theater': {
            'STAT': 'Force',
            'STAT_TIER': 4,
            'ASSET': 'Extended Theater',
            'HP': 10,
            'COST': 10,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, any one non-Starship asset, including itself, can be moved between any two worlds within two hexes of the extended theater, at a cost of 1 FacCred.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Strike Fleet': {
            'STAT': 'Force',
            'STAT_TIER': 4,
            'ASSET': 'Strike Fleet',
            'HP': 8,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, they can move to any world within one hex of their current location.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Postech Infantry': {
            'STAT': 'Force',
            'STAT_TIER': 4,
            'ASSET': 'Postech Infantry',
            'HP': 12,
            'COST': 8,
            'TL': 4,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 8,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': 'P',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Blockade Fleet': {
            'STAT': 'Force',
            'STAT_TIER': 5,
            'ASSET': 'Blockade Fleets',
            'HP': 8,
            'COST': 10,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': 'Force',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'When they successfully Attack an enemy faction asset, they steal 1d4 FacCreds from the target faction as well. This theft can occur to a faction only once per turn, no matter how many blockade fleets attack. As an action, this asset may also move itself to a world within one hex.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Pretech Logistics': {
            'STAT': 'Force',
            'STAT_TIER': 5,
            'ASSET': 'Pretech Logistics',
            'HP': 6,
            'COST': 14,
            'TL': 0,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, a pretech logistics asset allows the owner to buy one Force asset on that world that requires up to tech level 5 to purchase. This asset costs half again as many FacCreds as usual, rounded up. Only one asset can be purchased per turn.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Psychic Assassins': {
            'STAT': 'Force',
            'STAT_TIER': 5,
            'ASSET': 'Psychic Assassins',
            'HP': 4,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': 2,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Psychic assassins automatically start Stealthed when purchased.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Pretech Infantry': {
            'STAT': 'Force',
            'STAT_TIER': 6,
            'ASSET': 'Pretech Infantry',
            'HP': 16,
            'COST': 20,
            'TL': 5,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 8,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': 2,
            'PERM': 'P',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Planetary Defenses': {
            'STAT': 'Force',
            'STAT_TIER': 6,
            'ASSET': 'Planetary Defenses',
            'HP': 20,
            'COST': 18,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': 6,
            'PERM': '',
            'SPECIAL': 'Planetary defenses can only defend against attacks by Starship-type assets.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Gravtank Formation': {
            'STAT': 'Force',
            'STAT_TIER': 6,
            'ASSET': 'Gravtank Formation',
            'HP': 14,
            'COST': 25,
            'TL': 4,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 10,
            'ATK_MOD': 4,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 10,
            'DEF_MOD': null,
            'PERM': 'P',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Deep Strike Landers': {
            'STAT': 'Force',
            'STAT_TIER': 7,
            'ASSET': 'Deep Strike Landers',
            'HP': 10,
            'COST': 25,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, any one non-Starship asset, including itself, can be moved between any two worlds within three hexes of the deep strike landers, at a cost of 2 FacCreds. This movement can be done even if the local planetary government objects, albeit doing so is usually an act of open war.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Integral Protocols': {
            'STAT': 'Force',
            'STAT_TIER': 7,
            'ASSET': 'Integral Protocols',
            'HP': 10,
            'COST': 20,
            'TL': 5,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': 2,
            'PERM': '',
            'SPECIAL': 'They can defend only against attacks versus Cunning, but they add an additional die to the defender’s roll.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Space Marines': {
            'STAT': 'Force',
            'STAT_TIER': 7,
            'ASSET': 'Space Marines',
            'HP': 16,
            'COST': 30,
            'TL': 4,
            'TYPE': 'Military Unit',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 8,
            'ATK_MOD': 2,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, they can move to any world within one hex of their current location, whether or not the planetary government permits it.',
            'UPKEEP': 0,
            'RANGE': 1
        },
        'Capital Fleet': {
            'STAT': 'Force',
            'STAT_TIER': 8,
            'ASSET': 'Capital Fleet',
            'HP': 30,
            'COST': 40,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': 'Force',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 3,
            'ATK_NUM_SIDES': 10,
            'ATK_MOD': 4,
            'DEF_NUM_DICE': 3,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Capital fleets are expensive to keep flying, and cost an additional 2 FacCreds of maintenance each turn. As an action, they may move to any world within three hexes of their current location. Planetary government permission is required to raise a capital fleet, but not to move one into a system.',
            'UPKEEP': -2,
            'RANGE': 3
        },
        'Franchise': {
            'STAT': 'Wealth',
            'STAT_TIER': 1,
            'ASSET': 'Franchise',
            'HP': 3,
            'COST': 2,
            'TL': 2,
            'TYPE': 'Facility',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': -1,
            'PERM': '',
            'SPECIAL': 'When a Franchise successfully attacks a enemy asset, the enemy faction loses one FacCred (if available), which is gained by the Franchise’s owner. This loss can happen only once a turn, no matter how many Franchises attack',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Harvesters': {
            'STAT': 'Wealth',
            'STAT_TIER': 1,
            'ASSET': 'Harvesters',
            'HP': 4,
            'COST': 2,
            'TL': 0,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the Harvesters’ owning faction may roll 1d6. On 3+, gain one FacCred.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Local Investments': {
            'STAT': 'Wealth',
            'STAT_TIER': 1,
            'ASSET': 'Local Investments',
            'HP': 2,
            'COST': 1,
            'TL': 2,
            'TYPE': 'Facility',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': -1,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Any other faction that tries to buy an asset on that planet must pay one extra FacCred. This money is not given to the investments’ owner, but is lost. This penalty is only applied once.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Freighter Contract': {
            'STAT': 'Wealth',
            'STAT_TIER': 2,
            'ASSET': 'Freighter Contract',
            'HP': 4,
            'COST': 5,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the faction may move any one non-Force asset, including this one, to any world within two hexes at a cost of one FacCred.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Lawyers': {
            'STAT': 'Wealth',
            'STAT_TIER': 2,
            'ASSET': 'Lawyers',
            'HP': 4,
            'COST': 6,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Lawyers cannot attack or counterattack Force assets.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Union Toughs': {
            'STAT': 'Wealth',
            'STAT_TIER': 2,
            'ASSET': 'Union Toughs',
            'HP': 6,
            'COST': 4,
            'TL': 0,
            'TYPE': 'Military Unit',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': 1,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': '',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Surveyors': {
            'STAT': 'Wealth',
            'STAT_TIER': 2,
            'ASSET': 'Surveyors',
            'HP': 4,
            'COST': 4,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'The presence of a Surveyor crew allows one additional die to be rolled on Expand Influence actions. As an action, a surveyor crew can be moved to any world within two hexes.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Postech Industry': {
            'STAT': 'Wealth',
            'STAT_TIER': 3,
            'ASSET': 'Postech Industry',
            'HP': 4,
            'COST': 8,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the owning faction can roll 1d6 for a Postech Industry asset. On a 1, one FacCred is lost, on a 2-4 one FacCred is earned, and a 5-6 returns two FacCreds. If money is lost and no resources are available to pay it, the Pos- tech Industry is destroyed.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Laboratory': {
            'STAT': 'Wealth',
            'STAT_TIER': 3,
            'ASSET': 'Laboratory',
            'HP': 4,
            'COST': 6,
            'TL': 0,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'The presence of a Laboratory allows assets to be purchased on that world as if it had Tech Level 4.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Mercenaries': {
            'STAT': 'Wealth',
            'STAT_TIER': 3,
            'ASSET': 'Mercenaries',
            'HP': 6,
            'COST': 8,
            'TL': 4,
            'TYPE': 'Military Unit',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Force',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 4,
            'ATK_MOD': 2,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': 'P',
            'SPECIAL': 'Mercenaries have a maintenance cost of one FacCred per turn. As an action, Mercenaries can move to any world within one hex of their current location. To purchase or move a Mercenary asset to a planet requires government permission.',
            'UPKEEP': -1,
            'RANGE': 1
        },
        'Shipping Combine': {
            'STAT': 'Wealth',
            'STAT_TIER': 4,
            'ASSET': 'Shipping Combine',
            'HP': 10,
            'COST': 10,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the combine may move any number of non-Force assets, including itself, to any world within two hexes at a cost of one FacCred per asset.',
            'UPKEEP': 0,
            'RANGE': 2
        },
        'Monopoly': {
            'STAT': 'Wealth',
            'STAT_TIER': 4,
            'ASSET': 'Monopoly',
            'HP': 12,
            'COST': 8,
            'TL': 3,
            'TYPE': 'Facility',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, owners of a monopoly may force one other faction with unstealthed assets on that world to pay them one FacCred. If the target faction can’t pay, they lose one asset of their choice on the world.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Medical Center': {
            'STAT': 'Wealth',
            'STAT_TIER': 4,
            'ASSET': 'Medical Center',
            'HP': 8,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Once between turns, if a Special Forces or Military Unit asset on the world is destroyed, the faction may immediately pay half its purchase cost to restore it with one hit point. Any Repair Asset action taken on that world costs one less FacCred for Special Forces and Military Units.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Bank': {
            'STAT': 'Wealth',
            'STAT_TIER': 4,
            'ASSET': 'Bank',
            'HP': 8,
            'COST': 12,
            'TL': 3,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Once per turn, the faction can ignore one cost or FacCred loss imposed by another faction. This does not require an action. Multiple bank assets allow multiple losses to be ignored.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Marketers': {
            'STAT': 'Wealth',
            'STAT_TIER': 5,
            'ASSET': 'Marketers',
            'HP': 8,
            'COST': 10,
            'TL': 0,
            'TYPE': 'Tactic',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the marketers may test Cunning vs. Wealth against a rival faction’s asset. If successful, the target faction must immediately pay half the asset’s purchase cost, rounded down, or have it become disabled and useless until this price is paid.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Pretech Researchers': {
            'STAT': 'Wealth',
            'STAT_TIER': 5,
            'ASSET': 'Pretech Researchers',
            'HP': 6,
            'COST': 14,
            'TL': 4,
            'TYPE': 'Special Forces',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'Any world with Pretech Researchers on it is treated as tech level 5 for the purpose of buying Cunning and Wealth assets. Pretech researchers have a maintenance cost of 1 FacCred per turn',
            'UPKEEP': -1,
            'RANGE': 0
        },
        'Blockade Runners': {
            'STAT': 'Wealth',
            'STAT_TIER': 5,
            'ASSET': 'Blockade Runners',
            'HP': 6,
            'COST': 12,
            'TL': 4,
            'TYPE': 'Starship',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 4,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, a blockade runner can transfer itself or any one Military Unit or Special Forces to a world within three hexes for a cost of two FacCreds. They can even move units that would otherwise require planetary government permission to enter.',
            'UPKEEP': 0,
            'RANGE': 3
        },
        'Venture Capital': {
            'STAT': 'Wealth',
            'STAT_TIER': 6,
            'ASSET': 'Venture Capital',
            'HP': 10,
            'COST': 15,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 6,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 6,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, venture capital can be tapped. 1d8 is rolled; on a 1, the asset is destroyed, while on a 2-3 one FacCred is gained, 4-7 yields two FacCreds and 8 grants three FacCreds.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'R&D Department': {
            'STAT': 'Wealth',
            'STAT_TIER': 6,
            'ASSET': 'R&D Department',
            'HP': 15,
            'COST': 18,
            'TL': 4,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'A faction with an R&D department may treat all planets as having tech level 4 for purposes of buying Wealth assets.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Commodities Broker': {
            'STAT': 'Wealth',
            'STAT_TIER': 6,
            'ASSET': 'Commodities Broker',
            'HP': 10,
            'COST': 20,
            'TL': 0,
            'TYPE': 'Special Forces',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 8,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 1,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the owner of a commodities broker can roll 1d8; that many FacCreds are subtracted from the cost of their next asset purchase, down to a minimum of half normal price, rounded down.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Pretech Manufactory': {
            'STAT': 'Wealth',
            'STAT_TIER': 7,
            'ASSET': 'Pretech Manufactory',
            'HP': 16,
            'COST': 25,
            'TL': 5,
            'TYPE': 'Facility',
            'ATTACK': '',
            'DEFENSE': '',
            'ATK_NUM_DICE': null,
            'ATK_NUM_SIDES': null,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, the owning faction can roll 1d8 for a Pretech Manufactory, and gain half that many FacCreds, rounded up.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Hostile Takeover': {
            'STAT': 'Wealth',
            'STAT_TIER': 7,
            'ASSET': 'Hostile Takeover',
            'HP': 10,
            'COST': 20,
            'TL': 4,
            'TYPE': 'Tactic',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 10,
            'ATK_MOD': null,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 8,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'If a Hostile Takeover does enough damage to destroy an asset, the target is instead reduced to 1 hit point and acquired by the Hostile Takeover’s owning faction.',
            'UPKEEP': 0,
            'RANGE': 0
        },
        'Transit Web': {
            'STAT': 'Wealth',
            'STAT_TIER': 7,
            'ASSET': 'Transit Web',
            'HP': 5,
            'COST': 15,
            'TL': 5,
            'TYPE': 'Facility',
            'ATTACK': 'Cunning',
            'DEFENSE': 'Cunning',
            'ATK_NUM_DICE': 1,
            'ATK_NUM_SIDES': 12,
            'ATK_MOD': null,
            'DEF_NUM_DICE': null,
            'DEF_NUM_SIDES': null,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'For one FacCred, any number of non-starship Cunning or Wealth assets may be moved between any two worlds within three hexes of the Transit Web. This may be done freely on the owner’s turn so long as the fee can be paid, and using the ability doesn’t require an action.',
            'UPKEEP': 0,
            'RANGE': 3
        },
        'Scavenger Fleet': {
            'STAT': 'Wealth',
            'STAT_TIER': 8,
            'ASSET': 'Scavenger Fleet',
            'HP': 20,
            'COST': 30,
            'TL': 5,
            'TYPE': 'Starship',
            'ATTACK': 'Wealth',
            'DEFENSE': 'Wealth',
            'ATK_NUM_DICE': 2,
            'ATK_NUM_SIDES': 10,
            'ATK_MOD': 4,
            'DEF_NUM_DICE': 2,
            'DEF_NUM_SIDES': 10,
            'DEF_MOD': null,
            'PERM': '',
            'SPECIAL': 'As an action, a Scavenger Fleet can be moved to any world within three hexes. Scavenger Fleets cost 2 FacCreds a turn in maintenance.',
            'UPKEEP': -2,
            'RANGE': 3
        }
    };
    window.planetTags = {
        'Abandoned Colony': {
            'desc': 'The world once hosted a colony, whether human or otherwise, until some crisis or natural disaster drove the inhabitants away or killed them off. The colony might have been mercantile in nature, an expedition to extract valuable local resources, or it might have been a reclusive cabal of zealots. The remains of the colony are usually in ruins, and might still be dangerous from the aftermath of whatever destroyed it in the first place.',
            'infl_mod': 0.0
        },
        'Alien Ruins': {
            'desc': 'The world has significant alien ruins present. The locals may or may not permit others to investigate the ruins, and may make it difficult to remove any objects of value without substantial payment. Any surviving ruins with worthwhile salvage almost certainly have some defense or hazard to explain their unplundered state.',
            'infl_mod': 0.0
        },
        'Altered Humanity': {
            'desc': 'The humans on this world are visibly and drastically different from normal humanity. They may have additional limbs, new sensory organs, or other significant changes. Were these from ancestral eugenic manipulation, strange stellar mutations, or from an environmental toxin unique to this world?',
            'infl_mod': 0.0
        },
        'Anarchists': {
            'desc': 'Rather than being an incidental anarchy of struggling tribes and warring factions, this world actually has a functional society with no centralized authority. Authority might be hyper-localized to extended families, specific religious parishes, or voluntary associations. Some force is preventing an outside group or internal malcontents from coalescing into a power capable of imposing its rule on the locals; this force might be an ancient pretech defense system, a benevolent military AI, or the sheer obscurity and isolation of the culture.',
            'infl_mod': 0.0
        },
        'Anthropormorphs': {
            'desc': 'The locals were originally human, but at some point became anthropomorphic, either as an ancient furry colony, a group of animal-worshiping sectarians, or gengineers who just happened to find animal elements most convenient for surviving on the world. Depending on the skill of the original gengineers, their feral forms may or may not work as well as their original human bodies, or may come with drawbacks inherited from their animal elements.',
            'infl_mod': 0.0
        },
        'Area 51': {
            'desc': 'The world’s government is fully aware of their local stellar neighbors, but the common populace has no idea about itand the government means to keep it that way. Trade with government officials in remote locations is possible, but any attempt to clue the commoners in on the truth will be met with lethal reprisals.',
            'infl_mod': 0.0
        },
        'Badlands World': {
            'desc': 'Whatever the original climate and atmosphere type, something horrible happened to this world. Biological, chemical, or nanotechnical weaponry has reduced it to a wretched hellscape. Some local life might still be able to survive on its blasted surface, usually at some dire cost in health or humanity.',
            'infl_mod': 0.0
        },
        'Battleground': {
            'desc': 'The world is a battleground for two or more outside powers. They may be interstellar rivals, or groups operating out of orbitals or other system bodies. Something about the planet is valuable enough for them to fight over, but the natives are too weak to be anything but animate obstacles to the fight.',
            'infl_mod': 0.0
        },
        'Beastmasters': {
            'desc': 'The natives have extremely close bonds with the local fauna, possibly having special means of communication and control through tech or gengineering. Local animal life plays a major role in their society, industry, or warfare, and new kinds of beasts may be bred to suit their purposes.',
            'infl_mod': 0.0
        },
        'Bubble Cities': {
            'desc': 'Whether due to a lack of atmosphere or an uninhabitable climate, the world’s cities exist within domes or pressurized buildings. In such sealed environments, techniques of surveillance and control can grow baroque and extreme.',
            'infl_mod': 0.0
        },
        'Cheap Life': {
            'desc': 'Human life is near-worthless on this world. Ubiquitous cloning, local conditions that ensure early death, a culture that reveres murder, or a social structure that utterly discounts the value of most human lives ensures that death is the likely outcome for any action that irritates someone consequential.',
            'infl_mod': -0.1
        },
        'Civil War': {
            'desc': 'The world is currently torn between at least two opposing factions, all of which claim legitimacy. The war may be the result of a successful rebel uprising against tyranny, or it might just be the result of schemers who plan to be the new masters once the revolution is complete.',
            'infl_mod': 0.0
        },
        'Cold War': {
            'desc': 'Two or more great powers control the planet, and they have a hostility to each other that’s just barely less than open warfare. The hostility might be ideological in nature, or it might revolve around control of some local resource.',
            'infl_mod': 0.0
        },
        'Colonized Population': {
            'desc': 'A neighboring world has successfully colonized this less-advanced or less-organized planet, and the natives aren’t happy about it. A puppet government may exist, but all real decisions are made by the local viceroy.',
            'infl_mod': -0.1
        },
        'Cultural Power': {
            'desc': 'The world is a considerable cultural power in the sector, producing music, art, philosophy, or some similar intangible that their neighbors find irresistibly attractive. Other worlds might have a profound degree of cultural cachet as the inheritor of some venerable artistic tradition.',
            'infl_mod': 0.3
        },
        'Cybercommunists': {
            'desc': 'On this world communism actually works, thanks to pretech computing devices and greater or lesser amounts of psychic precognition. Central planning nodes direct all production and employment on the world. Citizens in good standing have access to ample amounts of material goods for all needs and many wants. Instead of strife over wealth, conflicts erupt over political controls, cultural precepts, or control over the planning nodes. Many cybercommunist worlds show a considerable bias toward the private interests of those who run the planning nodes.',
            'infl_mod': 0.0
        },
        'Cyborgs': {
            'desc': 'The planet’s population makes heavy use of cybernetics, with many of the inhabitants possessing at least a cosmetic amount of chrome. This may be the result of a strong local cyber tech base, a religious injunction, or simply a necessary measure to survive the local conditions.',
            'infl_mod': 0.0
        },
        'Cyclical Doom': {
            'desc': 'The world regularly suffers some apocalyptic catastrophe that wipes out organized civilization on it. The local culture is aware of this cycle and has traditions to ensure a fragment of civilization survives into the next era, but these traditions don’t always work properly, and sometimes dangerous fragments of the past emerge.',
            'infl_mod': 0.0
        },
        'Desert World': {
            'desc': 'The world may have a breathable atmosphere and a human-tolerable temperature range, but it is an arid, stony waste outside of a few places made habitable by human effort. The deep wastes are largely unexplored and inhabited by outcasts and worse.',
            'infl_mod': 0.0
        },
        'Doomed World': {
            'desc': 'The world is doomed, and the locals may or may not know it. Some cosmic catastrophe looms before them, and the locals have no realistic way to get everyone to safety. To the extent that the public is aware, society is disintegrating into a combination of religious fervor, abject hedonism, and savage violence.',
            'infl_mod': 0.0
        },
        'Dying Race': {
            'desc': 'The inhabitants of this world are dying out, and they know it. Through environmental toxins, hostile bio-weapons, or sheer societal despair, the culture cannot replenish its numbers. Members seek meaning in their own strange goals or peculiar faiths, though a few might struggle to find some way to reverse their slow yet inevitable doom.',
            'infl_mod': -0.1
        },
        'Eugenic Cult': {
            'desc': 'Even in the days before the Silence, major improvement of the human genome always seemed to come with unacceptable side-effects. Some worlds host secret cults that perpetuate these improvements regardless of the cost, and a few planets have been taken over entirely by the cults.',
            'infl_mod': 0.0
        },
        'Exchange Consulate': {
            'desc': 'The Exchange of Light once served as the largest, most trusted banking and diplomatic service in human space. Even after the Silence, some worlds retain a functioning Exchange Consulate where banking services and arbitration can be arranged.',
            'infl_mod': 0.1
        },
        'Fallen Hegemon': {
            'desc': 'At some point in the past, this world was a hegemonic power over some or all of the sector, thanks to superior tech, expert diplomacy, the weakness of their neighbors, or inherited Mandate legitimacy. Some kind of crash or revolt broke their power, however, and now the world is littered with the wreckage of former glory.',
            'infl_mod': 0.0
        },
        'Feral World': {
            'desc': 'In the long, isolated night of the Silence, some worlds have experienced total moral and cultural collapse. Whatever remains has been twisted beyond recognition into assorted death cults, xenophobic fanaticism, horrific cultural practices, or other behavior unacceptable on more enlightened worlds. These worlds are almost invariably quarantined by other planets.',
            'infl_mod': 0.0
        },
        'Flying Cities': {
            'desc': 'Perhaps the world is a gas giant, or plagued with unendurable storms at lower levels of the atmosphere. For whatever reason, the cities of this world fly above the surface of the planet. Perhaps they remain stationary, or perhaps they move from point to point in search of resources.',
            'infl_mod': 0.0
        },
        'Forbidden Tech': {
            'desc': 'Some group on this planet fabricates or uses maltech. Unbraked AIs doomed to metastasize into insanity, nation-destroying nanowarfare particles, slow-burn DNA corruptives, genetically engineered slaves, or something worse still. The planet’s larger population may or may not be aware of the danger in their midst.',
            'infl_mod': 0.0
        },
        'Former Warriors': {
            'desc': 'The locals of this world were once famed for their martial prowess. They may have simply had a very militaristic culture, or were genetically engineered for combat, or developed high-tech weaponry, or had brilliant leadership. Those days are past, however, either due to crushing defeat, external restrictions, or a cultural turn toward peace.',
            'infl_mod': 0.0
        },
        'Freak Geology': {
            'desc': 'The geology or geography of this world is simply freakish. Perhaps it’s composed entirely of enormous mountain ranges, or regular bands of land and sea, or the mineral structures all fragment into perfect cubes. The locals have learned to deal with it and their culture will be shaped by its requirements.',
            'infl_mod': 0.0
        },
        'Freak Weather': {
            'desc': 'The planet is plagued with some sort of bizarre or hazardous weather pattern. Perhaps city-flattening storms regularly scourge the surface, or the world’s sun never pierces its thick banks of clouds.',
            'infl_mod': 0.0
        },
        'Friendly Foe': {
            'desc': 'Some hostile alien race or malevolent cabal has a branch or sect on this world that is actually quite friendly toward outsiders. For whatever internal reason, they are willing to negotiate and deal honestly with strangers, and appear to lack the worst impulses of their fellows.',
            'infl_mod': 0.0
        },
        'Gold Rush': {
            'desc': 'Gold, silver, and other conventional precious minerals are common and cheap now that asteroid mining is practical for most worlds. But some minerals and compounds remain precious and rare, and this world has recently been discovered to have a supply of them. People from across the sector have come to strike it rich.',
            'infl_mod': 0.1
        },
        'Great Work': {
            'desc': 'The locals are obsessed with completing a massive project, one that has consumed them for generations. It might be the completion of a functioning spaceyard, a massive solar power array, a network of terraforming engines, or the universal conversion of their neighbors to their own faith. The purpose of their entire civilization is to progress and some day complete the work.',
            'infl_mod': 0.0
        },
        'Hatred': {
            'desc': 'For whatever reason, this world’s populace has a burning hatred for the inhabitants of a neighboring system. Perhaps this world was colonized by exiles, or there was a recent interstellar war, or ideas of racial or religious superiority have fanned the hatred. Regardless of the cause, the locals view their neighbor and any sympathizers with loathing.',
            'infl_mod': 0.0
        },
        'Heavy Industry': {
            'desc': 'With interstellar transport so limited in the bulk it can move, worlds have to be largely self-sufficient in industry. Some worlds are more sufficient than others, however, and this planet has a thriving manufacturing sector capable of producing large amounts of goods appropriate to its tech level. The locals may enjoy a correspondingly higher lifestyle, or the products might be devoted towards vast projects for the aggrandizement of the rulers.',
            'infl_mod': 0.0
        },
        'Heavy Mining': {
            'desc': 'This world has large stocks of valuable minerals, usually necessary for local industry, life support, or refinement into loads small enough to export offworld. Major mining efforts are necessary to extract the minerals, and many natives work in the industry.',
            'infl_mod': 0.0
        },
        'Hivemind': {
            'desc': 'Natives of this world exist in a kind of mental gestalt, sharing thoughts and partaking of a single identity. Powerful pretech, exotic psionics, alien influence, or some other cause has left the world sharing one identity. Individual members may have greater or lesser degrees of effective coordination with the whole.',
            'infl_mod': -0.2
        },
        'Holy War': {
            'desc': 'A savage holy war is raging on this world, either between factions of locals or as a united effort against the pagans of some neighboring world. This war might involve a conventional religion, or it might be the result of a branding campaign, political ideology, artistic movement, or any other cause that people use as a substitute for traditional religion.',
            'infl_mod': 0.0
        },
        'Hostile Biosphere': {
            'desc': 'The world is teeming with life, and it hates humans. Perhaps the life is xenoallergenic, forcing filter masks and tailored antiallergens for survival. It could be the native predators are huge and fearless, or the toxic flora ruthlessly outcompetes earth crops.',
            'infl_mod': -0.1
        },
        'Hostile Space': {
            'desc': 'The system in which the world exists is a dangerous neighborhood. Something about the system is perilous to inhabitants, either through meteor swarms, stellar radiation, hostile aliens in the asteroid belt, or periodic comet clouds.',
            'infl_mod': -0.1
        },
        'Immortals': {
            'desc': 'Natives of this world are effectively immortal. They may have been gengineered for tremendous lifespans, or have found some local anagathic, or be cyborg life forms, or be so totally convinced of reincarnation that death is a cultural irrelevance. Any immortality technique is likely applicable only to them, or else it’s apt to be a massive draw to outside imperialists.',
            'infl_mod': 0.0
        },
        'Local Speciality': {
            'desc': 'The world may be sophisticated or barely capable of steam engines, but either way it produces something rare and precious to the wider galaxy. It might be some pharmaceutical extract produced by a secret recipe, a remarkably popular cultural product, or even gengineered humans uniquely suited for certain work.',
            'infl_mod': 0.1
        },
        'Local Tech': {
            'desc': 'The locals can create a particular example of extremely high tech, possibly even something that exceeds pretech standards. They may use unique local resources to do so, or have stumbled on a narrow scientific breakthrough, or still have a functional experimental manufactory.',
            'infl_mod': 0.1
        },
        'Major Spaceyard': {
            'desc': 'Most worlds of tech level 4 or greater have the necessary tech and orbital facilities to build spike drives and starships. This world is blessed with a major spaceyard facility, either inherited from before the Silence or painstakingly constructed in more recent decades. It can build even capital-class hulls, and do so more quickly and cheaply than its neighbors.',
            'infl_mod': 0.2
        },
        'Mandarinate': {
            'desc': 'The planet is ruled by an intellectual elite chosen via ostensibly neutral examinations or tests. The values this system selects for may or may not have anything to do with actual practical leadership skills, and the examinations may be more or less corruptible.',
            'infl_mod': 0.0
        },
        'Mandate Base': {
            'desc': 'The Terran Mandate retained its control over this world for much longer than usual, and the world may still consider itself a true inheritor of Mandate legitimacy. Most of these worlds have or had superior technology, but they may still labor under the burden of ancient restrictive tech or monitoring systems designed to prevent them from rebelling.',
            'infl_mod': 0.0
        },
        'Maneaters': {
            'desc': 'The locals are cannibals, either out of necessity or out of cultural preference. Some worlds may actually eat human flesh, while others simply require the rendering of humans into important chemicals or pharmaceutical compounds, perhaps to prolong the lives of ghoul overlords. This cannibalism plays a major role in their society.',
            'infl_mod': 0.0
        },
        'Megacorps': {
            'desc': 'The world is dominated by classic cyberpunk-esque megacorporations, each one far more important than the vestigial national remnants that encompass them. These megacorps are usually locked in a cold war, trading and dealing with each other even as they try to strike in deniable ways. An over-council of corporations usually acts to bring into line any that get excessively overt in their activities.',
            'infl_mod': 0.0
        },
        'Mercenaries': {
            'desc': 'The world is either famous for its mercenary bands or it is plagued by countless groups of condottieri in service to whatever magnate can afford to pay or bribe them adequately.',
            'infl_mod': 0.0
        },
        'Minimal Contact': {
            'desc': 'The locals refuse most contact with offworlders. Only a small, quarantined treaty port is provided for offworld trade, and ships can expect an exhaustive search for contraband. Local governments may be trying to keep the very existence of interstellar trade a secret from their populations, or they may simply consider offworlders too dangerous or repugnant to be allowed among the population.',
            'infl_mod': -0.1
        },
        'Misandry/Misogyny': {
            'desc': 'The culture on this world holds a particular gender in contempt. Members of that gender are not permitted positions of formal power, and may be restricted in their movements and activities. Some worlds may go so far as to scorn both traditional genders, using gengineering techniques to hybridize or alter conventional human biology.',
            'infl_mod': 0.0
        },
        'Night World': {
            'desc': 'The world is plunged into eternal darkness. The only life on this planet derives its energy from other sources, such as geothermal heat, extremely volatile chemical reactions in the planet’s soil, or light in a non-visible spectrum. Most flora and fauna is voraciously eager to consume other life.',
            'infl_mod': 0.0
        },
        'Nomads': {
            'desc': 'Most of the natives of this world are nomadic, usually following a traditional cycle of movement through the lands they possess. Promises of rich plunder or local environmental perils can force these groups to strike out against neighbors. Other groups are forced to move constantly due to unpredictable dangers that crop up on the planet.',
            'infl_mod': 0.0
        },
        'Oceanic World': {
            'desc': 'The world is entirely or almost entirely covered with liquid water. Habitations might be floating cities, or might cling precariously to the few rocky atolls jutting up from the waves, or are planted as bubbles on promontories deep beneath the stormy surface. Survival depends on aquaculture. Planets with inedible alien life rely on gengineered Terran sea crops.',
            'infl_mod': 0.0
        },
        'Out of Contact': {
            'desc': 'The natives have been entirely out of contact with the greater galaxy for centuries or longer. Perhaps the original colonists were seeking to hide from the rest of the universe, or the Silence destroyed any means of communication. It may have been so long that human origins on other worlds have regressed into a topic for legends. The players might be on the first offworld ship to land since the First Wave of colonization a thousand years ago.',
            'infl_mod': -0.2
        },
        'Outpost World': {
            'desc': 'The world is only a tiny outpost of human habitation planted by an offworld corporation or government. Perhaps the staff is there to serve as a refueling and repair stop for passing ships, or to oversee an automated mining and refinery complex. They might be there to study ancient ruins, or simply serve as a listening and monitoring post for traffic through the system. The outpost is likely well-equipped with defenses against casual piracy.',
            'infl_mod': 0.0
        },
        'Perimeter Agency': {
            'desc': 'Before the Silence, the Perimeter was a Terran-sponsored organization charged with rooting out use of maltech, technology banned in human space as too dangerous for use or experimentation. Unbraked AIs, gengineered slave species, nanotech replicators, weapons of planetary destruction... the Perimeter hunted down experimenters with a great indifference to planetary laws. Most Perimeter Agencies collapsed during the Silence, but a few managed to hold on to their mission, though modern Perimeter agents often find more work as conventional spies.',
            'infl_mod': 0.0
        },
        'Pilgrimage Site': {
            'desc': 'The world is noted for an important spiritual or historical location, and might be the sector headquarters for a widespread religion or political movement. The site attracts wealthy pilgrims from throughout nearby space, and those with the money necessary to manage interstellar travel can be quite generous to the site and its keepers. The locals tend to be fiercely protective of the place and its reputation, and some places may forbid the entrance of those not suitably pious or devout.',
            'infl_mod': 0.1
        },
        'Pleasure World': {
            'desc': 'This world provides delights either rare or impermissible elsewhere. Matchless local beauty, stunningly gengineered natives, a wide variety of local drugs, carnal pleasures unacceptable on other worlds, or some other rare delight is readily available here. Most worlds are fully aware of the value of their offerings, and the prices they demand can be in credits or in less tangible recompense.',
            'infl_mod': 0.2
        },
        'Police State': {
            'desc': 'The world is a totalitarian police state. Any sign of disloyalty to the planet’s rulers is punished severely, and suspicion riddles society. Some worlds might operate by Soviet-style informers and indoctrination, while more technically sophisticated worlds might rely on omnipresent cameras or braked AI “guardian angels”. Outworlders are apt to be treated as a necessary evil at best, and “disappeared” if they become troublesome.',
            'infl_mod': -999.0
        },
        'Post-Scarcity': {
            'desc': 'The locals have maintained sufficient Mandate-era tech to be effectively post-scarcity in their economic structure. Everyone has all the necessities and most of the desires they can imagine. Conflict now exists over the apportionment of services and terrestrial space, since anything else can be had in abundance. Military goods and items of mass destruction may still be restricted, and there is probably some reason that the locals do not export their vast wealth.',
            'infl_mod': 0.1
        },
        'Preceptor Archive': {
            'desc': 'The Preceptors of the Great Archive were a pre-Silence organization devoted to ensuring the dissemination of human culture, history, and basic technology to frontier worlds that risked losing this information during the human expansion. Most frontier planets had an Archive where natives could learn useful technical skills in addition to human history and art. Those Archives that managed to survive the Silence now strive to send their missionaries of knowledge to new worlds in need of their lore.',
            'infl_mod': 0.0
        },
        'Pretech Cultists': {
            'desc': 'The capacities of human science before the Silence vastly outmatch the technology available since the Scream. The Jump Gates alone were capable of crossing hundreds of light years in a moment, and they were just one example of the results won by blending psychic artifice with pretech science. Some worlds outright worship the artifacts of their ancestors, seeing in them the work of more enlightened and perfect humanity. These cultists may or may not understand the operation or replication of these devices, but they seek and guard them jealously.',
            'infl_mod': 0.0
        },
        'Primitive Aliens': {
            'desc': 'The world is populated by a large number of sapient aliens that have yet to develop advanced technology. The human colonists may have a friendly or hostile relationship with the aliens, but a certain intrinsic tension is likely. Small human colonies might have been enslaved or otherwise subjugated.',
            'infl_mod': 0.0
        },
        'Prison Planet': {
            'desc': 'This planet is or was intended as a prison. Some such prisons were meant for specific malefactors of the Terran Mandate, while others were to contain entire “dangerous” ethnic groups or alien races. Some may still have warden AIs or automatic systems to prevent any unauthorized person from leaving, and any authorization permits have long since expired.',
            'infl_mod': -0.2
        },
        'Psionics Academy': {
            'desc': 'This world is one of the few that have managed to redevelop the basics of psychic training. Without this education, a potential psychic is doomed to either madness or death unless they refrain from using their abilities. Psionic academies are rare enough that offworlders are often sent there to study by wealthy patrons. The secrets of psychic mentorship, the protocols and techniques that allow a psychic to successfully train another, are carefully guarded at these academies. Most are closely affiliated with the planetary government.',
            'infl_mod': 0.0
        },
        'Psionics Fear': {
            'desc': 'The locals are terrified of psychics. Perhaps their history is studded with feral psychics who went on murderous rampages, or perhaps they simply nurse an unreasoning terror of those “mutant freaks”. Psychics demonstrate their powers at risk of their lives.',
            'infl_mod': 0.0
        },
        'Psionics Worship': {
            'desc': 'These natives view psionic powers as a visible gift of god or sign of superiority. If the world has a functional psychic training academy, psychics occupy almost all major positions of power and are considered the natural and proper rulers of the world. If the world lacks training facilities, it is likely a hodgepodge of demented cults, with each one dedicated to a marginally-coherent feral prophet and their psychopathic ravings.',
            'infl_mod': 0.0
        },
        'Quarantined World': {
            'desc': 'The world is under a quarantine, and space travel to and from it is strictly forbidden. This may be enforced by massive ground batteries that burn any interlopers from the planet’s sky, or it may be that a neighboring world runs a persistent blockade.',
            'infl_mod': -0.3
        },
        'Radioactive World': {
            'desc': 'Whether due to a legacy of atomic warfare unhindered by nuke snuffers or a simple profusion of radioactive elements, this world glows in the dark. Even heavy vacc suits can filter only so much of the radiation, and most natives suffer a wide variety of cancers, mutations and other illnesses without the protection of advanced medical treatments.',
            'infl_mod': -0.1
        },
        'Refugees': {
            'desc': 'The world teems with refugees, either exiles from another planet who managed to get here, or the human detritus of some local conflict that have fled to the remaining stable states. The natives usually regard the refugees with hostility, an attitude returned by many among their unwilling guests.',
            'infl_mod': 0.0
        },
        'Regional Hegemon': {
            'desc': 'This world has the technological sophistication, natural resources, and determined polity necessary to be a regional hegemon for the sector. Nearby worlds are likely either directly subservient to it or tack carefully to avoid its anger. It may even be the capital of a small stellar empire.',
            'infl_mod': 0.0
        },
        'Restrictive Laws': {
            'desc': 'A myriad of laws, customs, and rules constrain the inhabitants of this world, and even acts that are completely permissible elsewhere are punished severely here. The locals may provide lists of these laws to offworlders, but few non-natives can hope to master all the important intricacies.',
            'infl_mod': 0.0
        },
        'Revanchists': {
            'desc': 'The locals formerly owned another world, or a major nation on the planet formerly owned an additional region of land. Something happened to take away this control or drive out the former rulers, and they’ve never forgotten it. The locals are obsessed with reclaiming their lost lands, and will allow no questions of practicality to interfere with their cause.',
            'infl_mod': 0.0
        },
        'Revolutionaries': {
            'desc': 'The world is convulsed by one or more bands of revolutionaries, with some nations perhaps in the grip of a current revolution. Most of these upheavals can be expected only to change the general flavor of problems in the polity, but the process of getting there usually produces a tremendous amount of suffering.',
            'infl_mod': 0.0
        },
        'Rigid Culture': {
            'desc': 'The local culture is extremely rigid. Certain forms of behavior and belief are absolutely mandated, and any deviation from these principles is punished, or else society may be strongly stratified by birth with limited prospects for change. Anything which threatens the existing social order is feared and shunned.',
            'infl_mod': -0.1
        },
        'Rising Hegemon Robots': {
            'desc': 'This world is not yet a dominant power in the sector, but it’s well on its way there. Whether through newly-blossoming economic, military, or cultural power, they’re extending their influence over their neighbors and forging new arrangements between their government and the rulers of nearby worlds.',
            'infl_mod': 0.0
        },
        'Ritual Combat': {
            'desc': 'The locals favor some form of stylized combat to resolve disputes, provide entertainment, or settle religious differences. This combat is probably not normally lethal unless it’s reserved for a specific disposable class of slaves or professionals. Some combat may involve mastery of esoteric weapons and complex arenas, while other forms might require nothing more than a declaration in the street and a drawn gun.',
            'infl_mod': 0.0
        },
        'Robots': {
            'desc': 'The world has a great many robots on it. Most bots are going to be non-sentient expert systems, though an AI with enough computing resources can control many bots at once, and some worlds may have developed VIs to a degree that individual bots can seem (or be) sentient. Some worlds might even be ruled by metal overlords, ones which do not need to be sentient so long as they have overwhelming force.',
            'infl_mod': 0.0
        },
        'Seagoing Cities': {
            'desc': 'Either the world is entirely water or else the land is simply too dangerous for most humans. Human settlement on this world consists of a number of floating cities that follow the currents and the fish. These city-ships might have been purpose-built for their task, or they could be jury-rigged conglomerations of ships and structures thrown together when the need for seagoing life become apparent to the locals.',
            'infl_mod': 0.0
        },
        'Sealed Menace': {
            'desc': 'Something on this planet has the potential to create enormous havoc for the inhabitants if it is not kept safely contained by its keepers. Whether a massive seismic fault line suppressed by pretech terraforming technology, a disease that has to be quarantined within hours of discovery, or an ancient alien relic that requires regular upkeep in order to prevent planetary catastrophe, the menace is a constant shadow on the fearful populace.',
            'infl_mod': 0.0
        },
        'Secret Masters': {
            'desc': 'The world is actually run by a hidden cabal, acting through their catspaws in the visible government. For one reason or another, this group finds it imperative that they not be identified by outsiders, and in some cases even the planet’s own government may not realize that they’re actually being manipulated by hidden masters.',
            'infl_mod': -999.0
        },
        'Sectarians': {
            'desc': 'The world is torn by violent disagreement between sectarians of a particular faith. Each views the other as a damnable heresy in need of extirpation. Local government may be able to keep open war from breaking out, but the poisonous hatred divides communities. The nature of the faith may be religious, or it may be based on some secular ideology.',
            'infl_mod': 0.0
        },
        'Seismic Instability': {
            'desc': 'The local land masses are remarkably unstable, and regular earthquakes rack the surface. Local construction is either advanced enough to sway and move with the vibrations or primitive enough that it is easily rebuilt. Severe volcanic activity may be part of the instability.',
            'infl_mod': 0.0
        },
        'Shackled World': {
            'desc': 'This world is being systematically contained by an outside power. Some ancient autonomous defense grid, robot law enforcement, alien artifact, or other force is preventing the locals from developing certain technology, or using certain devices, or perhaps from developing interstellar flight. This limit may or may not apply to offworlders; in the former case, the PCs may have to figure out a way to beat the shackles simply to escape the world.',
            'infl_mod': 0.0
        },
        'Societal Despair': {
            'desc': 'The world’s dominant society has lost faith in itself. Whether through some all-consuming war, great catastrophe, overwhelming outside culture, or religious collapse, the natives no longer believe in their old values, and search desperately for something new. Fierce conflict often exists between the last believers in the old dispensation and the nihilistic or searching disciples of the new age.',
            'infl_mod': 0.0
        },
        'Sole Supplier': {
            'desc': 'Some extremely important resource is exported from this world and this world alone. It’s unlikely that the substance is critical for building spike drives unless this world is also the first to begin interstellar flight, but it may be critical to other high-tech processes or devices. The locals make a large amount of money off this trade and control of it is of critical importance to the planet’s rulers, and potentially to outside powers.',
            'infl_mod': 0.2
        },
        'Taboo Treasure': {
            'desc': 'The natives here produce something that is both fabulously valuable and strictly forbidden elsewhere in the sector. It may be a lethally addictive drug, forbidden gengineering tech, vat-grown “perfect slaves”, or a useful substance that can only be made through excruciating human suffering. This treasure is freely traded on the world, but bringing it elsewhere is usually an invitation to a long prison stay or worse.',
            'infl_mod': 0.0
        },
        'Terraform Failure': {
            'desc': 'This world was marginal for human habitation when it was discovered, but the Mandate or the early government put in pretech terraforming engines to correct its more extreme qualities. The terraforming did not entirely work, either failing of its own or suffering the destruction of the engines during the Silence. The natives are only partly adapted to the world’s current state, and struggle with the environment.',
            'infl_mod': 0.0
        },
        'Theocracy': {
            'desc': 'The planet is ruled by the priesthood of the predominant religion or ideology. The rest of the locals may or may not be terribly pious, but the clergy have the necessary military strength, popular support or control of resources to maintain their rule. Alternative faiths or incompatible ideologies are likely to be both illegal and socially unacceptable.',
            'infl_mod': 0.0
        },
        'Tomb World': {
            'desc': 'Tomb worlds are planets that were once inhabited by humans before the Silence. The sudden collapse of the jump gate network and the inability to bring in the massive food supplies required by the planet resulted in starvation, warfare, and death. Most tomb worlds are naturally hostile to human habitation and could not raise sufficient crops to maintain life. The few hydroponic facilities were usually destroyed in the fighting, and all that is left now are ruins, bones, and silence.',
            'infl_mod': -0.3
        },
        'Trade Hub': {
            'desc': 'This world is a major crossroads for local interstellar trade. It is well-positioned at the nexus of several short-drill trade routes, and has facilities for easy transfer of valuable cargoes and the fueling and repairing of starships. The natives are accustomed to outsiders, and a polyglot mass of people from every nearby world can be found trading here.',
            'infl_mod': 0.2
        },
        'Tyranny': {
            'desc': 'The local government is brutal and indifferent to the will of the people. Laws may or may not exist, but the only one that matters is the whim of the rulers on any given day. Their minions swagger through the streets while the common folk live in terror of their appetites. The only people who stay wealthy are friends and servants of the ruling class.',
            'infl_mod': 0.0
        },
        'Unbraked AI': {
            'desc': 'Artificial intelligences are costly and difficult to create, requiring a careful sequence of “growth stages” in order to bring them to sentience before artificial limits on cognition speed and learning development are installed. These “brakes” prevent runaway cognition metastasis. This world has an “unbraked AI” on it, probably with a witting or unwitting corps of servants. Unbraked AIs are quite insane, but they learn and reason with a speed impossible for humans, and can demonstrate a truly distressing subtlety.',
            'infl_mod': 0.0
        },
        'Urbanized Surface': {
            'desc': 'The world’s land area is covered with buildings that extend downward for multiple levels. Such worlds either have a population in the trillions, extremely little land area, or are largely-abandoned due to some past catastrophe. Agriculture and resource extraction are part of the urban complex, and there may be an advanced maintenance system that may not be entirely under the control of present natives.',
            'infl_mod': 0.1
        },
        'Utopia': {
            'desc': 'Natural and social conditions on this world have made it a paradise for its inhabitants, a genuine utopia of happiness and fulfillment. This is normally the result of drastic human engineering, including brain-gelding, neurochemical control, personality curbs, or complete “humanity” redefinitions. Even so, the natives are extremely happy with their lot, and may wish to extend that joy to poor, sad outsiders.',
            'infl_mod': 0.0
        },
        'Warlords': {
            'desc': 'The world is plagued by warlords. Numerous powerful men and women control private armies sufficiently strong to cow whatever local government may exist. On the lands they claim, their word is law. Most spend their time oppressing their own subjects and murderously pillaging those of their neighbors. Most like to wrap themselves in the mantle of ideology, religious fervor, or an ostensibly legitimate right to rule.',
            'infl_mod': 0.0
        },
        'Xenophiles': {
            'desc': 'The natives of this world are fast friends with a particular alien race. The aliens may have saved the planet at some point in the past, or awed the locals with superior tech or impressive cultural qualities. The aliens might even be the ruling class on the planet.',
            'infl_mod': 0.0
        },
        'Xenophobes': {
            'desc': 'The natives are intensely averse to dealings with outworlders. Whether through cultural revulsion, fear of tech contamination, or a genuine immunodeficiency, the locals shun foreigners from offworld and refuse to have anything to do with them beyond the bare necessities of contact. Trade may or may not exist on this world, but if it does, it is almost certainly conducted by a caste of untouchables and outcasts.',
            'infl_mod': 0.0
        },
        'Zombies': {
            'desc': 'This menace may not take the form of shambling corpses, but some disease, alien artifact, or crazed local practice produces men and women with habits similar to those of murderous cannibal undead. These outbreaks may be regular elements in local society, either provoked by some malevolent creators or the consequence of some local condition.',
            'infl_mod': -0.2
        }
    };
    window.factionTags = {
        'Colonists': 'This faction has all the benefits of the Planetary Government tag for its homeworld, as no other government exists on a fresh colony. The faction’s homeworld is also treated as if it had at least tech level 4. Colonies with fewer than 100,000 citizens lack the necessary industrial infrastructure to build Spaceshiptype assets.',
        'Cultural Influencer': 'This Faction\'s Assets are particularly good at altering the cultural and social behaviour of the populations of the planets they are present on. All Assets belonging to this Faction grant an additional 50% Influence each. In addition, becoming the Planetary Government grants an additional 50% influence to that bonus.',
        'Deep Rooted': 'This faction can roll one additional d10 when defending against attacks on assets on their homeworld. If the faction ever changes homeworlds, this tag is lost.',
        'Eugenics Cult': 'Eugenics Cultists can buy the Gengineered Slaves asset; it’s an asset requiring Force 1 with the statistics of 6 HP, 2 FacCred cost, tech level 4 required, with an Attack of Force vs. Force/1d6 damage and a Counterattack of 1d4 damage. Once per turn, the Eugenics Cult can roll an extra d10 on an attack or defense by a Gengineered Slaves asset.',
        'Exchange Consulate': 'When the faction successfully completes a “Peaceable Kingdom” Goal, they may roll 1d6; on a 4+, they gain a bonus experience point. Once per turn, the faction may roll an extra d10 when defending against a Wealth attack.',
        'Fanatical': 'The faction always rerolls any dice that come up as 1. This zealousness leaves them open at times, however; they always lose ties during attacks.',
        'Imperialists': 'This faction may roll an extra d10 for attacks made as part of a Seize Planet action.',
        'Machiavellian': 'Once per turn, this faction can roll an additional d10 when making a Cunning attack.',
        'Mercenary Group': 'All faction assets gain the following special ability: As an action, the asset may move itself to any world within one hex.',
        'Perimeter Agency': 'Once per turn, the faction may roll an additional d10 when making an attack against an asset that requires tech level 5 to purchase. The faction may roll an extra die when making a test to detect Stealthed assets.',
        'Pirates': 'Any movement of an asset onto a world that has a Base of Influence for this faction costs one extra FacCred, paid to this faction.',
        'Planetary Government': 'The faction’s permission is required to buy or import those assets marked as needing government permission. This tag can be acquired multiple times, once for each planet the faction controls.',
        'Plutocratic': 'Once per turn, this faction can roll an additional d10 when making a Wealth attack.',
        'Preceptor Archive': 'Purchasing an asset that requires tech level 4 or more costs one fewer FacCred than normal. The Preceptor Archive may also take the special action “Teach Planetary Population”, costing 2 FacCreds and allowing them to roll 1d12 for one world. On a 12, the world’s tech level permanently becomes 4 for the purposes and purchases of this faction.',
        'Psychic Academy': 'This faction can provide psionic mentor training to qualified psychics. Once per turn, this faction can also force a rival faction to reroll any one d10, whether or not this faction is involved in the roll.',
        'Savage': 'Once per turn, this faction can roll an extra die when defending with an asset that requires tech level 0 to purchase.',
        'Scavengers': 'Whenever the faction destroys an asset or has one of their assets destroyed, they gain one FacCred.',
        'Secretive': 'All assets purchased by this faction automatically begin Stealthed. See the list of Cunning assets for details on Stealth.',
        'Technical Expertise': 'This faction treats all planets on which they have a Base of Influence as if they were at least tech level 4. They can build Starship-type assets on any world with at least ten thousand occupants',
        'Theocratic': 'Once per turn, this faction can roll an extra d10 when defending against a Cunning attack.',
        'Warlike': 'Once per turn, this faction can roll an additional d10 when making a Force attack.',
        'Mass Market Economists': 'Whenever an asset generates FacCreds or passive income on a planet with the “Billions of Inhabitants” tag, roll a d6. On a 5 or 6, generate one additional Credit.',
        'Unorthodox Pilots': 'When an asset moves itself with an ability it may roll a d6. On a 1-2 nothing happens. On a 3-6 the asset may move an additional hex.',
        'Pacifist Enforcers': 'The first Attack each Turn that takes place on a planet that contains this faction’s Base of Influence against any target must roll 2d10 and take the lowest die as the result.',
        'Martial Primacy': 'This faction may upkeep 3 more Force assets than their stats would normally allow.'
    };
    window.goals = {
        'Military Conquest': 'Destroy a number of Force assets of rival factions equal to your faction’s Force rating. Difficulty is 1/2 number of assets destroyed, rounded up.',
        'Commercial Expansion': 'Destroy a number of Wealth assets of rival factions equal to your faction’s Wealth rating. Difficulty is 1/2 number of assets destroyed, rounded up.',
        'Intelligence Coup': 'Destroy a number of Cunning assets of rival factions equal to your faction’s Cunning rating. Difficulty is 1/2 number of assets destroyed, rounded up.',
        'Planetary Seizure': 'Take control of a planet, becoming the legitimate planetary government. Difficulty equal to half the average of the current ruling faction’s Force, Cunning, and Wealth ratings. If the planet somehow lacks any opposing faction to resist the seizure, it counts as Difficulty 1',
        'Expand Influence': 'Plant a Base of Influence on a new planet. Difficulty 1, +1 if the attempt is contested by a rival faction. Difficulty 2.',
        'Blood the Enemy': 'Inflict a number of hit points of damage on an enemy faction equal to your faction’s total Force, Cunning, and Wealth ratings.',
        'Peaceable Kingdom': 'Launch no attacks on rival factions for four turns. The faction may still defend. Difficulty 1.',
        'Destroy the Foe': 'Destroy a rival faction. Difficulty equal to 1 plus the average of the faction’s Force, Cunning, and Wealth ratings.',
        'Inside Enemy Territory': 'Plant a number of stealthed assets on worlds with other planetary governments equal to your Cunning score. Units that are already stealthed on worlds when this goal is adopted don’t count. Difficulty 2.',
        'Invincible Valor': 'Destroy a Force asset with a minimum purchase rating higher than your faction’s Force rating. Thus, if your Force is 3, you need to destroy a unit that requires Force 4 or higher to purchase. Difficulty 2.',
        'Wealth of Worlds': 'Spend FacCreds equal to four times your faction’s Wealth rating on bribes and influence. This money is effectively lost, but the goal is then considered accomplished. The faction’s Wealth rating must increase before this goal can be selected again. Difficulty 2.'
    };
    window.statuses = {
        'Disabled': 'A Disabled Asset can not Attack, Activate, be Sold (as in the Sell action), be Refit, or Defend. A Disabled Asset remains targetable but loses any passive effects or benefits while disabled, but extra upkeep costs associated with the Asset must still be paid. A Disabled asset can be traded, but the status is unchanged. Any attacks against a Disabled Asset automatically hit.',
        'Protected': 'A Protected Asset can not be targeted by rival Factions, defend, attack, or be activated. Before a Protected Asset can be sold, refit, or traded it must regain at least 1 HP. If traded an Asset looses this state.',
        'Seizing': 'A Faction with the Seizing status is actively seizing the planetary government of a planet. An Asset with the Seizing status can not be moved.',
        'Summoning': 'After being traded or bought Assets are given the \'Summoning Sickness\' status for one full turn. An Asset in \'Trade Stasis\' can not Expand Influence, Attack, Defend, or activate. Assets which provide a passive bonus can still apply that bonus.'
    };
    window.systemObjectsChart = null;
    window.tracker = {};
}

function buildSector(params) {
    return new Promise(resolve => {
        fetchURLs(params.url)
            .then(payload => fetchSheets(payload))
            .then(payload => mapFromSheets(payload, params));
        resolve();
    });
}

window.onload = () => {
    setVariables();
    parseURLParams()
        .then(params => buildSector(params))
        .catch(':(');
};
