# swnmap
A tool for game masters to display their [Stars Without Number](https://www.drivethrurpg.com/product/226996/Stars-Without-Number-Revised-Edition) sector map. 
Stars Without Number is a tabletop roleplaying game authored by Kevin Crawford. Kevin Crawford is the copyright owner for all elements taken from the rule book.

## What it is
![Static](https://i.imgur.com/iTSJ5re.png) | ![Animation](https://media.giphy.com/media/h4HdSpDE6tzOYY8xPY/giphy.gif)
------------------------------------------ | ------------------------------------------------------------------------ 

An interactive interface to visualize your sector, to get it out of the spreadsheet it usually lives in. Features for now include:
* displaying of planet details like Planetary Government, TL, population, atmosphere, temperature, biosphere, planet tags and orbiting objects
* displaying of asset details like custom lore, owner, HP, Cost, TL, Attack and Counter stats, special abilities and its range in case it can move itself or other assets
* displaying of faction details like attributes, HP, income, balance, XP, faction tag and faction goal

[**Here is a live example**](https://swnmap.com/?map=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2Fe%2F2PACX-1vQEsoaT4oSSpbc7S6DZpAHBnLu6Glfc7-arPAhS_kRA_z2lQK5I1U2wIc9y5av2o_A5ZuWh4TTCiawN%2Fpub%3Fgid%3D1077502528%26single%3Dtrue%26output%3Dtsv&cols=8&rows=10). Just mouseover different elements on the map, chances are a popup with more details will appear!


## How to use
1. Look at [this spreadsheet](https://docs.google.com/spreadsheets/d/1SAKnTVEeDAIW6LuhZSDtxsGMzxce-zj4CmaUKilSSB0/edit?usp=sharing). 
It is the backend for what swnmap.com displays. Make a copy of this sheet by clicking _File_ > _Make A Copy_. 

2. In the **SectorSize** tab, specify the dimensions of your sector. How many rows, how many columns. Keep in mind that
indexing starts at 0, so if you have columns 00 through 09, that makes 10 columns. Same for rows.

3. Replace the example factions in the **FactionTracker** tab, their assets in the **AssetTracker** tab, planets in the **PlanetMap** tab and system objects in the **SystemObjects** tab with the ones from your sector. You can add new
rows as needed. Some of the automation within the sheet sometimes doesn't catch new rows. I recommend exploring the sheet to see which
cells depend on which rows and adjust things whenever needed.

4. If that is all set and done, have a look at the **Publishing** tab. Here you need to fill in the publishing links to the 
individual tabs of your sheet. Click on _File_ > _Publish to the web_. A popup dialog appears: 
> ![Publishing](https://i.imgur.com/PI2JPdw.png) 

5. Choose _Publishing_ and _Tab-separated values (.tsv)_ in the two dropdown menus (and don't mind all the tabs that show up
in the first dropdown menu, they include hidden tabs used for housekeeping purposes). This will generate a link to a .tsv 
file containing the information of the specified tab. Copy the link and paste it in the **Publishing** tab next to where it
says _Publishing_ (so in cell B2).

6. Repeat for the other tabs, so **FactionTracker**, **AssetTracker**, **PlanetMap** and **SectorObjects**. Paste their publishing
links in the corresponding cells in the **Publishing** tab.

7. If everything went according to plan, your sector is now available under the URL at the bottom of the **Publishing** tab. Click it and hopefully your sector will render in all its gloryness!


## Troubleshooting


### Missing sheets error
If you see anything like the image below, something went wrong (I know it's not the prettiest of error messages, working on it).

> ![Error](https://i.imgur.com/nB7zaXa.png)

If all four of the essential sheets (**FactionTracker**, **AssetTracker**, **PlanetMap** and **SectorObjects**) are listed
as missing, most likely there's a problem with the URL you pasted after `https://swnmap.com/?map=`. If only some are listed
as missing, then there's a problem with their specific publishing link. 

### Other common issues

* Google Sheets can take up to five minutes to push changes in the sheets to the published .tsv files. Don't be surprised
when changes do not immediately make it into the map.
* sometimes, things will not render immediately — if you're seeing only the background image but no Missing Sheet error, simply try refreshing the page or emptying your cache
* to be continued, but I appreciate bug reports, suggestions and pull requests. 


## Upcoming
- [x] ~~the bare minimum~~
- [ ] a landing page, possibly with a tutorial or at least with a link to this repository
- [ ] search function to highlight individual assets, planets, systems and other game entities
- [ ] dice roller to resolve fights between assets
- [ ] scoring system to measure each faction's standing in the sector
- [ ] politcal map overlay based on that scoring
- [ ] ???
- [ ] complete rework to support own database as backend and sector manipulation through an interface directly from the map

## Credits
Kevin Crawford, [OutrO](https://www.twitch.tv/outro1), [Dgaduin](https://github.com/Dgaduin), 
[NotShteve](https://twitter.com/NotShteve), [LichMaster98](https://github.com/LichMaster98).

## Contact
* Discord: no742617000027#5970
* Twitter: @no742617000027

## Changelog
#### 2020 / 04 / 23
* Custom lore can now be displayed on asset info cards by adding a column titled "Lore" to the **AssetTracker** tab (already included in the template). It will show up on asset info cards like this:

![Lore](https://i.imgur.com/aX8WGiW.png?1)
