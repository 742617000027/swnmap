function log(obj) {
    console.log(obj);
}

function warning(obj) {
    console.log(obj);
}

function getElem(id) {
    return document.getElementById(id);
}

function tsvJSON(tsv) {
    let lines = tsv.split('\n');
    let headers = lines.splice(0, 1)[0].split('\t');
    let result = lines.map(line => {
        let obj = {};
        let currentline = line.split('\t');

        headers.forEach((h, i) => {
            obj[h.replace('\r', '')] = currentline[i].replace('\r', '');
        });
        return obj;
    });
    return result;
}

function textColor(c) {
    let hex = c.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
    return (brightness > 125) ? '#000000' : '#ffffff';
}

function handleErrors(response) {
    if (!response.ok) {
        return ':(';
    }
    return response;
}

function parseURLParams() {
    return new Promise(resolve => {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9C9CpyWM6Xwp-8WXCWZ2SeBXLIQT_Dkeee2xgkwvAvwZMLyE1OxwnHCNw8Sm44ebMj9Ie0oVPACqx/pub?gid=1077502528&single=true&output=tsv';
        resolve({
            'url': decodeURIComponent(url),
            'cols': 19,
            'rows': 19
        });
    });
}

function fixURL(url) {
    return 'https://unrestrictedlorefare.com:8443/' + url;
}

function fetchURLs(url) {
    return fetch(fixURL(url))
        .then(handleErrors)
        .then(val => {
            return val === ':(' ? ':(' : val.text();
        })
        .then(val => {
            return val === ':(' ? ':(' : tsvJSON(val);
        })
        .then(val => {
            if (val === ':(') {
                return ':(';
            } else {
                return new Promise(resolve => {
                    let urls = {};
                    val.forEach(row => {
                        if (['FactionTracker', 'AssetTracker', 'PlanetMap', 'SectorObjects'].includes(row['Tab'])) {
                            urls[row['Tab']] = row['Publishing Link'];
                        }
                    });
                    resolve(urls);
                });
            }
        });
}

function fetchSheets(urls) {
    let PlanetMap = fetch(fixURL(urls['PlanetMap']))
        .then(handleErrors)
        .then(val => {
            return val === ':(' ? ':(' : val.text();
        })
        .then(val => {
            return val === ':(' ? ':(' : tsvJSON(val);
        });
    let SectorObjects = fetch(fixURL(urls['SectorObjects']))
        .then(handleErrors)
        .then(val => {
            return val === ':(' ? ':(' : val.text();
        })
        .then(val => {
            return val === ':(' ? ':(' : tsvJSON(val);
        });
    let FactionTracker = fetch(fixURL(urls['FactionTracker']))
        .then(handleErrors)
        .then(val => {
            return val === ':(' ? ':(' : val.text();
        })
        .then(val => {
            return val === ':(' ? ':(' : tsvJSON(val);
        });
    let AssetTracker = fetch(fixURL(urls['AssetTracker']))
        .then(handleErrors)
        .then(val => {
            return val === ':(' ? ':(' : val.text();
        })
        .then(val => {
            return val === ':(' ? ':(' : tsvJSON(val);
        });
    return Promise.all([PlanetMap, SectorObjects, FactionTracker, AssetTracker]);
}

function mapFromSheets(sheets, params) {

    let sheet_names = ['PlanetMap', 'SectorObjects', 'FactionTracker', 'AssetTracker'];
    let redirect = false;
    let missing = [];
    sheets.forEach((sheet, index) => {
        if (sheet === ':(') {
            redirect = true;
            missing.push(sheet_names[index]);
        }
    });

    if (redirect) {
        landingPage(missing);
    } else {
        buildInterface();
        buildGrid(sheets, params)
            .then(payload => seedFactions(payload, sheets))
            .then(payload => seedSystemsAndPlanets(payload, sheets))
            .then(payload => seedAssets(payload, sheets))
            .then(payload => seedSystemObjects(payload, sheets))
            .then(attachSystemObjects)
            .then(attachPlanetObjects)
            .then(attachBlackHoleObjects)
            .then(arrangePlanets)
            .then(recolorPlanets)
            .then(reorderAssets)
            .then(buildFactionOverview);
    }
}

