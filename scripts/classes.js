class Hex {
    constructor(id, size, offset) {
        let pixel = oddqToPixel(id, size, offset);
        this.id = id;
        this.system = '';
        this.size = size;
        this.w = 0.98 * 2 * this.size;
        this.h = 0.98 * Math.sqrt(3) * this.size;
        this.x = pixel.x + this.w / 2;
        this.y = pixel.y + this.h / 2;
        this.vertices = hexVertices(this.x, this.y, this.w, this.h);

        // Render hex
        g
            .append('polyline')
            .attr('id', this.id)
            .attr('class', 'hex')
            .attr('fill', '#222222')
            .attr('points', this.vertices);
        this.hex = getElem(this.id);

        g
            .append('text')
            .text(this.id)
            .attr('id', this.id + '-id')
            .attr('class', 'hex-text')
            .attr('font-family', 'D-DIN')
            .attr('font-size', `${this.h / 8}px`)
            .attr('fill', '#7c7c7c')
            .attr('text-anchor', 'middle')
            .attr('x', this.x)
            .attr('y', this.y + 0.45 * this.h);
        this.text = getElem(this.id + '-id');
    }

    color(c) {
        this.hex.setAttribute('fill', c);
    }

    textColor(c) {
        this.text.setAttribute('fill', c);
    }

    position(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.vertices = hexVertices(this.x, this.y, this.w, this.h);
        this.hex.setAttribute('points', this.vertices);
        this.text.setAttribute('x', this.x);
        this.text.setAttribute('y', this.y + 0.45 * this.h);
    }
}

class System {
    constructor(id, system) {
        this.id = id;
        this.name = system.name;
        this.hex = system.hex;
        this.planets = system.planets;
        this.orbitalObjects = {};
        let h = tracker.hexes[this.hex].h;
        this.x = tracker.hexes[this.hex].x;
        this.y = tracker.hexes[this.hex].y - 0.42 * h;

        // Render system
        g
            .append('text')
            .text(this.name.toUpperCase())
            .attr('id', this.id)
            .attr('class', 'system system-name')
            .attr('fill', '#7c7c7c')
            .attr('font-family', 'D-DIN')
            .attr('font-size', `${h / 18}px`)
            .attr('text-anchor', 'middle')
            .attr('x', this.x)
            .attr('y', this.y)
            .attr('pointer-events', 'none');
        this.text = getElem(this.id);

        let box_width = this.text.getComputedTextLength();
        let padding = box_width * 0.02;
        g
            .append('rect')
            .attr('id', this.id + '-highlight')
            .attr('class', 'system highlight')
            .attr('fill', '#ffffff')
            .attr('opacity', 0)
            .attr('x', this.x - (box_width / 2) - padding)
            .attr('y', this.y - h / 18 + h / 128)
            .attr('width', 2 * padding + box_width)
            .attr('height', h / 18);
        this.highlightBox = getElem(this.id + '-highlight');
        this.highlightBox.setAttribute('onmouseenter', `displaySystemTooltip('${this.name}')`);
        this.highlightBox.setAttribute('onmouseleave', 'hideTooltip("system")');
    }

    attachObjects(objects) {
        this.orbitalObjects = objects;
    }
}

class Planet {
    constructor(id, planet) {
        this.id = id;
        this.name = planet['Name'];
        this.system = planet['System'];
        this.hex = planet['Hex'];
        this.localAssets = [];
        this.homeworld = planet['Homeworld'];
        this.pgov = planet['Planetary Government'];
        this.tl = planet['TL'];
        this.pop = planet['Population'];
        this.atmo = planet['Atmosphere'];
        this.temp = planet['Temperature'];
        this.bio = planet['Biosphere'];
        this.tags = planet['Tags'].split(',');
        this.orbitalObjects = {};
        this.x = this.x = tracker.hexes[this.hex].x;
        this.y = this.y = tracker.hexes[this.hex].y;
        let h = tracker.hexes[this.hex].h;
        this.r = h / 10;

        // Render planet
        g
            .append('circle')
            .attr('id', this.id + '-circle')
            .attr('class', 'planet planet-circle')
            .attr('fill', 'rgba(255, 255, 255, 0)')
            .attr('stroke', '#7c7c7c')
            .style('stroke-width', h / 180)
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r);
        this.circle = getElem(this.id + '-circle');