function landingPage(errors) {
    let missing = document.createElement('span');
    missing.id = 'intro';
    missing.innerText = 'MISSING SHEET:\n' + errors.join(', ');
    document.body.appendChild(missing);
}

function buildInterface() {

    // Viewer
    window.svg = d3.select('#viewer')
        .append('svg')
        .attr('id', 'svg')
        .attr('viewBox', [0, 0, window.innerWidth, window.innerHeight])
        .call(zoom);

    window.g = svg.append('g')
        .attr('id', 'g');

    // Home button
    let homeButton = document.createElement('div');
    homeButton.id = 'home';
    homeButton.classList.add('button');
    homeButton.setAttribute('onclick', 'resetZoom()');
    let homeIcon = document.createElement('img');
    homeIcon.setAttribute('src', 'img/home.png');
    homeIcon.setAttribute('alt', '');
    homeButton.appendChild(homeIcon);
    document.body.appendChild(homeButton);
}

function buildFactionOverview() {
    let factionOverview = document.createElement('div');
    factionOverview.id = 'faction-overview';
    for (let faction in tracker.factions) {
        if (tracker.factions.hasOwnProperty(faction)) {
            let fac = tracker.factions[faction];
            factionOverview.appendChild(factionRow(fac));
        }
    }
    document.body.appendChild(factionOverview);
}

function factionRow(fac) {
    let container = document.createElement('div');
    container.id = fac.short.toLowerCase() + '-container';
    container.classList.add('faction-container');
    let name = document.createElement('div');
    name.id = fac.short.toLowerCase() + '-name';
    name.classList.add('faction-name');
    name.innerHTML = fac.short.toUpperCase();
    name.setAttribute('onmouseenter', `displayFactionInfo("${encodeURIComponent(fac.name)}")`);
    name.setAttribute('onmouseleave', 'hideFactionInfo()');
    let color = document.createElement('div');
    color.id = fac.short.toLowerCase() + '-color';
    color.classList.add('faction-color');
    color.style.backgroundColor = fac.color;
    container.appendChild(name);
    container.appendChild(color);
    return container;
}

function buildGrid(sheets, params) {
    return new Promise(resolve => {
        let num_systems = 0;
        let systems = [];
        sheets[0].forEach(planet => {
            let system = planet['System'];
            if (!systems.includes(system)) {
                systems.push(system);
                num_systems++;
            }
        });
        placeTiles(params.cols, params.rows);
        resolve({'numSystems': num_systems});
    });
}

function parseHex(oddq) {
    return {
        'col': parseInt(oddq.slice(0, 2)),
        'row': parseInt(oddq.slice(2))
    };
}

function placeTiles(cols, rows) {
    let size_w = 0.99 * window.innerWidth / (2 * (cols * 3 + 1) / 4);
    let size_h = 0.99 * window.innerHeight / ((rows + 0.5) * Math.sqrt(3));
    let size = Math.min(size_w, size_h);
    let total_w = 2 * size * (cols * 3 + 1) / 4;
    let total_h = Math.sqrt(3) * size * (rows + 0.5);
    let offset = {
        'x': (window.innerWidth - total_w) / 2,
        'y': (window.innerHeight - total_h) / 2
    };

    tracker['hexes'] = {};
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            row = i.toString().padStart(2, '0');
            col = j.toString().padStart(2, '0');
            tracker.hexes[col + row] = new Hex(col + row, size, offset);
        }
    }
}

function hexVertices(hex_x, hex_y, hex_w, hex_h) {
    A = {'x': hex_x - hex_w / 2, 'y': hex_y};
    B = {'x': hex_x - hex_w / 4, 'y': hex_y - hex_h / 2};
    C = {'x': hex_x + hex_w / 4, 'y': hex_y - hex_h / 2};
    D = {'x': hex_x + hex_w / 2, 'y': hex_y};
    E = {'x': hex_x + hex_w / 4, 'y': hex_y + hex_h / 2};
    F = {'x': hex_x - hex_w / 4, 'y': hex_y + hex_h / 2};
    return `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y} ${F.x},${F.y} ${A.x},${A.y}`;
}

function resetHexColors() {
    for (let hex in tracker.hexes) {
        if (tracker.hexes.hasOwnProperty(hex)) {
            tracker.hexes[hex].color('#222222');
        }
    }
}

function oddqToPixel(oddq, size, offset) {
    let col = parseInt(oddq.slice(0, 2));
    let row = parseInt(oddq.slice(2));
    let x = offset.x + size * 3 / 2 * col;
    let y = offset.y + size * Math.sqrt(3) * (row + 0.5 * (col & 1));
    return {'x': x, 'y': y};
}

function oddqToCube(oddq) {
    let col = parseInt(oddq.slice(0, 2));
    let row = parseInt(oddq.slice(2));
    let x = col;
    let z = row - (col - (col & 1)) / 2;
    let y = -x - z;
    return {'x': x, 'y': y, 'z': z};
}

function seedFactions(payload, sheets) {
    return new Promise(resolve => {
        tracker['factions'] = {};
        sheets[2].forEach(fac => {
            tracker.factions[fac['Faction']] = new Faction(fac);
        });
        resolve(payload);
    });
}

function seedSystemsAndPlanets(payload, sheets) {
    return new Promise(resolve => {
        tracker['systems'] = {};
        tracker['planets'] = {};
        systems = [];
        let sys_cnt = 0;
        let systems_pad_length = payload.numSystems.toString().length;
        let planets_pad_length = sheets[0].length.toString().length;
        sheets[0].forEach((planet, index) => {
            if (!systems.includes(planet['System'])) {
                systems.push(planet['System']);
                tracker.systems[planet['System']] = new System(
                    'system-' + sys_cnt.toString().padStart(systems_pad_length, '0'),
                    {
                        'name': planet['System'],
                        'hex': planet['Hex'],
                        'planets': [planet['Name']]
                    });
                tracker.hexes[planet['Hex']].system = planet['System'];
                sys_cnt++;
            } else {
                tracker.systems[planet['System']].planets.push(planet['Name']);
            }

            tracker.planets[planet['Name']] = new Planet(
                'planet-' + index.toString().padStart(planets_pad_length, '0'),
                planet);
            // arrangePlanets(planet['System']);
        });
        resolve();
    });
}

function seedAssets(payload, sheets) {
    return new Promise(resolve => {
        tracker['assets'] = {};
        let assets_pad_length = sheets[3].length.toString().length;
        let asset_cnt = 0;
        sheets[3].forEach(asset => {
            if (asset['Asset'] !== '') {
                if (assets.hasOwnProperty(asset['Asset']) || asset['Asset'] === 'Base Of Influence') {
                    let id = 'asset-' + asset_cnt.toString().padStart(assets_pad_length, '0');
                    tracker.assets[id] = new Asset(id, asset);
                    tracker.planets[asset['Location'].split(' / ')[2]].localAssets.push(id);
                    tracker.factions[asset['Owner']].assets.push(id);
                    asset_cnt++;
                } else {
                    warning(`Can't find this asset: ${asset['Asset']} — possibly a naming mismatch. If you feel like it
                    please report this bug over at github.com/742617000027/swnmap/.`);
                }
            }
        });
        resolve();
    });
}