        g
            .append('svg:text')
            .text(this.name.toUpperCase())
            .attr('id', this.id + '-name')
            .attr('class', 'planet planet-name')
            .attr('fill', '#7c7c7c')
            .attr('font-family', 'D-DIN')
            .attr('font-size', `${this.r / 3}px`)
            .attr('font-weight', 'normal')
            .attr('text-anchor', 'middle')
            .attr('x', this.x)
            .attr('y', this.y + this.r)
            .attr('pointer-events', 'none');
        this.text = getElem(this.id + '-name');

        let padding = this.r / 16;
        let box_width = this.text.getComputedTextLength();
        g
            .insert('rect', '#' + this.id + '-name')
            .attr('id', this.id + '-color')
            .attr('class', 'planet color')
            .attr('fill', '#222222')
            .attr('x', this.x - (box_width / 2) - padding)
            .attr('y', this.y + this.r - this.r / 3 + this.r / 20)
            .attr('width', 2 * padding + box_width)
            .attr('height', this.r / 3)
            .attr('pointer-events', 'none');
        this.colorBox = getElem(this.id + '-color');

        g
            .append('rect')
            .attr('id', this.id + '-highlight')
            .attr('class', 'planet highlight')
            .attr('fill', '#ffffff')
            .attr('opacity', 0)
            .attr('x', this.x - (box_width / 2) - padding)
            .attr('y', this.y + this.r - this.r / 3 + this.r / 22)
            .attr('width', 2 * padding + box_width)
            .attr('height', this.r / 3);
        this.highlightBox = getElem(this.id + '-highlight');
        this.highlightBox.setAttribute('onmouseenter', `displayPlanetTooltip('${this.name}')`);
        this.highlightBox.setAttribute('onmouseleave', 'hideTooltip()');

    }

    position(pos) {
        this.x = pos.x;
        this.y = pos.y;
        let box_width = this.text.getComputedTextLength();
        let padding = this.r / 16;
        this.circle.setAttribute('cx', this.x);
        this.circle.setAttribute('cy', this.y);
        this.text.setAttribute('x', this.x);
        this.text.setAttribute('y', this.y + this.r);
        this.colorBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.colorBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
        this.highlightBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.highlightBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
    }

    format(f) {
        let text_color = f.color !== '#222222' ? textColor(f.color) : '#7c7c7c';
        this.colorBox.setAttribute('fill', f.color);
        this.text.setAttribute('fill', text_color);
        this.text.setAttribute('font-weight', f.fontWeight);
        let box_width = this.text.getComputedTextLength();
        let padding = this.r / 16;
        this.colorBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.colorBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
        this.colorBox.setAttribute('width', 2 * padding + box_width);
        this.highlightBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.highlightBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
        this.highlightBox.setAttribute('width', 2 * padding + box_width);
    }

    attachObjects(objects) {
        this.orbitalObjects = objects;
    }
}

class BlackHole {
    constructor(id, blackhole) {
        this.id = id;
        this.name = blackhole['Name'];
        this.hex = blackhole['Parent Object'].split(' / ')[0];
        this.orbitalObjects = {};
        this.x = this.x = tracker.hexes[this.hex].x;
        this.y = this.y = tracker.hexes[this.hex].y;
        let h = tracker.hexes[this.hex].h;
        this.r = h / 10;

        // Render black hole
        g
            .append('circle')
            .attr('id', this.id + '-circle')
            .attr('class', 'blackhole blackhole-circle')
            .attr('fill', 'rgba(20, 20, 20, 1)')
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r);
        this.circle = getElem(this.id + '-circle');

        g
            .append('svg:text')
            .text(this.name.toUpperCase())
            .attr('id', this.id + '-name')
            .attr('class', 'blackhole blackhole-name')
            .attr('fill', '#7c7c7c')
            .attr('font-family', 'D-DIN')
            .attr('font-size', `${this.r / 3}px`)
            .attr('font-weight', 'normal')
            .attr('text-anchor', 'middle')
            .attr('x', this.x)
            .attr('y', this.y + this.r)
            .attr('pointer-events', 'none');
        this.text = getElem(this.id + '-name');

        let padding = this.r / 16;
        let box_width = this.text.getComputedTextLength();
        g
            .insert('rect', '#' + this.id + '-name')
            .attr('id', this.id + '-color')
            .attr('class', 'blackhole color')
            .attr('fill', '#222222')
            .attr('x', this.x - (box_width / 2) - padding)
            .attr('y', this.y + this.r - this.r / 3 + this.r / 20)
            .attr('width', 2 * padding + box_width)
            .attr('height', this.r / 3)
            .attr('pointer-events', 'none');
        this.colorBox = getElem(this.id + '-color');