function seedSystemObjects(payload, sheets) {
    return new Promise(resolve => {
        tracker['systemObjects'] = {};
        tracker['blackHoles'] = {};
        let blackHoles = 0;
        for (let sys in tracker.systems) {
            if (tracker.systems.hasOwnProperty(sys)) {
                tracker.systemObjects[sys] = {
                    'type': 'System',
                    'children': {}
                };
                tracker.systems[sys].planets.forEach(child => {
                    tracker.systemObjects[sys]['children'][child] = {
                        'type': 'Planet',
                        'children': {}
                    };
                });
            }
        }

        sheets[1].forEach(obj => {
            let root = tracker.systemObjects;
            let components = obj['Name Constructor'].split(' / ');
            let type = obj['Object Type'];
            if (type === 'Black Hole') {
                let id = 'blackhole-' + blackHoles.toString();
                tracker.blackHoles[obj['Name']] = new BlackHole(id, obj);
                if (tracker.hexes[tracker.blackHoles[obj['Name']].hex].system !== '') {
                    let sys = tracker.hexes[tracker.blackHoles[obj['Name']].hex].system;
                    tracker.systems[sys].planets.push(obj['Name']);
                    tracker.systemObjects[sys]['children'][obj['Name']] = {
                        'type': 'Black Hole',
                        'children': {}
                    };
                }
                blackHoles++;
            }
            components.forEach(comp => {
                if (root.hasOwnProperty(comp)) {
                    root = root[comp]['children'];
                } else {
                    if (!tracker.hexes.hasOwnProperty(comp)) {
                        if (tracker.planets.hasOwnProperty(comp)) {
                            root[comp] = {
                                'type': 'Planet',
                                'children': {}
                            };
                        } else if (tracker.blackHoles.hasOwnProperty(comp)) {
                            root[comp] = {
                                'type': 'Black Hole',
                                'children': {}
                            };
                        } else {
                            root[comp] = {
                                'type': type,
                                'children': {}
                            };
                        }
                    }
                }
            });
        });
        resolve();
    });
}

function arrangePlanets() {
    return new Promise(resolve => {
        for (let system in tracker.systems) {
            if (tracker.systems.hasOwnProperty(system)) {
                let num_planets = tracker.systems[system].planets.length;
                if (num_planets > 1) {
                    let hex = tracker.systems[system].hex;
                    let r = tracker.hexes[hex].size * 0.45;
                    let hex_x = tracker.hexes[hex].x;
                    let hex_y = tracker.hexes[hex].y;
                    tracker.systems[system].planets.forEach((planet, index) => {
                        if (tracker.planets.hasOwnProperty(planet)) {
                            let x = r * Math.cos(Math.PI + index * 2 * Math.PI / num_planets);
                            let y = r * Math.sin(Math.PI + index * 2 * Math.PI / num_planets);
                            tracker.planets[planet].position({'x': hex_x - x, 'y': y + hex_y});
                        } else if (tracker.blackHoles.hasOwnProperty(planet)) {
                            let x = r * Math.cos(Math.PI + index * 2 * Math.PI / num_planets);
                            let y = r * Math.sin(Math.PI + index * 2 * Math.PI / num_planets);
                            tracker.blackHoles[planet].position({'x': hex_x - x, 'y': y + hex_y});
                        }
                    });
                }
            }
        }
        resolve();
    });
}

function recolorPlanets() {
    return new Promise(resolve => {
        for (let planet in tracker.planets) {
            if (tracker.planets.hasOwnProperty(planet)) {
                let format = {
                    'color': '#222222',
                    'fontWeight': 'normal'
                };
                if (tracker.planets[planet].pgov !== '') {
                    let fac = tracker.planets[planet].pgov;
                    format['color'] = tracker.factions[fac].color;
                }
                if (tracker.planets[planet].homeworld !== '') {
                    format['fontWeight'] = 'bold';
                }
                tracker.planets[planet].format(format);
            }
        }
        resolve();
    });
}

function recursiveObjects(objName, obj) {
    let res = {
        'text': {
            'name': objName,
            'desc': obj.type
        },
        'children': []
    };
    for (let child in obj.children) {
        if (obj.children.hasOwnProperty(child)) {
            res.children.push(recursiveObjects(child, obj.children[child]));
        }
    }
    return res;
}

function attachSystemObjects() {
    return new Promise(resolve => {
        for (let system in tracker.systems) {
            if (tracker.systems.hasOwnProperty(system)) {
                let objects = recursiveObjects(system, tracker.systemObjects[system]);
                tracker.systems[system].attachObjects(objects);
            }
        }
        resolve();
    });
}

function attachPlanetObjects() {
    return new Promise(resolve => {
        for (let planet in tracker.planets) {
            if (tracker.planets.hasOwnProperty(planet)) {
                let p = tracker.planets[planet];
                let objects = recursiveObjects(p.name, tracker.systemObjects[p.system].children[p.name]);
                p.attachObjects(objects);
            }
        }
        resolve();
    });
}

function attachBlackHoleObjects() {
    return new Promise(resolve => {
        for (let blackhole in tracker.blackHoles) {
            if (tracker.blackHoles.hasOwnProperty(blackhole)) {
                let bh = tracker.blackHoles[blackhole];
                let objects = recursiveObjects(bh.name, tracker.systemObjects[bh.name]);
                bh.attachObjects(objects);
            }
        }
        resolve();
    });
}

function reorderAssets() {
    return new Promise(resolve => {
        for (let planet in tracker.planets) {
            if (tracker.planets.hasOwnProperty(planet)) {
                tracker.planets[planet].localAssets.forEach((id, index) => {
                    let pos = getPosition(
                        {'x': tracker.planets[planet].x, 'y': tracker.planets[planet].y},
                        tracker.assets[id].highlightSize, index
                    );
                    tracker.assets[id].position(pos);
                });
            }
        }
        resolve();
    });
}

function getPosition(pos, size, index) {
    let spiral = getSpiralOffset(index);
    return {
        'x': pos.x + spiral.x * size,
        'y': pos.y + spiral.y * size
    };
}

function getSpiralOffset(i) {
    let x = -0.5;
    let y = -0.5;

    if (i !== 0) {
        let c = cycle(i);
        let s = sector(i);
        let offset = i - first(c) - Math.floor((s * len(c)) / 4);
        if (s === 1) {
            x = -c + offset + 1;
            y = -c;
        } else if (s === 2) {
            x = c;
            y = -c + offset + 1;
        } else if (s === 3) {
            x = c - offset - 1;
            y = c;
        } else {
            x = -c;
            y = c - offset - 1;
        }
        x = -x - 0.5;
        y = -y - 0.5;
    }
    return {'x': x, 'y': y};
}

function sector(i) {
    let c = cycle(i);
    let offset = i - first(c);
    let n = len(c);
    return Math.floor((4 * offset) / n);
}

function len(i) {
    return 8 * i;
}

function cycle(i) {
    return Math.floor((isqrt(i) + 1) / 2);
}

function isqrt(i) {
    if (Math.floor(i) === 0) {
        return 0;
    } else {
        return Math.floor(Math.sqrt(i));
    }
}

function first(i) {
    return (2 * i - 1) * (2 * i - 1);
}

function inRange(origin, range) {
    let in_range = [];
    for (let target in tracker.hexes) {
        if (tracker.hexes.hasOwnProperty(target)) {
            let d = distance(origin, target);
            if (d <= range) {
                in_range.push(target);
            }
        }
    }
    return in_range;
}

function distance(origin, target) {
    let a = oddqToCube(origin);
    let b = oddqToCube(target);
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}

function renderTree(objects) {
    if (objects.children.length > 0) {
        let chart_config = {
            chart: {
                container: '#tooltip-system-objects',
                rootOrientation: 'WEST', // NORTH || EAST || WEST || SOUTH
                levelSeparation: 20,
                siblingSeparation: 5,
                subTeeSeparation: 10,
                nodeAlign: 'BOTTOM',
                scrollbar: 'None',
                connectors: {
                    type: 'step',
                    style: {
                        'arrow-end': 'block-wide-long',
                        'stroke-width': 1,
                        'stroke-linecap': 'round',
                        'stroke-dasharray': '. ',
                        'stroke': '#777'
                    }
                },
                node: {
                    HTMLclass: 'object-node'
                }
            },
            nodeStructure: objects
        };
        systemObjectsChart = new Treant(chart_config);
    } else {
        if (systemObjectsChart) {
            systemObjectsChart.destroy();
        }
    }
}