        g
            .append('rect')
            .attr('id', this.id + '-highlight')
            .attr('class', 'blackhole highlight')
            .attr('fill', '#ffffff')
            .attr('opacity', 0)
            .attr('x', this.x - (box_width / 2) - padding)
            .attr('y', this.y + this.r - this.r / 3 + this.r / 22)
            .attr('width', 2 * padding + box_width)
            .attr('height', this.r / 3);
        this.highlightBox = getElem(this.id + '-highlight');
        this.highlightBox.setAttribute('onmouseenter', `displayBlackHoleTooltip('${this.name}')`);
        this.highlightBox.setAttribute('onmouseleave', `hideTooltip('${this.id}')`);

    }

    position(pos) {
        this.x = pos.x;
        this.y = pos.y;
        let box_width = this.text.getComputedTextLength();
        let padding = this.r / 16;
        this.circle.setAttribute('cx', this.x);
        this.circle.setAttribute('cy', this.y);
        this.text.setAttribute('x', this.x);
        this.text.setAttribute('y', this.y + this.r);
        this.colorBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.colorBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
        this.highlightBox.setAttribute('x', this.x - (box_width / 2) - padding);
        this.highlightBox.setAttribute('y', this.y + this.r - this.r / 3 + this.r / 22);
    }

    attachObjects(objects) {
        this.orbitalObjects = objects;
    }
}

class Faction {
    constructor(fac) {
        this.name = fac['Faction'];
        this.short = fac['Short'];
        this.color = fac['Color'];
        this.force = fac['F'];
        this.cunning = fac['C'];
        this.wealth = fac['W'];
        this.hp = fac['HP'];
        this.maxhp = fac['Max HP'];
        this.income = fac['Income'];
        this.upkeep = fac['Upkeep'];
        this.balance = fac['Balance'];
        this.tag = fac['Tag'];
        this.goal = fac['Goal'];
        this.xp = fac['EXP'];
        this.relationship = fac['Relationship'];
        this.homeworld = fac['Homeworld'];
        this.assets = [];
    }
}

class Asset {
    constructor(id, asset) {
        this.id = id;
        this.name = asset['Asset'];
        this.isBoi = this.name === 'Base Of Influence';
        this.faction = asset['Owner'];
        this.hp = asset['HP'];
        this.maxhp = asset['Max HP'];
        this.stealth = asset['ʘ'] === 'TRUE';
        this.status = asset['Status'];
        this.statusStr = statuses[this.status];
        this.summoning = this.status === 'Summoning';
        this.mercenary = tracker.factions[this.faction].tag === 'Mercenary Group';
        this.nameStr = this.name;
        if (this.stealth) {
            this.nameStr = `<mark>${this.nameStr}</mark>`;
        }
        this.type = this.isBoi ? '' : asset['Type'];
        this.cost = this.isBoi ? 'Special' : asset['Cost'] !== 'n/a' ? asset['Cost'] : '-';
        this.tl = this.isBoi ? '-' : assets[this.name]['TL'] !== 'n/a' ? assets[this.name]['TL'] : '-';
        this.atk = this.isBoi ? '-' : asset['Attack'].replace('None', '-');
        this.def = this.isBoi ? '-' : asset['Counter'].replace('None', '-');
        this.stat = this.isBoi ? '' : asset['W/C/F'];
        this.tier = this.isBoi ? '-' : assets[this.name]['STAT_TIER'];
        this.perm = this.isBoi ? false : (assets[this.name]['PERM'] !== '' ? true : false);
        this.special = this.isBoi ? '' : assets[this.name]['SPECIAL'];
        this.range = this.isBoi ? 0 : assets[this.name]['RANGE'];
        if (!this.isBoi && this.range === 0 && this.mercenary) {
            this.range = 1;
        }
        this.hex = asset['Location'].split(' / ')[0];
        this.system = asset['Location'].split(' / ')[1];
        this.planet = asset['Location'].split(' / ')[2];
        this.x = tracker.planets[this.planet].x;
        this.y = tracker.planets[this.planet].y;
        this.size = tracker.planets[this.planet].r / 1.1;
        this.highlightSize = this.size * 1.1;

        g
            .insert('g', '#' + tracker.planets[this.planet].id + '-color')
            .attr('id', this.id + '-container')
            .attr('class', 'asset asset-container ' + tracker.factions[this.faction]['short'].toLowerCase())
            .attr('width', this.size)
            .attr('height', this.size);
        this.container = getElem(this.id + '-container');

        d3.select('#' + this.id + '-container')
            .append('rect')
            .attr('id', this.id + '-color')
            .attr('class', 'asset color ' + tracker.factions[this.faction]['short'].toLowerCase())
            .attr('fill', tracker.factions[this.faction]['color'])
            .attr('width', this.size)
            .attr('height', this.size);
        this.shadowBox = getElem(this.id + '-color');

        d3.select('#' + this.id + '-container')
            .append('svg:image')
            .attr('id', this.id + '-icon')
            .attr('class', 'asset asset-alpha ' + tracker.factions[this.faction]['short'].toLowerCase())
            .attr('xlink:href', 'img/assets/' + this.name + '.png')
            .attr('width', this.size)
            .attr('height', this.size);
        this.iconBox = getElem(this.id + '-icon');
        if (this.summoning) {
            this.iconBox.style.opacity = '0.5';
        }

        if (this.stealth) {
            d3.select(this.container)
                .append('svg:image')
                .attr('id', this.id + '-stealth')
                .attr('class', 'asset stealth ' + tracker.factions[this.faction]['short'].toLowerCase())
                .attr('xlink:href', 'img/assets/Stealth.png')
                .attr('width', this.size)
                .attr('height', this.size);
        }
        this.stealthBox = getElem(this.id + '-stealth');

        d3.select('#' + this.id + '-container')
            .append('rect')
            .attr('id', this.id + '-highlight')
            .attr('class', 'asset highlight ' + tracker.factions[this.faction]['short'].toLowerCase())
            .attr('fill', '#ffffff')
            .attr('opacity', '0')
            .attr('width', this.highlightSize)
            .attr('height', this.highlightSize);
        this.highlightBox = getElem(this.id + '-highlight');

        d3.select('#' + this.id + '-container')
            .append('rect')
            .attr('id', this.id + '-hover')
            .attr('class', 'asset hover ' + tracker.factions[this.faction]['short'].toLowerCase())
            .attr('fill', 'rgba(0, 0, 0, 0)')
            .attr('width', this.highlightSize)
            .attr('height', this.highlightSize);
        this.hoverBox = getElem(this.id + '-hover');
        this.hoverBox.setAttribute('onmouseenter', `displayAssetTooltip('${this.id}')`);
        this.hoverBox.setAttribute('onmouseleave', `hideTooltip('${this.id}')`);
    }