function hideTooltip(id) {
    getElem('tooltip').style.opacity = '0';
    resetHexColors();
    recolorPlanets();
    tooltipTimeout = setTimeout(() => {
        tipOn = false;
        getElem('tooltip').style.display = 'none';
    }, 200);
    if (id) {
        if (id.includes('asset')) {
            tracker.assets[id].replace();
        }
    }
}

function displaySystemTooltip(id) {
    let system = tracker.systems[id];
    tipOn = true;
    clearTimeout(tooltipTimeout);

    getElem('tooltip').style.display = 'block';
    getElem('tooltip').style.opacity = '1';

    getElem('tooltip-system-info').style.display = 'block';
    getElem('tooltip-planet-info').style.display = 'none';
    getElem('tooltip-asset-info').style.display = 'none';

    getElem('tooltip-header-left').innerHTML = '';
    getElem('tooltip-header-right').style.display = 'inline-block';
    getElem('tooltip-header-right').innerHTML = system.hex;

    getElem('tooltip-name').innerHTML = system.name;

    renderTree(system.orbitalObjects);
}

function displayPlanetTooltip(id) {
    let planet = tracker.planets[id];
    tipOn = true;
    clearTimeout(tooltipTimeout);

    getElem('tooltip').style.display = 'block';
    getElem('tooltip').style.opacity = '1';

    getElem('tooltip-system-info').style.display = 'none';
    getElem('tooltip-planet-info').style.display = 'block';
    getElem('tooltip-asset-info').style.display = 'none';

    getElem('tooltip-header-left').innerHTML = planet.pgov !== '' ? planet.pgov : 'Unclaimed';
    getElem('tooltip-header-right').style.display = 'inline-block';
    getElem('tooltip-header-right').innerHTML = planet.hex + ' / ' + planet.system;

    getElem('tooltip-name').innerHTML = id;
    getElem('tooltip-planet-info-tl').innerHTML = planet.tl;
    getElem('tooltip-planet-info-pop').innerHTML = planet.pop;
    getElem('tooltip-planet-info-atmo').innerHTML = planet.atmo;
    getElem('tooltip-planet-info-temp').innerHTML = planet.temp;
    getElem('tooltip-planet-info-bio').innerHTML = planet.bio;
    getElem('tooltip-planet-info-tags').innerHTML = planet.tags.join(', ');

    renderTree(planet.orbitalObjects);
}

function displayBlackHoleTooltip(id) {
    let bh = tracker.blackHoles[id];
    tipOn = true;
    clearTimeout(tooltipTimeout);

    getElem('tooltip').style.display = 'block';
    getElem('tooltip').style.opacity = '1';

    getElem('tooltip-system-info').style.display = 'none';
    getElem('tooltip-planet-info').style.display = 'none';
    getElem('tooltip-asset-info').style.display = 'none';

    getElem('tooltip-header-left').innerHTML = '';
    getElem('tooltip-header-right').style.display = 'inline-block';
    getElem('tooltip-header-right').innerHTML = bh.hex;

    getElem('tooltip-name').innerHTML = bh.name;

    renderTree(bh.orbitalObjects);
}