    position(pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.container.childNodes.forEach(child => {
            if (child.classList.contains('highlight') || child.classList.contains('hover')) {
                child.setAttribute('x', this.x - 0.5 * this.highlightSize);
                child.setAttribute('y', this.y - 0.5 * this.highlightSize);
            } else {
                child.setAttribute('x', this.x - 0.5 * this.size);
                child.setAttribute('y', this.y - 0.5 * this.size);
            }
        });
    }

    displace() {
        this.container.childNodes.forEach(child => {
            if (child.classList.contains('hover')) {
                child.setAttribute('width', 1.02 * this.highlightSize);
                child.setAttribute('height', 1.02 * this.highlightSize);
                child.setAttribute('x', this.x - 0.5 * this.highlightSize - 0.02 * this.highlightSize);
                child.setAttribute('y', this.y - 0.5 * this.highlightSize - 0.02 * this.highlightSize);
            } else if (child.classList.contains('highlight')) {
                child.setAttribute('opacity', '0.3');
                child.setAttribute('x', this.x - 0.5 * this.highlightSize - 0.02 * this.highlightSize);
                child.setAttribute('y', this.y - 0.5 * this.highlightSize - 0.02 * this.highlightSize);
            } else {
                child.setAttribute('x', this.x - 0.5 * this.size - 0.02 * this.size);
                child.setAttribute('y', this.y - 0.5 * this.size - 0.02 * this.size);
            }
        });
    }

    replace() {
        this.container.childNodes.forEach(child => {
            if (child.classList.contains('hover')) {
                child.setAttribute('width', this.highlightSize);
                child.setAttribute('height', this.highlightSize);
                child.setAttribute('x', this.x - 0.5 * this.highlightSize);
                child.setAttribute('y', this.y - 0.5 * this.highlightSize);
            } else if (child.classList.contains('highlight')) {
                child.setAttribute('opacity', '0');
                child.setAttribute('x', this.x - 0.5 * this.highlightSize);
                child.setAttribute('y', this.y - 0.5 * this.highlightSize);
            } else {
                child.setAttribute('x', this.x - 0.5 * this.size);
                child.setAttribute('y', this.y - 0.5 * this.size);
            }
        });
    }
}