function displayAssetTooltip(id) {
    let asset = tracker.assets[id];
    tipOn = true;
    clearTimeout(tooltipTimeout);
    asset.displace();

    getElem('tooltip').style.display = 'block';
    getElem('tooltip').style.opacity = '1';

    getElem('tooltip-system-info').style.display = 'none';
    getElem('tooltip-planet-info').style.display = 'none';
    getElem('tooltip-asset-info').style.display = 'block';

    if (systemObjectsChart) {
        systemObjectsChart.destroy();
    }

    getElem('tooltip-header-left').innerHTML = asset.faction;
    if (!asset.isBoi) {
        getElem('tooltip-header-right').style.display = 'inline-block';
        getElem('tooltip-header-right').innerHTML = asset.type + ', ' + asset.stat + ' ' + asset.tier;
    } else {
        getElem('tooltip-header-right').style.display = 'none';
    }
    getElem('tooltip-name').innerHTML = asset.nameStr;
    getElem('tooltip-asset-info-hp').innerHTML = `${asset.hp}/${asset.maxhp}`;
    getElem('tooltip-asset-info-cost').innerHTML = asset.cost;
    getElem('tooltip-asset-info-tl').innerHTML = asset.tl;
    getElem('tooltip-asset-info-atk').innerHTML = asset.atk;
    getElem('tooltip-asset-info-def').innerHTML = asset.def;
    getElem('tooltip-asset-info-stealth').style.display = asset.stealth ? 'block' : 'none';
    getElem('tooltip-asset-info-merc').style.display = asset.mercenary ? 'block' : 'none';
    if (asset.special !== '') {
        getElem('tooltip-asset-info-special').style.display = 'block';
        getElem('tooltip-asset-info-special-desc').innerHTML = asset.special;
    } else {
        getElem('tooltip-asset-info-special').style.display = 'none';
    }
    if (asset.status !== '') {
        getElem('tooltip-asset-info-status').style.display = 'block';
        getElem('tooltip-asset-info-status-head').innerHTML = asset.status;
        getElem('tooltip-asset-info-status-desc').innerHTML = asset.statusStr;
    } else {
        getElem('tooltip-asset-info-status').style.display = 'none';
    }
    if (asset.lore !== '') {
        getElem('tooltip-asset-info-lore').style.display = 'block';
        getElem('tooltip-asset-info-lore-desc').innerHTML = asset.lore;
    } else {
        getElem('tooltip-asset-info-lore').style.display = 'none';
    }

    getElem('tooltip-asset-info-perm').style.display = asset.perm ? 'block' : 'none';

    if (asset.range > 0) {
        let in_range = inRange(asset.hex, asset.range);
        in_range.forEach(hex => {
            let h = tracker.hexes[hex];
            h.color('#292929');
            if (h.system !== '') {
                tracker.systems[h.system].planets.forEach(planet => {
                    if (tracker.planets.hasOwnProperty(planet)) {
                        let p = tracker.planets[planet];
                        if (p.pgov === '') {
                            p.format({
                                'color': '#292929',
                                'fontColor': '#7c7c7c'
                            });
                        }
                    }
                });
            }
        });
    }
}

function hideFactionInfo() {
    getElem('faction-info').style.opacity = '0';
    factionInfoTimeout = setTimeout(() => {
        getElem('faction-info').style.display = 'none';
    }, 200);
}

function displayFactionInfo(id) {
    let faction = tracker.factions[decodeURIComponent(id)];
    clearTimeout(factionInfoTimeout);
    getElem('faction-info').style.display = 'block';
    getElem('faction-info').style.opacity = '1';

    getElem('faction-info-header-left').innerHTML = faction.name;
    getElem('faction-info-header-right').innerHTML = faction.homeworld;
    getElem('faction-info-stat-force').innerHTML = faction.force;
    getElem('faction-info-stat-cunning').innerHTML = faction.cunning;
    getElem('faction-info-stat-wealth').innerHTML = faction.wealth;
    getElem('faction-info-stat-hp').innerHTML = `${faction.hp}/${faction.maxhp}`;
    getElem('faction-info-stat-income').innerHTML = faction.income;
    getElem('faction-info-stat-balance').innerHTML = faction.balance;
    getElem('faction-info-stat-xp').innerHTML = faction.xp;

    getElem('faction-info-tag-name').innerHTML = faction.tags;
    let factionTagElements = faction.tags.split(",");
    let tagDesc = factionTags[factionTagElements[0].trim()];
    for (var tag of factionTagElements.slice(1)) {
        tagDesc = tagDesc.concat("\n", factionTags[tag.trim()])
    }
    getElem('faction-info-tag-desc').innerHTML = tagDesc;

    if (faction.goal !== '') {
        getElem('faction-info-goal-name').style.display = 'inline-block';
        getElem('faction-info-goal-desc').style.display = 'inline-block';
        getElem('faction-info-goal-name').innerHTML = faction.goal;
        getElem('faction-info-goal-desc').innerHTML = goals[faction.goal];
    } else {
        getElem('faction-info-goal-name').style.display = 'none';
        getElem('faction-info-goal-desc').style.display = 'none';
    }
}
