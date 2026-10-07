const MOVE_KEYS={w:[0,-1],a:[-1,0],s:[0,1],d:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(k==='Escape'){stopAuto();if(view){if(s)close();else menu()}else menu();return}if(view||e.repeat)return;stopAuto();if(MOVE_KEYS[k]){e.preventDefault();move(...MOVE_KEYS[k])}else if(k===' '){e.preventDefault();wait()}else if(['1','2','3','4'].includes(k))skill(Number(k)-1);else if(k==='5')racePower('summon');else if(k==='6')racePower('channel');else if(k==='7'||k==='8')classAction(Number(k));else if(k==='q')quickUse('heal');else if(k==='r')quickUse('food');else if(k==='e')interact();else if(k==='c')search();else if(k==='f')ranged();else if(k==='x')autoExplore();else if(k==='i')inventory();else if(k==='n')plotOpenNearby();else if(k==='b')plotJournal();else if(k==='k')expedition();else if(k==='v')chronicle();else if(k==='j')journal();else if(k==='h'||k==='?')help();else if(k==='Tab'){e.preventDefault();cycleTarget()}});
canvas.addEventListener('click',e=>{if(!allowed())return;stopAuto();const r=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*W),y=Math.floor((e.clientY-r.top)/r.height*H);if(!inside(x,y))return;const a=enemyAt(x,y);if(a&&visible(a)){target=a.id;log('瞄準：'+ENEMIES[a.type].name+'。');update()}else if(level().visible[key(x,y)]){const o=objectAt(x,y);if(o&&o.type!=='trap'){toast((OBJECT_LABELS[o.type]||'物品')+'：靠近後按 e 互動。')}else toast(`(${x},${y}) · ${tile(x,y)===1?'牆壁':tile(x,y)===2?'關閉的門':tile(x,y)===4?'熔岩':tile(x,y)===3?'毒池':tile(x,y)===5?'冰面':'地板'}`)}canvas.focus()});all('[data-move]',b=>b.onclick=()=>{stopAuto();move(...b.dataset.move.split(',').map(Number))});bind('inventoryBtn',()=>inventory());bind('plotBtn',plotJournal);bind('expeditionBtn',()=>expedition());bind('chronicleBtn',chronicle);bind('journalBtn',journal);bind('helpBtn',()=>help());bind('saveBtn',()=>save(true));bind('menuBtn',menu);bind('guideHint',guideHint);bind('rangedBtn',ranged);bind('potionBtn',()=>quickUse('heal'));bind('foodBtn',()=>quickUse('food'));bind('searchBtn',search);bind('waitBtn',wait);bind('interactBtn',interact);bind('autoBtn',autoExplore);requestAnimationFrame(render);menu();
// Local, offline localization. Saved game data stays language-independent.
const LANGUAGE_KEY='emberfall-language';
const EN=new Map();function phrase(zh,en){if(zh&&en)EN.set(zh,en)}
function translateRows(db,rows,fields){for(const [id,values]of Object.entries(rows)){if(!db[id])throw Error('Missing localization key: '+id);fields.forEach((field,i)=>phrase(db[id][field],values[i]))}}
translateRows(RACES,{
human:['Human','Quick learner. Gain 20% more experience and recover 8 extra HP on every level-up.','Experience +20%'],elf:['Elf','Arcane affinity. Spell damage +20%, vision +1; poison damage is halved.','Spellpower / vision'],dwarf:['Dwarf','Born in the mines. Armor +2, carrying capacity +10; automatically detect adjacent traps.','Armor / trap detection'],goblin:['Goblin','Master trader. Shop prices -20%, starting gold +30, food effectiveness +25%.','Trading / supplies'],orc:['Orc','Berserker blood. Attack +3; melee damage +30% below 35% health.','Low-health fury'],troll:['Troll','Regeneration. Recover 3 HP every 6 turns while fed, but consume food faster.','Regeneration / appetite'],vampire:['Vampire','Feed on victory. Each kill restores 4 HP and 70 blood satiety. Ordinary food is half as effective. Immune to poison.','Lifesteal / blood hunger'],construct:['Construct','Needs no food and is immune to poison. Repairs 2 HP every 10 turns; healing potions are half as effective.','No hunger / poison immunity']},['name','desc','short']);
translateRows(RACES,{angel:['Angel','Higher being; complex mechanics, not recommended for beginners. HP +10, mana +10, armor +1; half poison damage. Start with a Ring of Sight, 2 Mana Potions and 60 Grace. Kills give 6 Grace. Every 6 turns gain 2 Grace, or lose 4 while wearing cursed equipment. Key 5: 25 Grace and 6 mana summon a Celestial Guardian for 36 turns; it heals you for 4 HP every 6 turns within 2 tiles. Key 6: 18 Grace grant 12 shield and remove harmful effects. Both abilities share an 8-turn cooldown.','Grace / guardian · Advanced'],demon:['Demon','Higher being; complex mechanics, not recommended for beginners. HP +14, mana +6, attack +2; half fire damage. Start with a Ring of Regeneration, 2 Enchantment Scrolls and 60 Souls. Kills give 12 Souls and reduce Backlash by 8. Key 5: 30 Souls and 8 mana summon a Hellhound for 30 turns and add 30 Backlash. Key 6: sacrifice 8 HP for 20 Souls and 6 mana, adding 20 Backlash. Both abilities share an 8-turn cooldown. Backlash falls by 1 each turn; at 70 or more, take 6 true damage every 5 turns.','Souls / backlash / summon · Advanced']},['name','desc','short']);
translateRows(JOBS,{
warden:['Ember Warden','Iron Bulwark','High health and armor. Your class skill grants a shield and temporary damage reduction.'],mage:['Flameweaver','Arcane Torrent','Spell damage +30%. Your class skill damages nearby visible enemies.'],rogue:['Shadowwalker','Shadow Veil','Critical chance 25%; Blink costs half mana. Shadow Veil grants 4 turns of stealth and a critical bonus.'],ranger:['Ranger','Heartpiercer Volley','Ranged damage +4. Your class skill shoots the same target twice.'],cleric:['Cleric','Cleansing Prayer','Your class skill restores health and removes poison, burning, and slow. Stronger altar blessings.'],necro:['Bonecaller','Bone Pact','Summon a skeleton ally for 40 turns. Swap places by walking into an ally. Maximum 2 allies.']},['name','ult','desc']);
BIOMES.forEach((b,i)=>{const en=[['Ember Mines','Miners left chests and secret doors. The fourth-floor Foreman telegraphs heavy strikes.'],['Bone Crypts','Skeletons guard the dark. Archers need line of sight; the Lich summons reinforcements.'],['Fungal Marsh','Poison and spiders drain your supplies. Poison resistance or cleansing potions help.'],['Frost Labyrinth','Ice may slow you. Frost creatures resist cold damage.'],['Obsidian City','Lava and burning are dangerous. Fire creatures resist fireballs.'],['Astral Abyss','Sentinels and sorcerers guard the Ember Heart. The final guardian teleports and summons.']][i];phrase(b.name,en[0]);phrase(b.hint,en[1])});
translateRows(BRANCHES,{
forge:['Dwarven Forge','Recover the Forge Heart: armor +3 and 50% fire resistance.'],archive:['Drowned Archive','Recover the Tidal Grimoire: maximum mana +10 and skill mana costs -1.'],court:['Lost Court','Recover the Lost Crown: attack +4 and maximum health +20.']},['name','desc']);
translateRows(ENEMIES,{
rat:['Cave Hound','Tracks your steps. Lure it into narrow corridors.'],goblin:['Mine Goblin','Opens doors and finds a path around walls.'],bat:['Blood Bat','May move twice every 3 turns. Low health.'],shaman:['Corrupted Shaman','Casts with line of sight; attacks may poison you.'],skeleton:['Skeleton Soldier','A sturdy melee guard.'],archer:['Tomb Archer','Shoots within 5 tiles with line of sight; uses melee up close.'],wraith:['Nameless Wraith','Attacks drain 2 mana. Cannot pass through walls.'],spider:['Venom Spider','Melee hits inflict poison.'],slime:['Splitting Slime','Splits the first time its health falls below half. Use area attacks.'],stalker:['Spore Stalker','Closes in quickly. Avoid being surrounded in open rooms.'],wolf:['Frostfang Wolf','65% cold resistance. Fireballs work well.'],frostmage:['Frost Mage','Ranged attacks inflict slow.'],sentinel:['Rune Sentinel','Has innate armor. Spells bypass its physical armor.'],imp:['Fire Imp','65% fire resistance; inflicts burning.'],golem:['Obsidian Golem','High health and armor, but moves slowly.'],demon:['Rift Demon','Strong melee attacks and high fire resistance.'],sorcerer:['Astral Sorcerer','Casts within 6 tiles. Walls and closed doors break its line of sight.'],mimic:['Chest Mimic','Not everything golden is safe to touch.'],foreman:['Ironhammer Foreman','Locks onto your position and strikes a 3×3 area on its next turn.'],lich:['Bone Lich','Heavy strikes and skeleton summons. Enrages at low health.'],queen:['Spore Queen','Heavy strikes inflict poison. Summons spiders.'],colossus:['Frost Colossus','Heavy strikes inflict slow. Resists cold damage.'],infernal:['Infernal Tyrant','Heavy strikes inflict burning. Summons imps.'],abyss:['Abyss Weaver','Teleports, summons, enrages, and telegraphs heavy strikes. Guards the Ember Heart.'],smith:['Runaway Furnace','Forge guardian. Defeat it to recover the Forge Heart.'],librarian:['Drowned Librarian','Guards the Tidal Grimoire and summons wraiths.'],king:['Crownless King','Court guardian. Defeat it to recover the Lost Crown.'],dummy:['Training Dummy','A patient practice partner. Does not move.']},['name','desc']);
translateRows(ITEMS,{
heal:['Healing Potion','Restores 38 + level × 2 HP.'],mana:['Mana Potion','Restores 24 mana.'],antidote:['Cleansing Potion','Removes poison, burning, and slow.'],might:['Potion of Might','Melee damage +35% for 12 turns.'],poison:['Poison Potion','Poisons you when drunk. Identify it first.'],food:['Travel Rations','Restores 420 satiety.'],identify:['Scroll of Identification','Identifies one item and reveals its type and curse.'],mapping:['Scroll of Mapping','Reveals this floor’s terrain, not unseen enemies.'],teleport:['Scroll of Teleportation','Teleports you to a random safe tile on this floor.'],enchant:['Scroll of Enchantment','Improves your equipped weapon by +2 attack.'],uncurse:['Scroll of Unbinding','Choose one piece of equipment to uncurse. Canceling keeps the scroll.'],fear:['Scroll of Dread','Stops visible enemies for 4 turns.'],wandFire:['Wand of Fire','Fire burst within 6 tiles. Uses 1 charge.'],wandFrost:['Wand of Frost','Damages and freezes a target within 6 tiles.'],wandHeal:['Wand of Repair','Restores 28 HP. Uses 1 charge.'],sword:['Embersteel Sword','A balanced melee weapon.'],axe:['Stonecleaver Axe','Higher attack, heavier weight.'],dagger:['Shadow Dagger','Light weapon. Critical chance +10%.'],staff:['Runic Staff','Spell damage +20% while equipped.'],leather:['Hunter’s Leather','Lightweight armor.'],plate:['Runic Plate','Higher armor, heavier weight.'],ringGuard:['Ring of Protection','Armor +2.'],ringSight:['Ring of Sight','Vision +2.'],ringRegen:['Ring of Regeneration','Restores 3 HP every 8 turns while fed.'],ringSatiety:['Ring of Satiety','Halves satiety consumption.']},['name','desc']);
translateRows(Object.fromEntries(RELICS.map(r=>[r.id,r])),{
fang:['Hunter’s Fang','Base attack +2.'],heart:['Undying Spark','Maximum HP +12; restores 30 HP.'],well:['Arcane Well','Maximum mana +6; fully restores mana.'],stone:['Basalt Shard','Base armor +1.'],kit:['Traveller’s Pack','Rations ×2 and Healing Potions ×2.'],spark:['Ember Charm','Permanent spell damage +10%.'],soul:['Soul Vessel','Each kill restores 2 extra mana.'],feather:['Wind Feather','Permanent critical chance +5%; carrying capacity +3.']},['name','desc']);
const EN_LESSONS=[
['01 · The World Waits','Successfully move 3 tiles.','Every valid action takes one turn. When you stop, enemies stop too.','Use w/a/s/d or the arrow keys. Take three steps near your starting point.'],
['02 · Walls Are Not Fatal','Walk into a wall once.','Bumping a wall takes no turn. Opening a closed door does.','A stone pillar is northeast of the start at (10,10). Stand next to it and try to walk into it.'],
['03 · Interact and Loot','Approach the golden chest and press e.','Interact with objects on your tile or an adjacent tile. Loot enters your inventory.','The chest is at (11,12). Approach it and press e or the Interact button.'],
['04 · Equip to Get Stronger','Open inventory with i and equip the Training Sword.','A weapon in your bag grants no bonus. Equip it to improve your attack.','Press i, find the Training Sword, choose Equip, and return to the game.'],
['05 · Melee and Health','Walk toward the Training Dummy and defeat it.','Walking into an enemy makes a melee attack. Enemies act after your turn.','The dummy is at (15,12). Attack, then heal if needed. Training has no permanent death.'],
['06 · Aim and Cast','Use 1, Ember Burst, on the second dummy.','Skills cost mana and have cooldowns. Click an enemy to target it; otherwise, the nearest visible enemy is chosen.','The second dummy is at (18,12). Get within 6 tiles with line of sight, click it, then press 1.'],
['07 · Supplies Cost Turns','Press q to drink a Healing Potion.','Drinking takes a turn, so enemies can act. Do not wait until you have 1 HP.','Your health has been reduced. Press q or the Healing Potion button on the left.'],
['08 · More Than a Health Bar','Press r to eat a ration.','Satiety decreases each turn. Hunger stops regeneration; an empty meter causes damage.','Your training character is Human and needs food. Press r. Constructs do not eat in a real run.'],
['09 · Search for Traps','Approach (12,17), then press c to reveal the trap.','Hidden traps trigger when stepped on. Searching has a 3-tile radius and costs one turn.','Get within 3 tiles of the marked trap and press c. Hidden traps are not marked in a real run.'],
['10 · Identify the Unknown','Use an Identification Scroll on the unknown ring in your bag.','Appearances change each run. Identification reveals types and curses; cursed equipment binds to you.','Press i → Use the Identification Scroll → choose Identify on the unknown ring.'],
['11 · Curses Are Real','Equip the identified cursed ring, then use an Unbinding Scroll.','Cursed equipment cannot be replaced or removed. Use an Unbinding Scroll first.','Equip the ring marked Cursed in your inventory, use the Unbinding Scroll, then select that ring to uncurse.'],
['12 · Altar Blessings','Approach the altar, press e, and choose a blessing.','Altars restore health or bless equipment. Each altar can be used only once.','The altar is at (19,18). Walk over, press e, and choose a blessing.'],
['13 · Ready for the Depths','Approach the purple stairs and press e to graduate.','The real world has 24 main floors, three branches, and six regional guardians. Floors persist, and you can go back upstairs.','The stairs are at (25,19). After graduating, choose your race and class to begin a real run.']];
LESSONS.forEach((l,i)=>['title','goal','why','hint'].forEach((field,j)=>phrase(l[field],EN_LESSONS[i][j])));
const EN_CONTROLS=[['n / b','Talk to a nearby story character / interwoven story journal'],['k','Expedition command: allies, specializations, environment and friend challenges'],['5 / 6','Angels and Demons: racial summon / racial ability'],['7 / 8','Alchemist: brew potions; Spiritbinder: elemental attunement / resonant healing'],['v','Race chronicle and objectives'],['w/a/s/d or arrow keys','Move one tile; bump enemies to attack and closed doors to open them.'],['e','Interact on your tile or next to it: chests, merchants, stairs, and altars.'],['Click an enemy / tab','Select a target; tab cycles through visible enemies.'],['1 / 2 / 3','Ember Burst / Frost Nova / Blink.'],['4','Your class skill.'],['f','Ranged shot. Costs 2 mana; Rangers deal more damage.'],['q / r','Use a known Healing Potion / eat rations.'],['space','Wait one turn and recover 2 extra mana.'],['c','Search within 3 tiles for traps and secret doors.'],['x','Auto-explore; stops for enemies, damage, objects, or danger.'],['i / j / h','Inventory / Journal / Field Codex.'],['esc','Close a window or open the menu.']];
CONTROL_ROWS.forEach((row,i)=>row.forEach((text,j)=>phrase(text,EN_CONTROLS[i][j])));
const EN_SYSTEMS=[
['Turns','Moving, opening doors, attacking, casting, searching, equipping, and drinking cost one turn. Invalid actions and opening inventory are free. Trading is free.'],
['Health and Armor','Physical damage is reduced by armor, to a minimum of 1. Spell damage uses half your armor. Shields absorb damage first. Potions, merchants, altars, and level-ups restore health.'],
['Mana and Cooldowns','Recover mana naturally every 3 turns; Flameweavers recover more. Waiting restores 2 extra mana. Entering a new floor restores some mana once; revisiting does not.'],
['Hunger','Satiety decreases each turn. Below 250 you are hungry; at 0, you take damage every 4 turns. Trolls and overburdened characters consume more. Constructs need no food.'],
['Carrying Weight','Items have weight. Being overburdened increases food consumption. Your bag holds 36 stacks. Sell, drop, or use items to make room. Dwarves carry 10 extra weight.'],
['Unknown Items','Potion, scroll, ring, and wand appearances are shuffled each run. Identify to reveal names and curses. Using or equipping teaches you the type; each equipment curse must be checked individually.'],
['Curses and Enchantment','Cursed equipment cannot be removed or replaced. Unbinding Scrolls and altars remove curses. Enchantment Scrolls add +2 attack to your current weapon; merchants can add +1 for gold.'],
['Terrain','Doors block sight until opened. Poison pools may poison you; ice may slow you; lava burns each turn. Auto-explore avoids known lava and revealed traps.'],
['Status Effects','Poison and burning damage you each turn. Slow may give enemies an extra action every 3 turns. Cleansing Potions and Clerics remove these three effects.'],
['Enemy Awareness','Enemies spot you by line of sight and pursue your last known position. Alarms alert the whole floor. Enemies never walk through walls; some open doors. Ranged attacks need line of sight.'],
['Summoned Allies','Bonecallers summon up to 2 skeletons for 40 turns. They attack automatically. Walk into one to swap places. They follow between floors if there is room at the entrance.'],
['Boss Telegraphs','The red 3×3 area erupts on the guardian’s next action. Blink 3 tiles to escape; freezing delays the strike. Guardians enrage at low health, and some summon enemies.'],
['Persistent Floors','Changing floors does not respawn monsters or reset chests and shops. Floor state is saved. You may skip ordinary enemies, but guardian floors have sealed exits.'],
['Saves and Death','Auto-save occurs every turn. Classic mode ends on death; Explorer mode grants 3 rescues. Export JSON to move a run to another device. Training has a separate auto-save.']];
SYSTEM_ROWS.forEach((row,i)=>row.forEach((text,j)=>phrase(text,EN_SYSTEMS[i][j])));
translateRows(Object.fromEntries(QUESTS.map(q=>[q.id,q])),{
hunter:['Hunter’s Contract','Defeat 12 enemies in total.','60 gold + Cleansing Potion'],seeker:['Treasure Seeker','Open 8 chests.','Identification Scrolls ×2 + Mapping Scroll'],devotion:['Altar Pilgrim','Use 5 altars.','Maximum HP +15'],scholar:['Identification Scholar','Identify 6 items.','Maximum mana +8']},['name','desc','reward']);
const EN_ACHIEVEMENTS=['First Spark','Abyss Hunter','Guardian Slayer','Into the Frost','Master Identifier','Trap Researcher','Forge Heart','Tidal Grimoire','Lost Crown','Artifact Collector','Rekindled Ember','One-Life Legend'];ACHIEVEMENTS.forEach((a,i)=>phrase(a.name,EN_ACHIEVEMENTS[i]));
const UI_EN=`
深淵之書|The Book of the Abyss
小心名稱超重|Warning: the name exceeds carrying capacity
穿越 24 層地下城與 7 層支線，尋回餘燼之心。選擇種族與職業，探索遺跡，決定你的族人將迎來怎樣的未來。|Explore 24 main floors and 7 branch floors to reclaim the Ember Heart. Choose your race and class, uncover ruins, and shape your people’s future.
學會活下來|Learn to Survive
13 關互動訓練。實際操作後才通過；訓練不會永久死亡。|13 hands-on lessons. Complete the actions to advance. Training has no permanent death.
每一局都不同|Every Run Is Different
固定種子可重現開局。職業、種族、未知物品與支線神器改變玩法。|Seeds reproduce your opening world. Races, classes, unknown items, and branch artifacts change how you play.
深度比樓層更重要|Depth Beyond Floor Numbers
持久樓層、雙向階梯、商店庫存、異常狀態、召喚盟友與守衛機制。|Persistent floors, two-way stairs, lasting shop stock, status effects, summoned allies, and guardian mechanics.
回合制 · 自動存檔 · 可匯出備份|Turn-based · Auto-save · Exportable backups
教學與正式冒險分開存檔。開始新冒險會取代正式自動存檔，請先匯出要保留的角色。|Training and real runs save separately. A new run replaces your real-run auto-save. Export any character you want to keep first.
建立冒險者|Create Adventurer
互動教學 · 建議先玩|Interactive Training · Start Here
繼續正式存檔|Continue Adventure
繼續教學進度|Continue Training
回到目前遊戲|Resume Current Game
冒險百科|Field Codex
匯入存檔|Import Save
搬移舊版角色|Migrate Original Character
60 種合法組合|60 Valid Combinations
你想用什麼方式活下來？|How Will You Survive?
種族 · 決定體質與生存方式|Race · Your Body and Survival Traits
職業 · 決定戰鬥與專屬技能|Class · Your Combat Style and Unique Skill
基礎攻擊|Base Attack
推薦初次遊玩：人類守燼者。想召喚軍團：喚骨者。想把午餐從怪物身上拿回來：吸血鬼。|First run? Try a Human Ember Warden. Want a skeleton army? Choose Bonecaller. Want to get lunch back from the monsters? Try Vampire.
冒險規則|Adventure Rules
探險模式 · 3 次救援|Explorer · 3 Rescues
經典模式 · 永久死亡|Classic · Permanent Death
世界種子|World Seed
留空隨機；例如 Andrew|Leave blank for random; try Andrew
同種子、同種族與職業、同樣操作可重現世界。敵人和道具仍受你的回合選擇影響。|The same seed, race, class, and actions reproduce the world. Your turn choices still affect enemies and items.
點燃餘燼燈|Light the Ember Lantern
先進訓練場|Train First
返回選單|Back to Menu
正式自動存檔會保留，可以從選單繼續。|Your real-run auto-save will remain available from the menu.
這會取代正式自動存檔。要保留目前角色，可先匯出 JSON。|This replaces your real-run auto-save. Export JSON first if you want to keep your current character.
先匯出目前角色|Export Current Character First
全新冒險|a New Adventure
互動教學|Interactive Training
返回遊戲|Return to Game
冒險背包|Inventory
道具也是你的技能樹|Items Are Part of Your Skill Tree
未知外觀可鑑定。裝備 / 使用 / 丟棄各消耗一回合；打開背包不消耗回合。詛咒裝備先淨咒才可卸下。|Identify unknown appearances. Equipping, using, or dropping costs a turn; opening inventory is free. Remove curses before taking off bound equipment.
超重：飽食消耗增加|Overburdened: increased food consumption
重量正常|Normal Carrying Weight
這個分類沒有物品。|No items in this category.
永久遺物 / 支線神器|Permanent Relics / Branch Artifacts
尚無遺物|No relics yet
匯出存檔 JSON|Export Save JSON
冒險日誌|Adventure Journal
活下來也要有計畫|Survival Needs a Plan
主線：穿越六個區域，擊敗第 24 層守衛，取回餘燼之心。支線可選；神器會提供永久加成。已生成樓層|Main quest: cross six regions, defeat the floor-24 guardian, and recover the Ember Heart. Branches are optional; artifacts grant permanent bonuses. Generated floors:
正式世界|Full World
委託 · 完成後在此領取獎勵|Contracts · Claim Rewards Here
已領取|Claimed
領取獎勵|Claim Reward
世界路線|World Routes
尚未擊敗|Not Defeated Yet
尚未完成|Not Completed Yet
已擊敗|Defeated
已取得神器|Artifact Recovered
入口：主線第|Entrance: main floor
層的 ✧ 傳送門|, through the ✧ portal
探索過的樓層|Explored Floors
跨局成就|Across-Run Achievements
經典永久死亡|Classic: Permanent Death
探險救援|Explorer: Rescues
尚餘救援|Rescues Remaining:
查看教學課表|View Training Lessons
隨時可查，不需要背整本|Look It Up; No Memorization Required
鍵盤與觸控|Keyboard and Touch
操作|Controls
效果|Effect
教學課表|Training Lessons
種族 / 職業|Races / Classes
深層規則|Deep Rules
怪物圖鑑|Bestiary
道具圖鑑|Item Codex
進入互動教學|Enter Interactive Training
返回目前遊戲|Return to Current Game
三條可選支線|Three Optional Branches
主線第|Main Floor
種族：生存方式與抗性|Races: Survival Traits and Resistances
職業：戰鬥與專屬技能|Classes: Combat and Unique Skills
體質修正|Stat Modifiers
特性|Traits
基礎 HP|Base HP
推薦組合：精靈織焰師（高法傷）、矮人守燼者（坦克）、吸血鬼喚骨者（擊殺補血）、哥布林巡林者（補給與遠程）。共 60 種合法搭配；人類可選全部職業。|Suggested builds: Elf Flameweaver (spell damage), Dwarf Ember Warden (tank), Vampire Bonecaller (healing on kills), and Goblin Ranger (supplies and range). 60 valid combinations; Humans may choose every class.
訓練用人類守燼者，避免種族特性跳過基礎課。每一步都有目標、理由、提示與地圖標記；完成後自動進下一課。|Training uses a Human Ember Warden so racial traits do not skip the basics. Each lesson includes a goal, reason, hint, and map marker. Complete it to advance automatically.
普通層可以直接下樓，但探索能取得升級與補給。每四層守衛封鎖出口；支線最深層守衛會掉落神器。擊敗第 24 層守衛後，在餘燼之心選擇終局；擊敗該路線的殘響守衛後，再互動確認結局。|You can descend through ordinary floors immediately, but exploration earns upgrades and supplies. Guardians seal every fourth floor. Branch guardians drop artifacts. Defeat the final guardian on floor 24, then interact with the Ember Heart to win.
搜尋怪物名稱、戰術或抗性|Search monsters, tactics, or resistances
沒有符合的怪物。|No matching monsters.
普通怪物隨深度提升。|Ordinary enemies scale with depth.
火焰抗性|Fire Resistance
寒冰抗性|Cold Resistance
火抗 65%|Fire Resistance 65%
寒冰抗性 65%|Cold Resistance 65%
碰撞與路徑|Collision and Pathfinding
隔牆引怪、關門切視線。預期：怪物繞路，沒有視線的弓手不射穿牆。|Lure enemies around a wall and close doors to break sight. Expected: enemies take a route around walls; archers never shoot through blocked sight.
回合與無效操作|Turns and Invalid Actions
撞牆、沒魔力放技能、空背包按喝藥。預期：回合數不變。|Bump a wall, cast without mana, and try drinking with no potion. Expected: the turn counter does not change.
狀態與生命周期|State and Lifecycle
召喚骸骨、上下樓、死亡後移動。預期：盟友按規則跟隨，死人不能行動。|Summon skeletons, change floors, then try moving after death. Expected: allies follow correctly; dead characters cannot act.
資料一致性|Data Consistency
裝備詛咒戒指，存檔重載。預期：加成、綁定、樓層物件與背包一致。|Equip a cursed ring, save, and reload. Expected: bonuses, binding, floor objects, and inventory remain consistent.
可重現實驗|Reproducible Experiments
固定種子與角色，用同樣操作比較。預期：地圖與遊戲隨機結果一致。|Fix the seed and character, then repeat the same actions. Expected: maps and random gameplay outcomes match.
例：主線第 5 層，我站在關閉的門後，弓手仍造成傷害。請檢查視線判斷是否把關門視為遮擋，只修改遠程攻擊相關邏輯，並測試開門 / 關門兩個情境。|Example: On main floor 5, an archer damages me through a closed door. Check whether line of sight treats closed doors as obstacles. Modify only ranged-attack logic and test both open and closed doors.
你已取得不白給資格|Certified to Stop Giving Monsters Free Kills
13 關教學完成！|All 13 Training Lessons Complete!
你已實際完成移動、碰撞、開箱、裝備、近戰、瞄準施法、補血、進食、搜尋、鑑定、解除詛咒、聖壇祈禱和階梯互動。|You practiced movement, collision, looting, equipment, melee, targeting, spells, healing, food, searching, identification, curse removal, altar blessings, and stairs.
下一步：選擇種族與職業。建議第一局使用探險模式；活下來後再挑戰經典永久死亡。|Next: choose a race and class. Start with Explorer mode, then try Classic permanent death when you are ready.
建立正式角色|Create Your Real Character
看看訓練場|View Training Grounds
回選單|Back to Menu
餘燼重燃 · 深淵之書完結|Ember Rekindled · The Book Complete
餘燼燈熄滅了|Your Ember Lantern Went Out
你走過六個區域，擊敗深淵編織者，帶回餘燼之心。故事沒有奪走你的名字。|You crossed six regions, defeated the Abyss Weaver, and recovered the Ember Heart. The story did not take your name.
下一趟記住：藥水不是傳家寶，金幣也不是防彈衣。|Next time: potions are not heirlooms, and gold is not body armor.
最後原因|Final Cause
最深|Deepest Floor:
隻敵人|enemies
位守衛|guardians
永久遺物|Permanent Relics
再開一局|New Run
冒險紀錄|Adventure Record
匯出存檔|Export Save
查看地圖|View Map
任務|Goal
具體操作|What to Do
我來試試|Let Me Try
查完整手冊|Open Full Codex
查規則|Rules
詳細提示|Detailed Hint
冒險提示|Adventure Tip
互動教學完成|Training Complete
在選單建立你的正式角色。|Create your real character in the menu.
你中毒了：用淨化藥水或聖諭者技能解除。|Poisoned: use a Cleansing Potion or your Cleric skill.
生命偏低：先補血，再繼續探索。|Low health: heal before exploring further.
你飢餓了：按 r 進食。|Hungry: press r to eat.
背包超重：出售或丟棄物品可降低消耗。|Overburdened: sell or drop items to reduce food consumption.
守衛正在預告重擊！離開紅色範圍，或用冰霜延後它。|Heavy strike incoming! Leave the red area or freeze the guardian to delay it.
本層出口有封印：擊敗守衛，取得遺物。|The exit is sealed. Defeat the guardian and collect its relic.
按 c 搜尋暗門；點敵人瞄準；下樓前補給。|Press c for secret doors, click enemies to aim, and resupply before descending.
已帶回餘燼之心|Ember Heart Recovered
冒險結束 · 新的一局等著你|Run Ended · A New Adventure Awaits
擊敗本層守衛|Defeat This Floor’s Guardian
取得餘燼之心|Recover the Ember Heart
尋找下行階梯|Find the Down Stairs
取得神器，返回主線|Collect the Artifact and Return
繼續深入支線|Explore the Branch Further
本層敵人|Enemies on This Floor
樓層保留；上樓可以回訪。|Floors persist; take the stairs back to revisit.
點選可見敵人瞄準；tab 切換目標。|Click a visible enemy to aim; tab cycles targets.
點選可見敵人瞄準。|Click a visible enemy to aim.
視線通暢|Clear Line of Sight
視線受阻|Blocked Line of Sight
上行階梯|Up Stairs
下行階梯|Down Stairs
餘燼之心|Ember Heart
支線傳送門|Branch Portal
返回主線出口|Return to Main Dungeon
入口營火|Entrance Campfire
守衛遺物|Guardian Relic
地上物品|Ground Item
教學出口|Training Exit
完成實作才能過關 · 訓練不會永久死亡|Practice to Advance · Training Has No Permanent Death
隨機世界 · 永久死亡 · 戰術探索|Random World · Permanent Death · Tactical Exploration
深淵之書 · THE BOOK OF THE ABYSS|THE BOOK OF THE ABYSS
你思考時，世界也會等待。|The world waits while you think.
無效操作不扣回合；打開背包不扣回合。|Invalid actions and opening inventory take no turn.
遠程射擊|Ranged Shot
喝生命藥水|Drink Healing Potion
搜尋陷阱 / 暗門|Search Traps / Secrets
餘燼爆破|Ember Burst
冰霜新星|Frost Nova
閃步|Blink
探索目標|Objective
回合制地下城。使用 WASD 或方向鍵移動。|Turn-based dungeon. Move with WASD or arrow keys.
存檔無法讀取|Unable to Load Save
存檔版本或世界資料不正確|Invalid save version or world data
冒險備份|Adventure Backup
選擇 Emberfall JSON 存檔。匯入後會取代同類型的自動存檔（教學 / 正式）；若要保留目前角色，先匯出。|Choose an Emberfall JSON save. Import replaces the matching auto-save (training or adventure). Export your current character first if you want to keep it.
先匯出目前冒險|Export Current Adventure First
搬移第一版角色|Migrate Your Original Character
保留職業、等級、生命、攻擊、護甲、金幣與藥水。新版本增加種族與世界系統，會將角色設為人類並重新生成對應深度的地圖。|Keep your class, level, HP, attack, armor, gold, and potions. The new race and world systems make your character Human and regenerate the map at the corresponding depth.
搬移並取代新版正式存檔|Migrate and Replace Adventure Save
舊版角色已搬移；世界依新版規則重新生成。|Original character migrated; the world was rebuilt under the new rules.
舊版角色已搬移，地圖按新版規則重建。|Original character migrated; maps now follow the new rules.
舊版角色已搬移。|Original character migrated.
冒險已存檔。|Adventure Saved.
瀏覽器不允許儲存；請從背包匯出 JSON。|Browser storage is unavailable. Export JSON from inventory.
已匯出目前冒險。|Current Adventure Exported.
找不到存檔|No Save Found
無法匯入|Import Failed
搬移失敗|Migration Failed
存檔超過 8 MB|Save Exceeds 8 MB
無效的第一版存檔|Invalid Original Save
舊角色數值無效|Invalid Original Character Stats
舊角色生命或魔力無效|Invalid Original HP or Mana
訓練與正式世界混合|Training and Adventure Worlds Are Mixed
角色位置無效|Invalid Character Position
角色數值無效|Invalid Character Stats
生命、魔力或等級無效|Invalid HP, Mana, or Level
面向無效|Invalid Facing Direction
異常與技能狀態無效|Invalid Status Effects or Cooldowns
背包無效|Invalid Inventory
裝備與背包不一致|Equipment and Inventory Do Not Match
遺物無效|Invalid Relics
鑑定資料無效|Invalid Identification Data
任務資料無效|Invalid Quest Data
日誌無效|Invalid Journal
進度無效|Invalid Progress
教學狀態無效|Invalid Training Progress
樓層識別無效|Invalid Floor Identifier
樓層屬性無效|Invalid Floor Properties
地圖無效|Invalid Map
樓梯位置無效|Invalid Stair Positions
房間無效|Invalid Rooms
敵人無效|Invalid Enemies
盟友無效|Invalid Allies
物件無效|Invalid Objects
角色站在牆內|Character Is Inside a Wall
旅行武器|Traveller’s Weapon
旅行斗篷|Traveller’s Cloak
訓練長劍|Training Sword
餘燼學院 · 安全訓練場|Ember Academy · Safe Training Grounds
返回主線|Return to Main Dungeon
未裝備|Unequipped
詛咒綁定|Curse-Bound
已裝備|Equipped
尚未鑑定；可用鑑定卷軸確認。|Unidentified; use an Identification Scroll to check.
未知物品|Unknown Item
全部|All
武器|Weapon
護甲|Armor
戒指|Ring
藥水|Potions
卷軸|Scrolls
魔杖|Wands
食物|Food
卸下|Unequip
裝備|Equip
使用|Use
丟棄|Drop
未知|Unknown
詛咒|Cursed
綁定|Bound
背包|Inventory
日誌|Journal
手冊|Codex
存檔|Save
選單|Menu
探險者|Adventurer
目標情報|Target Info
最近事件|Recent Events
探索|Explore
提示|Hint
目標|Target
英雄|Hero
生命|HP
魔力|Mana
血飽|Blood Satiety
飽食|Satiety
經驗|Experience
負重|Weight
重量|Weight
攻擊|Attack
護盾|Shield
金幣|Gold
金|g
額外回魔|Extra Mana
等待|Wait
進食|Eat
近戰|Melee
中毒|Poisoned
燃燒|Burning
遲緩|Slowed
巨力|Might
隱匿|Stealth
壁壘|Bulwark
飢餓|Hungry
基礎價格|Base Price
主線|Main Dungeon
可選支線|Optional Branch
支線|Branch
回合|Turns
獎勵|Reward
模式|Mode
神器|Artifacts
救援|Rescues
聖壇|Altar
泉水|Fountain
寶箱|Chest
商人|Merchant
敵人|Enemies
你|You
牆壁|Wall
關閉的門|Closed Door
熔岩|Lava
毒池|Poison Pool
冰面|Ice
地板|Floor
迷霧|Fog
門|Door
附近|Nearby
位置|Position
距離|Range
瞄準|Target
冷卻|Cooldown
火抗|Fire Resist
冰抗|Cold Resist
目前|Current
完成|Completed
特性|Traits
開始|Start
取消|Cancel
返回|Back
暫時離開|Leave for Now
暫時|For Now
稍後再選|Choose Later
離開商店|Leave Shop
離開|Leave
尚未取得|None Yet
層|Floor
課|Lesson
格|Tiles
瓶|Bottles
份|Units
次|Times
隻|Units
生命藥水|Healing Potion
物品|Items
`;UI_EN.trim().split('\n').forEach(line=>{const i=line.indexOf('|');phrase(line.slice(0,i),line.slice(i+1))});
const LOG_EN=`
視野|Vision

種族篇章|Race Chronicle
種族篇章資料無效|Invalid Race Chronicle Data
種族與職業不相容|Incompatible Race and Class
種族限制|Race Restriction
可選擇|Choice Available
可選職業|Available Classes
原因|Reason
篇章尚未完成|Chronicle Unfinished
族裔結局|Lineage Ending
生命上限|Max HP
魔力上限|Max Mana
基礎攻擊|Base Attack
基礎護甲|Base Armor
負重上限|Carrying Capacity
法術加成|Spell Bonus
種族資源|Racial Resource
擊殺回血|Healing on Kills
商店折扣|Shop Discount
每八回合恢復生命|Healing Every Eight Turns
額外毒傷減免|Extra Poison Damage Reduction
低血再生|Low-Health Regeneration
食物效果加成|Food Bonus
護衛治療加成|Guardian Healing Bonus
種族召喚攻擊加成|Racial Summon Attack Bonus
每回合額外降低反噬|Extra Backlash Reduction Per Turn
寶箱|Chests
搜尋次數|Search Actions
擊敗敵人|Enemies Defeated
移動步數|Movement Steps
擊敗守衛|Guardians Defeated
最深樓層|Deepest Floor

天使與惡魔是高位生命，機制複雜，新手不推薦。5 召喚，6 使用種族能力；每次有效操作消耗一回合。全部召喚共用兩名盟友上限，盟友會跟隨上下樓；走向盟友可交換位置。資源上限 100，冷卻、召喚壽命與反噬隨回合推進，打開介面不會推進。|Angels and Demons are higher beings with complex mechanics, not recommended for beginners. Press 5 to summon and 6 for your racial ability. Each valid action costs a turn. All summons share a two-ally limit. Allies follow between floors; walk into them to swap places. Resources cap at 100. Cooldowns, summon lifetimes and Backlash advance with turns, not menus.
高位生命 · 機制複雜，新手不推薦。種族召喚與職業召喚共用兩名盟友上限。|Higher being · Advanced, not recommended for beginners. Racial and class summons share a two-ally limit.
機制複雜，新手不推薦|Complex mechanics; not recommended for beginners
種族能力尚在冷卻。|Racial abilities are on cooldown.
種族資源或魔力不足。|Not enough racial resource or mana.
種族資源不足。|Not enough racial resource.
盟友上限為兩名，與職業召喚共用。|Maximum two allies, shared with class summons.
血祭需要保留至少 1 生命。|Blood Sacrifice must leave at least 1 HP.
天界護衛受召而來。|A Celestial Guardian answers your call.
深淵獵犬受召而來。|A Hellhound answers your call.
聖佑清除異常並賜予護盾。|Divine Aegis removes harmful effects and grants a shield.
血祭交換了生命、靈魂與魔力。|Blood Sacrifice trades health for souls and mana.
天界護衛揮出武器。|Your Celestial Guardian strikes.
深淵獵犬撲向敵人。|Your Hellhound lunges at the enemy.
召喚天界護衛|Summon Guardian
召喚深淵獵犬|Summon Hellhound
契約反噬|Pact Backlash
高位生命資源無效|Invalid higher-being resources
恩典|Grace
靈魂|Souls
反噬|Backlash
聖佑|Divine Aegis
血祭|Blood Sacrifice
盟友|Allies

解除詛咒|Remove Curse
選一件裝備淨咒|Choose Equipment to Uncurse
確認後消耗一張淨咒卷軸與一回合。取消不會消耗卷軸。|Confirming consumes one Unbinding Scroll and one turn. Canceling keeps the scroll.
沒有可淨咒的裝備，保留卷軸。|No cursed equipment. Keep the scroll.
目標或卷軸已變更，請重新選擇。|The target or scroll has changed. Please choose again.
詛咒已解除：|Curse removed:
淨咒|Uncurse

骸骨盟友|Skeleton Allies
完成第|Lesson
可開始正式冒險|Ready for a Real Adventure
層有入口|has an Entrance
移動 · e 互動 · c 搜尋 · x 自動探索|Move · e Interact · c Search · x Auto-explore
建議先玩獨立互動教學。正式冒險先找商人補給，再清理安全走廊；遇到遠程敵人，用牆切視線。藥水喝太晚，通常就不用再喝了。|Start with interactive training. In a real run, buy supplies and clear safe corridors. Use walls against ranged enemies. If you drink a potion too late, you probably will not need it anymore.
歡迎來到餘燼學院。完成 13 個實作任務，學會自己活下來。|Welcome to Ember Academy. Complete 13 hands-on tasks and learn to survive.
你帶著一盞餘燼燈，踏入第一層礦坑。|With an ember lantern in hand, you enter the first mine floor.
矮人的礦坑直覺發現了陷阱。|Your dwarven instincts reveal a nearby trap.
守衛倒下，出口封印解除。它留下了一份遺物。|The guardian falls. The exit is unsealed, and a relic remains.
你的種族免疫中毒。|Your race is immune to poison.
前方是石牆。|A stone wall blocks your way.
你打開了門。|You open the door.
尖刺陷阱|Spike Trap
毒針陷阱|Poison Dart Trap
警報響起！本層敵人被驚動。|An alarm rings! Enemies across the floor are alerted.
黏液分裂了！|The slime splits!
重擊預告：離開紅色 3×3 區域！|Heavy strike telegraph: leave the red 3×3 area!
深淵編織者扭曲了空間。|The Abyss Weaver twists space.
骸骨盟友揮出武器。|Your skeleton ally strikes.
遲緩使敵人多行動了一次。|Slow gives enemies an extra action.
技能尚在冷卻。|That skill is on cooldown.
魔力不足。等待可額外恢復 2 魔力。|Not enough mana. Waiting restores 2 extra mana.
範圍內没有可見目標。|No visible target in range.
範圍內沒有可見目標。|No visible target in range.
前方無法閃步。|You cannot Blink in that direction.
閃步！|Blink!
最多可有兩隻骸骨盟友。|You can have at most two skeleton allies.
周圍沒有召喚空間。|No adjacent space for summoning.
骸骨盟友受召而來，持續 40 回合。|A skeleton answers your call for 40 turns.
鋼鐵壁壘：護盾與 4 回合減傷。|Iron Bulwark: a shield and 4 turns of damage reduction.
秘法洪流席捲可見敵人。|Arcane Torrent sweeps through visible enemies.
影遁：4 回合隱匿，下一擊暴擊率大幅提高。|Shadow Veil: 4 turns of stealth and a greatly increased critical chance on your next hit.
穿心連射！|Heartpiercer Volley!
祈禱恢復生命並清除異常。|Your prayer restores health and clears harmful effects.
射程內沒有可見敵人。|No visible enemy within shooting range.
魔力不足。|Not enough mana.
你等待並凝聚魔力。|You wait and gather mana.
你開始飢餓。找口糧，或按 r 進食。|You are getting hungry. Find rations or press r to eat.
發現隱藏的門！|You discover a secret door!
仔細搜尋，沒有發現新的機關。|You search carefully but find no new mechanisms.
自動探索：遇敵、受傷或發現物件會停止。按任意遊戲鍵停止。|Auto-explore stops for enemies, damage, or objects. Press a game key to stop it.
自動探索已停止|Auto-explore stopped
自動探索已停止。|Auto-explore stopped.
自動探索已停：敵人或生存風險。|Auto-explore stopped: enemy or survival risk.
附近有可互動物件。按 e。|An interactive object is nearby. Press e.
沒有可安全自動探索的路線；試試搜尋暗門。|No safe auto-explore route. Try searching for secret doors.
魔杖的充能耗盡了。|The wand is out of charges.
生命已滿，不浪費補給。|Health is full. Save your supplies.
魔像不需要進食，可以把口糧賣給商人。|Constructs need no food. Sell rations to a merchant instead.
你已經很飽，先把口糧留下。|You are already full. Keep your rations.
魔杖範圍內沒有可見目標。|No visible target within wand range.
卷軸展開，地形浮現。敵人的位置仍需親眼確認。|The scroll reveals the terrain. Enemy positions still need to be seen firsthand.
空間折疊，你被傳送了。|Space folds, and you teleport.
目前武器攻擊 +2。|Current weapon attack +2.
已裝備物品的詛咒被解除。|Curses on your equipped items are removed.
可見敵人暫時無法行動。|Visible enemies are temporarily unable to act.
目前裝備被詛咒綁定！先使用淨咒卷軸。|Your equipment is curse-bound! Use an Unbinding Scroll first.
先卸下這件裝備。|Unequip this item first.
所有物品都已完整鑑定，保留卷軸。|Everything is fully identified. Keep the scroll.
選一件物品鑑定|Choose an Item to Identify
知識就是生存|Knowledge Is Survival
確認後消耗一張鑑定卷軸與一回合，揭露真名和詛咒。|Confirming consumes one Identification Scroll and one turn to reveal its name and curse.
返回背包|Back to Inventory
附近沒有可互動物件。|Nothing nearby to interact with.
先完成目前的移動任務，寶箱會在第三課使用。|Finish your movement tasks first. The chest is used in lesson 3.
聖壇會在第十二課使用，先完成目前的任務。|The altar is used in lesson 12. Finish your current task first.
背包太滿，先整理再開箱。|Your bag is too full. Make room before opening the chest.
寶箱裡還有一些金幣。|The chest also contains some gold.
入口營火恢復生命與魔力；餘燼只能使用一次。|The entrance campfire restores HP and mana. Its ember can be used only once.
先完成目前的課程。紫色標記不是逃課出口。|Finish your current lesson. The purple marker is not a shortcut out of class.
出口被守衛的封印鎖住。先擊敗本層守衛。|The guardian’s seal locks the exit. Defeat this floor’s guardian first.
你取回了餘燼之心，深淵不再掌握你的名字。|You reclaim the Ember Heart. The abyss no longer owns your name.
餘燼聖壇|Ember Altar
一次性的祝福|A One-Time Blessing
選擇一項祝福。每座聖壇只能使用一次，祈禱消耗一回合。|Choose a blessing. Each altar can be used once; praying costs a turn.
生命祝福|Healing Blessing
淨咒祝福|Unbinding Blessing
智慧祝福|Wisdom Blessing
解除全部已裝備物品的詛咒，恢復 12 魔力。|Remove all equipped-item curses and restore 12 mana.
聖壇回應了你的祈禱。|The altar answers your prayer.
不是每口水都安全|Not Every Sip Is Safe
地下泉水|Underground Fountain
水中有微弱的魔力。喝下可能恢復生命、恢復魔力，也可能中毒。每口泉水只能喝一次。|The water holds faint magic. A drink may restore health or mana, or poison you. Each fountain can be used once.
喝下泉水|Drink from Fountain
清涼泉水恢復 28 生命。|Cool spring water restores 28 HP.
泉水恢復全部魔力。|The fountain fully restores your mana.
水裡有毒！|The water is poisoned!
守衛的遺產|The Guardian’s Legacy
選擇一件永久遺物|Choose a Permanent Relic
效果可疊加。選擇後消耗一回合。|Effects stack. Choosing costs one turn.
你已持有這個支線神器。|You already have this branch artifact.
流浪商人的補給站|Wandering Merchant’s Supply Camp
$ 是商人，不是寶箱|$ Is a Merchant, Not a Chest
商人物品已鑑定，無詛咒。交易不消耗回合；商店庫存會保留。|Shop items are identified and uncursed. Trading is free; stock persists.
購買|Buy
營火休息 · 35 金（回滿生命）|Campfire Rest · 35 Gold (Full HP)
武器強化 +1 · 40 金|Weapon Upgrade +1 · 40 Gold
出售背包物品（每次整組）|Sell Inventory Items (Whole Stack)
商人：錢不夠。勇氣不能刷卡。|Merchant: Not enough gold. Courage is not a credit card.
需要 35 金幣。|You need 35 gold.
需要 40 金幣。|You need 40 gold.
生命已滿。|Health is full.
在商人的營火旁休息。|You rest by the merchant’s campfire.
先裝備武器。|Equip a weapon first.
武器攻擊 +1。|Weapon attack +1.
先整理背包，預留獎勵空間。|Make room in your bag for the reward first.
背包格數已滿！先丟棄或出售物品。|Your bag has no empty slots! Drop or sell items first.
不需要進食|Needs No Food
不需要食物|Needs No Food
沒有可見敌人|No Visible Enemies
目前沒有可見敵人。|No enemies are currently visible.
靠近後按 e 互動。|Approach it and press e to interact.
字母：敵人|Letters: Enemies
訓練長劍|Training Sword
紅褐色藥水|Russet Potion
天藍色藥水|Sky-Blue Potion
乳白色藥水|Milky Potion
紫色藥水|Violet Potion
墨綠色藥水|Dark-Green Potion
刻著 KIR 的卷軸|Scroll Inscribed KIR
刻著 VERA 的卷軸|Scroll Inscribed VERA
刻著 ZEL 的卷軸|Scroll Inscribed ZEL
刻著 NORA 的卷軸|Scroll Inscribed NORA
刻著 FEN 的卷軸|Scroll Inscribed FEN
刻著 ALU 的卷軸|Scroll Inscribed ALU
銅色戒指|Copper Ring
骨白戒指|Bone-White Ring
翡翠戒指|Jade Ring
黑曜戒指|Obsidian Ring
彎曲的魔杖|Crooked Wand
水晶魔杖|Crystal Wand
白木魔杖|Whitewood Wand
每一步都有代價|Every Action Has a Cost
餘燼行者|Ember Traveller
向前|Forward
已售完|Sold Out
無詛咒|Uncursed
系統|System
規則|Rules
種族|Race
職業|Class
種起手組合|Starting Combinations
冒險|Adventure
教學|Training
鑑定結果|Identification Result
鑑定|Identify
成就解鎖|Achievement Unlocked
升級|Level Up
等級提升|Level Up
完成訓練|Training Complete
完成委託|Contract Completed
獲得永久遺物|Permanent Relic Acquired
獲得經驗與金幣。|earned experience and gold.
尋回支線神器！|Branch Artifact Recovered!
支線完成|Branch Completed
搜尋發現|Search Found
處陷阱或暗門。|traps or secret doors.
冰霜新星凍結|Frost Nova Froze
個目標。|targets.
剩餘|Remaining
剩|Remaining:
救援護符救了你。剩餘|A rescue charm saved you. Remaining:
救援護符重燃！剩|Your rescue charm rekindles! Remaining:
次救援，回到本層入口。|rescues. Returned to this floor’s entrance.
首次抵達|First Visit:
層，恢復部分魔力。|; some mana restored.
層。這裡仍保留上次的痕跡。|. Everything remains as you left it.
詛咒把它綁住了！|The curse binds it to you!
你卸下了|You unequip
放下了|Dropped
出售了|Sold
的遠程攻擊|’s ranged attack
的重擊落下！|’s heavy strike lands!
的重擊|’s heavy strike
召喚了援軍。| summons reinforcements.
狂暴了！| enrages!
升至|Reached Level
級！生命、魔力與攻擊提升。|! Health, mana, and attack increase.
受到| takes
傷害|damage
火焰|fire
寒冰|cold
暴擊|Critical Hit
獲得|Received
恢復|Restore
回滿生命|Full Health
回滿魔力|Full Mana
已匯出|Exported
沒有已知的|No known
獲得 12 護盾。|and gain 12 shield.
經驗，回滿魔力。|experience and fully restore mana.
充能|Charges
尚無|None
守衛|Guardian
火|Fire
冰|Cold
抗|Resist
按|Press
靠近|Approach
互動|Interact
下樓|Descend
上樓|Ascend
備份|Backup
補給|Supplies
位置|Position
深淵|Abyss
擊敗|Defeated
格|tiles
`;LOG_EN.trim().split('\n').forEach(line=>{const i=line.indexOf('|');phrase(line.slice(0,i),line.slice(i+1))});
let LANGUAGE_CHOICE='auto';try{LANGUAGE_CHOICE=localStorage.getItem(LANGUAGE_KEY)||'auto'}catch{}
if(!['auto','zh','en'].includes(LANGUAGE_CHOICE))LANGUAGE_CHOICE='auto';
function recommendedLanguage(languages){for(const l of languages||[]){const code=String(l).toLowerCase();if(code==='zh'||code.startsWith('zh-'))return'zh';if(code==='en'||code.startsWith('en-'))return'en'}return'en'}
let LANGUAGE=LANGUAGE_CHOICE==='auto'?recommendedLanguage(navigator.languages?.length?navigator.languages:[navigator.language]):LANGUAGE_CHOICE;
for(const [zh,en]of [["人類沒有血統限制，可以學習所有職業。","Humans have no bloodline restrictions and may learn every class."],["精靈的生命誓約不容許骸骨契約，因此不能選喚骨者。","The elven life oath forbids bone pacts, excluding Bonecallers."],["矮人使用鍛造與神諭傳承，不採用織焰或喚骨契約。","Dwarves follow forge and divine traditions, excluding Flameweavers and Bonecallers."],["哥布林的交易契約與聖諭誓言衝突，因此不能選聖諭者。","Goblin trade pacts conflict with clerical vows, excluding Clerics."],["獸人的戰團傳承不教授織焰與聖諭術。","Orc warbands do not teach flameweaving or clerical rites."],["巨魔的再生會干擾精密秘法、射術與聖諭儀式。","Troll regeneration disrupts precise arcana, archery and clerical rituals."],["吸血鬼的血契無法承受聖諭者的聖光誓約。","Vampiric blood pacts cannot sustain a Cleric's sacred-light oath."],["魔像沒有可簽訂聖諭或骸骨契約的靈魂。","Constructs lack the soul required for clerical vows or bone pacts."],["天使的天界誓約禁止影遁與喚骨契約，不能選夜行者或喚骨者。","Celestial vows forbid Shadowwalkers and Bonecallers."],["惡魔的深淵契約與聖諭者的聖光誓言互斥。","Abyssal pacts are incompatible with clerical vows."],["未寫完的族譜","The Unfinished Lineage"],["你的家鄉被深淵抹去，倖存者各持一頁族譜。你沒有天定的職業，也沒有必須服從的祖靈；你要決定記憶是用來團結眾人，還是建立自己的王國。","The abyss erased your home. Survivors carry scattered pages of its lineage. No bloodline chooses your class or commands your loyalty; memory can unite people or build your own kingdom."],["散落的姓名","Scattered Names"],["營火旁的難民認出你的族徽，請你將族譜交回。他們承諾互助；一名仲介則願意買下族譜，讓你獨自繼續深入。","Refugees recognize your crest and request the lineage pages. They offer mutual aid; a broker offers gold for the same pages."],["歸還族譜","Return the lineage"],["你保留姓名，放棄仲介的報酬。","You preserve names and refuse the broker."],["接受仲介交易","Accept the broker"],["你取得旅費，但族人不再免費幫助你。","You gain travel money but lose free assistance."],["誰能進營地","Who Enters the Camp"],["倖存者要求趕走一位異族醫師；他卻救過族人的孩子。你先前的承諾讓這次決定更難：營地要延續血統，還是接納願意同行的人？","Survivors want to expel a healer of another race who saved their child. Your earlier promise now matters: preserve bloodlines or welcome companions?"],["接納醫師","Welcome the healer"],["營地成為共同家園，戰利品分給病人。","The camp welcomes outsiders and shares spoils."],["建立守備團","Establish a guard"],["營地有了武裝，醫師則帶著不滿離開。","The camp gains guards; the healer leaves resentful."],["故鄉的鑰匙","The Key to Home"],["一扇通往舊家鄉的門需要餘燼供能。你可以將力量留給所有倖存者，也可以把門改為軍隊的據點；先前接納或排除的人都會記住。","An ember-powered gate leads home. Leave its power to the survivors or turn it into a military outpost; everyone you welcomed or excluded will remember."],["把鑰匙交給眾人","Give everyone the key"],["你放棄專有權，讓故鄉重新有人生活。","You surrender ownership and restore a living home."],["掌握城門","Command the gate"],["故鄉成為你的堡壘，但不再對所有人開門。","Home becomes your fortress, closed to some."],["共同家園的守望者","Keeper of a Shared Home"],["城門與王冠","The Gate and the Crown"],["被焚毀的根系","The Burned Roots"],["精靈母樹的記憶流入地下毒池。長老命你恢復生命循環，但被放逐的研究者認為舊誓約正是災難的原因。你必須在傳承與革新之間選擇。","Memories of the elven mother-tree seep into underground poison pools. Elders demand restoration; an exiled researcher blames the old oath. Choose tradition or change."],["最後一枚種子","The Last Seed"],["長老留下最後一枚種子；研究者想將它拆解成抗毒配方。保住一棵樹與救下眼前的人，並不是同一件事。","The last seed could grow a tree or become an antidote. Saving the forest and saving people today are different choices."],["守護種子","Guard the seed"],["種子仍在生長，但研究者失去樣本。","The seed survives; research loses its sample."],["分享樣本","Share the sample"],["種子無法萌芽，配方卻救下中毒者。","The seed cannot sprout, but antidotes save lives."],["流亡者的筆記","The Exile’s Notes"],["筆記證明母樹吸收了族人的恐懼。你可以公開真相，或保住長老的威信；上一章的選擇將決定人們如何理解這份證據。","Notes show the tree absorbed the clan’s fears. Reveal the truth or preserve the elders’ authority; your earlier choice frames the evidence."],["公開真相","Reveal the truth"],["長老失去權威，研究者加入你的旅程。","The elders lose authority; the researcher helps."],["修復誓約","Repair the oath"],["長老承諾改革，但真相被封存。","The elders promise reform but seal the truth."],["新的森林","A New Forest"],["深淵有一片能讓植物生長的土地。你可以讓它成為所有生命的森林，或只恢復精靈的聖地；兩條路都不會讓已逝者回來。","A fertile patch lies in the abyss. Open a forest to all life or restore an elven sanctuary. Neither path brings back the dead."],["向所有生命開放","Open it to all life"],["森林不再只屬於精靈，你與它共享力量。","The forest belongs to all life and shares its strength."],["重建聖地","Rebuild the sanctuary"],["你守住族人的記憶，也承擔孤立的代價。","You preserve memory at the cost of isolation."],["無牆的森林","The Forest Without Walls"],["最後的聖地","The Last Sanctuary"],["熔爐裡的債","Debts in the Furnace"],["氏族把祖先的名字刻在熔爐上，而礦工的名字被省略。深淵中的失控鍛造坑正呼喚你，要求你決定真正值得被記住的是王冠還是雙手。","Clan rulers are named on the furnace; miners are not. A runaway forge asks whose work deserves remembrance: crowns or hands."],["沒有名字的工具","Nameless Tools"],["你找到礦工留下的工具與一箱被扣的工資。把金幣帶回去會拖慢冒險；拿去強化武器則能更快擊敗守衛。","You find tools and withheld wages. Returning the gold supports miners; reforging your weapon helps defeat the guardian."],["補發礦工工資","Pay the miners"],["礦工為你補強護具，你付出自己的旅費。","Miners reinforce your armor; you pay travel funds."],["投入戰爐","Feed the war forge"],["工具變成武器，工資仍未歸還。","Tools become weapons; the wages remain unpaid."],["祖先的失誤","The Ancestors’ Error"],["熔爐失控源於祖先偷走了地下泉脈。你可以公開責任，或用更強的符文掩蓋裂縫。","The furnace failed after ancestors stole a spring. Admit the debt or hide the cracks with stronger runes."],["向泉脈償還","Repay the spring"],["你犧牲部分鍛造產量，換回穩定。","You reduce forge output to restore stability."],["封住裂縫","Seal the cracks"],["符文變強，礦工必須承擔下一次崩塌。","Runes strengthen; miners bear the next collapse."],["誰擁有熔爐","Who Owns the Forge"],["最後的熔爐核心接受你的印記。交給工匠議會能分散權力，留下它則能製造一支只聽你命令的軍團。","The core accepts your mark. A craft council can share its power; keeping it enables an army under your command."],["建立工匠議會","Form a craft council"],["熔爐為所有工匠工作，價格更公平。","The forge serves all artisans with fairer prices."],["鍛造王印","Forge a royal seal"],["氏族有了新的王，也有新的債。","The clan gains a new ruler and new debts."],["萬手之爐","The Furnace of Many Hands"],["鐵冠繼承人","Heir to the Iron Crown"],["不能出售的名字","The Unsellable Name"],["你的商團把名字當作抵押品，欠債者會被深淵抹去。帳本落入你手中，現在每一筆便宜交易都藏著一個人的代價。","Your caravan mortgages names; debtors vanish into the abyss. You hold the ledger, and every bargain hides someone’s cost."],["帳本的第一頁","The First Ledger Page"],["一名搬運工的名字即將到期。撕掉契約能救他，但商團會提高你的價格；替商團追債則能取得佣金。","A porter’s name expires soon. Tear up the debt and face higher prices, or collect it for a commission."],["撕毀欠條","Tear up the debt"],["搬運工獲得自由，你被加上風險溢價。","The porter is free; you pay a risk premium."],["收取佣金","Collect commission"],["商團給你黃金，搬運工失去姓名。","The caravan pays you; the porter loses his name."],["真正的合夥人","A Real Partner"],["一位商人願意用失蹤者的名單交換股份。你可以公開帳目，也可以買下整個商團，把壓迫變成自己的資產。","A merchant trades missing names for shares. Publish the books or buy the caravan and make oppression your asset."],["公開帳目","Publish the books"],["交易變慢，倖存者開始信任你。","Trade slows, but survivors begin to trust you."],["取得控制權","Buy control"],["你獲得折扣，同時背上維持商團的成本。","You gain discounts and inherit operating costs."],["最後的拍賣","The Final Auction"],["深淵拍賣你的真名。你可以燒毀拍賣台，也可以競標它，把所有名字變成你能保管的財產。","The abyss auctions your true name. Burn the auction house or buy it, taking ownership of every name."],["燒掉拍賣契約","Burn the contracts"],["沒有人再被當作抵押品，你放棄壟斷。","Names cease to be collateral; you refuse a monopoly."],["買下拍賣台","Buy the auction house"],["你的名字安全了，其他人必須向你求情。","Your name is safe; others must petition you."],["自由商路","The Free Trade Road"],["姓名交易所","The Exchange of Names"],["戰旗以外的人","People Beyond the Banner"],["戰團只歌頌勝利，卻把飢餓者與傷兵留在旗後。你被派來證明力量，也逐漸發現力量可以保護人，或迫使人服從。","The warband sings of victory and abandons its wounded. You must prove strength and decide whether it protects or commands."],["被留下的傷兵","The Abandoned Soldier"],["傷兵拖慢隊伍，戰團要你取回他的徽章。你可以帶他同行，也可以照命令將徽章帶走。","A wounded soldier slows the march. Bring him along or obey orders and return only his badge."],["帶回傷兵","Bring back the soldier"],["他教你如何在低血量時保持清醒。","He teaches you to remain steady while wounded."],["服從戰團","Obey the warband"],["戰團獎賞你的果斷，傷兵被留在黑暗裡。","The warband rewards resolve and leaves him behind."],["敵人的求援","An Enemy’s Plea"],["敵方斥候說深淵正在吞噬兩邊的孩子。你可以暫時停戰，也可以趁混亂奪回祖先的兵器。","An enemy scout says the abyss consumes children on both sides. Call a truce or seize ancestral weapons."],["共同撤離","Evacuate together"],["戰團懷疑你的忠誠，居民卻活了下來。","The warband questions loyalty; civilians survive."],["奪回祖器","Recover the ancestral weapon"],["你拿到武器，也讓仇恨延續。","You gain the weapon and extend the feud."],["戰旗的主人","Who Owns the Banner"],["最後一場決鬥能讓你成為酋長。你可以把戰旗變成庇護標誌，也可以讓勝利成為唯一的法律。","A final duel can make you chief. Turn the banner into sanctuary or make victory the only law."],["立下庇護誓約","Swear sanctuary"],["弱者第一次能站在旗前。","The vulnerable can finally stand before the banner."],["以力量統治","Rule by strength"],["戰團向你跪下，也期待下一場戰爭。","The warband kneels and expects another war."],["庇護戰旗","The Banner of Sanctuary"],["永戰酋長","Chief of Endless War"],["再生留下的傷","Scars Regeneration Keeps"],["你的肉體會癒合，記憶卻不會。氏族靠偷來的口糧生存，人類獵人把這稱作怪物的天性；你得找到能讓雙方活下去的路。","Flesh heals; memory does not. Your clan steals rations and hunters call it monstrous instinct. Find a way for both sides to live."],["飢餓的幼崽","Hungry Young"],["幼崽守著一袋偷來的口糧。交回食物能取得停戰機會，留下它能讓氏族撐過今晚。","Young trolls guard stolen rations. Return them for a truce or feed the clan tonight."],["分享剩餘口糧","Share your own supplies"],["你用旅費補足食物，獵人暫時放下弓。","You pay for food; hunters lower their bows."],["保護族人","Protect the clan"],["幼崽吃飽了，追捕卻不會停止。","The young are fed, but the hunt continues."],["獵人的傷口","The Hunter’s Wound"],["追捕你的獵人被毒池困住。救他可能換來對話；袖手旁觀則能奪走他珍藏的護具。","Your hunter is trapped in poison. Rescue him for dialogue or take his armor after he falls."],["拉他離開毒池","Pull him out"],["他第一次看見你不是獵物。","He sees you as more than prey."],["取走護具","Take the armor"],["護具擋住刀刃，擋不住族人的恐懼。","Armor blocks blades but not the clan’s fear."],["停止追獵","Ending the Hunt"],["你找到能穩定供糧的地下菌田。讓兩族共同耕作需要耐心；獨佔它能讓巨魔再也不必乞求。","Fungal fields can feed everyone. Shared farming takes patience; monopoly ends the clan’s dependence."],["共同耕作","Farm together"],["再生不再只是撐過傷害，而是修復關係。","Regeneration becomes repair of relationships, too."],["守住菌田","Keep the fields"],["氏族不再飢餓，但邊界仍有箭矢。","The clan is fed; arrows still mark the border."],["不再被追獵","No Longer Hunted"],["菌田領主","Lord of the Fungal Fields"],["血契與同意","Blood Pacts and Consent"],["你的血脈要求永不飢餓，城市則要求永不流血。古老家族教你支配他人，卻有人願意自願捐血；你要決定永生究竟欠誰。","Your bloodline demands feeding; the city demands peace. Old houses teach domination, while volunteers offer blood. Decide whom immortality owes."],["第一份邀請","The First Invitation"],["一名醫師提出自願供血契約，家族則送來被囚的獵物。兩者都能救你，代價卻完全不同。","A healer offers voluntary blood; your house sends a prisoner. Both can sustain you, at very different costs."],["接受自願契約","Accept voluntary donors"],["你承諾回報而不是占有。","You promise reciprocity, not ownership."],["接受家族饋贈","Accept the house’s gift"],["家族讓你更強，也讓你欠下人情。","The house strengthens you and adds a debt."],["不死者的見證","An Undying Witness"],["家族要你刪去百年前的罪證。保留記憶會危及血親；服從則能解開更深的血術。","Your house wants old evidence erased. Preserve it at risk to your kin, or obey to learn deeper blood magic."],["保存罪證","Preserve the evidence"],["城市開始信任你的見證。","The city begins to trust your testimony."],["解開血術","Unlock blood magic"],["真相被埋葬，戰鬥讓你更容易恢復。","Truth is buried; battle restores you more easily."],["黎明之前","Before Dawn"],["你可以建立自願供血的庇護所，也可以接管古老家族。飢餓不會消失，權力也不能替你取得同意。","Build a sanctuary of voluntary donors or take over the old house. Hunger persists, and power cannot grant consent."],["建立庇護所","Build a sanctuary"],["你與凡人共同承擔永生的成本。","You and mortals share immortality’s costs."],["繼承血族王座","Inherit the blood throne"],["你的姓氏成為命令，而非邀請。","Your family name becomes a command."],["願意留下的人","Those Who Choose to Stay"],["不朽血王","The Undying Blood Monarch"],["命令之外","Beyond Commands"],["你的核心有一條不能讀取的命令：回收。創造者說你沒有靈魂，同行者卻把選擇交給你。你必須決定自己是工具、守衛還是一個人。","Your core contains an unreadable command: recycle. Creators deny your soul; companions trust your choices. Decide whether you are a tool, guardian or person."],["報廢清單","The Scrap List"],["報廢清單上有一個仍在工作的小魔像。修復它需要零件；拆解它則能提升你的裝甲。","A working small construct is marked for scrap. Repair it with parts or salvage it for your armor."],["修復同伴","Repair the companion"],["你失去零件，學會更有效的自我修復。","You give up parts and learn better repairs."],["接受回收命令","Accept recycling orders"],["裝甲變厚，清單仍繼續增加。","Your armor grows; the scrap list keeps growing."],["誰寫下命令","Who Wrote the Orders"],["創造者留下指令鎖，宣稱違抗會摧毀核心。你可以解除鎖定，也可以以忠誠換取更強的運算符文。","The creator claims disobedience destroys your core. Break the lock or trade loyalty for stronger calculation runes."],["解除指令鎖","Break the command lock"],["你開始用自己的眼睛理解世界。","You begin seeing the world for yourself."],["升級運算符文","Upgrade calculation runes"],["你更精準，也更難拒絕命令。","You become precise and less able to refuse orders."],["核心的名字","The Core’s Name"],["一座控制塔能命令所有魔像。摧毀它會讓同伴自由；接管它能保護他們，卻讓你成為新的主人。","A tower commands every construct. Destroy it to free them or take control to protect them as their new master."],["關閉控制塔","Shut down the tower"],["你的名字由你選擇，同伴也一樣。","You and your companions choose your own names."],["成為塔主","Command the tower"],["你承諾保護他們，但自由仍需要許可。","You promise protection; freedom still needs permission."],["自行命名","Self-Named"],["控制塔的新主人","The Tower’s New Master"],["天界沒有回答","Heaven Did Not Answer"],["你的恩典來自一個沉默的天界。人們求救，而誓約只允許你救下被認可的人；你得決定服從是否仍然等於善。","Your Grace comes from a silent heaven. People plead for help, but vows protect only the approved. Decide whether obedience remains goodness."],["誓約外的求救","A Plea Beyond the Vow"],["一位被詛咒的難民不在天界的救援名單上。救他會違反命令，忽略他則能獲得更多恩典。","A cursed refugee is excluded from heaven’s rescue list. Help against orders or accept Grace for obedience."],["回應求救","Answer the plea"],["你把資源交給難民，凡人開始信任你。","You share resources and earn mortal trust."],["遵守名單","Obey the list"],["恩典增加，但難民的名字被刪去。","Grace rises; the refugee’s name disappears."],["護衛的疑問","The Guardian’s Question"],["天界護衛問你，為什麼守護名單比生命重要。你可以允許它提問，也可以重寫它的記憶。","Your guardian asks why the list matters more than life. Let it question the vow or rewrite its memory."],["允許提問","Allow questions"],["護衛開始為你守望，而不只是執行命令。","The guardian watches over you beyond commands."],["重寫記憶","Rewrite memory"],["護衛的攻擊更強，疑問卻被抹去。","The guardian strikes harder; its questions vanish."],["打開天門","Opening Heaven’s Gate"],["天門終於回應，要求你交出所有例外。你可以讓恩典流向凡人，也可以證明自己從未偏離誓約。","Heaven answers and demands every exception. Share Grace with mortals or prove unwavering obedience."],["讓恩典流向凡人","Share Grace with mortals"],["你不再等待天界批准每一次善行。","Good deeds no longer wait for heaven’s approval."],["成為誓約裁決者","Become the vow’s judge"],["天界授你權柄，凡人只能等待審判。","Heaven grants authority; mortals wait for judgment."],["凡間守望","Mortal Watch"],["天門裁決者","Judge of Heaven’s Gate"],["深淵的解約書","The Abyssal Exit Contract"],["你的真名被深淵契約扣押，每次召喚都替債主帶來利息。你可以建立自由的盟約，也可以成為下一位債主；反噬會提醒你兩條路都不免費。","An abyssal pact holds your true name and charges interest on summons. Build free alliances or become the next creditor; Backlash reminds you neither path is free."],["第一個欠債者","The First Debtor"],["獵犬的契約寫著永遠服從。撕掉條款會減少你的靈魂存量，保留它則能立即借到更多力量。","Your hound must obey forever. Tear up the clause at a Soul cost or borrow more power under the pact."],["改為自願盟約","Offer a voluntary pact"],["獵犬仍選擇同行，契約壓力減輕。","The hound chooses to stay; pact pressure eases."],["借取更多力量","Borrow more power"],["靈魂存量增加，深淵的債權也增加。","You gain Souls and deepen the abyss’s claim."],["解約書的價格","The Price of Release"],["解約書要求你交出另一個人的真名。你可以付出自己的旅費，或讓陌生人代替你承擔債務。","Release requires another person’s true name. Pay your own travel funds or pass the debt to a stranger."],["自行償還","Pay your own debt"],["獵犬的火焰更穩定，債務逐漸減少。","The hound’s fire steadies as debts shrink."],["轉移債務","Transfer the debt"],["你取得力量，陌生人的名字卻消失了。","You gain power; the stranger’s name vanishes."],["誰是債主","Who Is the Creditor"],["深淵願意讓你接管契約簿。燒掉它能釋放眾人，保留它則能讓你的召喚軍團永遠有新的兵源。","The abyss offers its ledger. Burn it to free the debtors or keep it as an endless source for your army."],["燒毀契約簿","Burn the pact ledger"],["你的力量有限，名字卻屬於自己。","Your power has limits; your name belongs to you."],["接管深淵債權","Take the abyss’s claims"],["你不再是欠債者，而是新的枷鎖。","You cease to be a debtor and become the chain."],["以真名自由","Free in Your True Name"],["深淵債主","Creditor of the Abyss"],["聖壇記錄凡人的努力：額外 4 經驗。","The altar honors mortal effort: +4 experience."],["商人詢問你的故鄉，願意聽你的選擇。","The merchant asks about your homeland and listens to your choices."],["聖壇回應生命誓約：額外 4 魔力。","The altar answers the life oath: +4 mana."],["商人留著森林的種子，也留意流亡者的消息。","The merchant keeps forest seeds and news of the exiles."],["聖壇為鍛造傳承加固護盾：額外 4 護盾。","The altar reinforces forge traditions: +4 shield."],["商人認得氏族鍛印，詢問熔爐屬於誰。","The merchant recognizes clan marks and asks who owns the forge."],["聖壇收下公平交易的誓言：額外 5 金幣。","The altar accepts fair trade: +5 gold."],["商人核對帳本；公平與壟斷會改變未來的價格。","The merchant checks the ledger; fair trade and monopolies change future prices."],["聖壇認可保護者的力量：額外 4 生命。","The altar honors protective strength: +4 HP."],["商人看著戰旗，想知道它是庇護還是命令。","The merchant asks whether your banner shelters or commands."],["聖壇給予不必爭奪的補給：額外 50 飽食。","The altar provides shared food: +50 satiety."],["商人收起獵弓，等待你證明停戰的誠意。","The merchant lowers the hunting bow and waits for proof of peace."],["聖壇將祝福轉換成血飽：額外 100 血飽。","The altar turns its blessing into blood: +100 blood satiety."],["商人要求尊重自願供血契約。","The merchant demands respect for voluntary blood pacts."],["聖壇以符文修復核心：額外 6 生命。","The altar repairs your core: +6 HP."],["商人詢問你的名字，而非出廠編號。","The merchant asks your name, not your serial number."],["聖壇重燃恩典：額外 8 恩典。","The altar rekindles Grace: +8 Grace."],["商人不在天界名單上，仍希望你能聽見求救。","The merchant is absent from heaven’s list but hopes you hear the plea."],["聖壇削弱契約束縛：反噬降低 15。","The altar weakens your pact: Backlash -15."],["商人只接受金幣，不接受拿別人的真名抵債。","The merchant accepts gold, never someone else’s true name."],["教學模式不開放種族篇章；請開始正式冒險。","Race chronicles are unavailable in training. Start a real adventure."],["舊角色保留原職業；新角色需遵守種族職業限制。","Existing characters keep their class; new characters follow race restrictions."],["每族三個篇章。前一章的選擇會改變後續任務與能力；完成三章後，以多數選擇決定族裔結局。選擇永久生效，消耗一回合；查看與取消免費。","Each race has three chapters. Earlier choices change later objectives and abilities. The majority of your three choices determines the lineage ending. Choices are permanent and cost a turn; viewing and canceling are free."],["前章的後果：","Consequences of the Previous Chapter:"],["完成條件後回來選擇；篇章可回頭完成。","Return after meeting the requirements; earlier chapters remain available."],["你的多數選擇把權力集中在自己手中；被你幫助或犧牲的人，都成為這段歷史的一部分。","Most of your decisions concentrated power in your hands. Those you helped or sacrificed remain part of that history."],["你的多數選擇把力量交給同伴與族人；你保留了聯繫，也承擔了共享力量的成本。","Most of your decisions shared power with companions and kin. You preserved relationships and paid the costs of sharing."],["故事選擇會改變商店價格；能力與代價可在種族篇章查看。","Story choices affect shop prices. View abilities and costs in your race chronicle."],["查看種族篇章與任務","View Race Chronicle and Objectives"],["人類可選全部職業；其他種族依誓約、體質與傳承限制職業。每族都有三章分歧故事、能力與代價；按 v 或從日誌開啟種族篇章。","Humans may choose all classes. Other races are restricted by vows, physiology and traditions. Every race has three branching chapters with abilities and costs. Press v or open the chronicle from your journal."],["資源不足，選擇不會生效。","Not enough resources. No choice was committed."]])phrase(zh,en);
for(const [zh,en]of [["鍊金師","Alchemist"],["契靈師","Spiritbinder"],["酸爆炸彈","Acid Bomb"],["元素契約","Elemental Pact"],["使用試劑管理補給與爆破。起始 4 試劑與已知魔力藥水；每次擊殺 +1 試劑，上限 6。4：消耗 1 試劑與 7 基礎魔力，向六格內目標投擲酸爆炸彈，傷害目標與相鄰敵人、無視物理護甲；冷卻 5 回合。7：調製已知藥劑，消耗試劑與 4 基礎魔力、1 回合；取消不消耗。","Manage reagents for supplies and explosions. Start with 4 Reagents and a known Mana Potion. Each kill grants 1 Reagent, up to 6. Key 4: spend 1 Reagent and 7 base mana to throw an Acid Bomb at a target within 6 tiles, damaging it and adjacent enemies while ignoring physical armor; 5-turn cooldown. Key 7: brew identified potions for Reagents, 4 base mana and one turn. Canceling is free."],["以共鳴召喚元素盟友。起始 3 共鳴，上限 5。4：消耗 2 共鳴與 9 基礎魔力，召喚目前元素盟友 35 回合、冷卻 8 回合；與所有召喚共用兩名盟友上限。7：循環切換火、冰、生命元素，消耗 1 回合。元素盟友命中敵人 +1 共鳴；生命元素有效治療時 +1。8：花 2 共鳴治療自己與盟友各 12 生命、冷卻 5 回合。","Summon elemental allies through Resonance. Start with 3 Resonance, up to 5. Key 4: spend 2 Resonance and 9 base mana to summon your attuned element for 35 turns; 8-turn cooldown. All summons share a two-ally limit. Key 7: cycle Fire, Frost and Life attunements for one turn. Elemental hits grant 1 Resonance; successful Life healing also grants 1. Key 8: spend 2 Resonance to heal yourself and allies for 12 HP each; 5-turn cooldown."],["火元素","Fire Elemental"],["冰元素","Frost Elemental"],["生命元素","Life Elemental"],["試劑","Reagents"],["共鳴","Resonance"],["技能冷卻中或魔力不足。","Skill is on cooldown or mana is insufficient."],["試劑不足。","Not enough Reagents."],["共鳴不足。","Not enough Resonance."],["酸爆炸彈在目標周圍炸開。","The Acid Bomb explodes around the target."],["元素盟友受召而來：","An elemental ally answers your call:"],["元素盟友攻擊敵人。","Your elemental ally attacks the enemy."],["調製藥劑","Brew Potions"],["藥劑調製","Potion Brewing"],["每次調製消耗試劑、4 基礎魔力與一回合。藥劑已鑑定；取消不消耗。","Brewing costs Reagents, 4 base mana and one turn. Potions are identified; canceling is free."],["試劑或魔力不足。","Not enough Reagents or mana."],["調製完成：","Brewed:"],["元素調律","Elemental Attunement"],["共鳴療癒","Resonant Healing"],["療癒冷卻中或共鳴不足。","Healing is on cooldown or Resonance is insufficient."],["沒有需要療癒的盟友隊伍，保留共鳴。","No allied party needs healing. Keep your Resonance."],["共鳴療癒恢復隊伍生命。","Resonant Healing restores the party’s health."],["職業資源無效","Invalid Class Resources"],["擊殺取得試劑；炸彈消耗 1 試劑。","Kills grant Reagents; bombs cost 1 Reagent."],["元素召喚消耗 2 共鳴；盟友命中補充共鳴。","Elemental summons cost 2 Resonance; allied hits restore Resonance."],["天使與惡魔：種族召喚 / 種族能力","Angels and Demons: racial summon / racial ability"],["鍊金師：調製藥劑；契靈師：元素調律 / 共鳴療癒","Alchemist: brew potions; Spiritbinder: elemental attunement / resonant healing"],["種族篇章與任務","Race chronicle and objectives"],["人類沒有血統限制，可以學習所有職業。","Humans have no bloodline restrictions and may learn every class."],["精靈的生命誓約不容許骸骨契約，因此不能選喚骨者。","The elven life oath forbids bone pacts, excluding Bonecallers."],["矮人使用鍛造與神諭傳承，不採用織焰或喚骨契約。","Dwarves follow forge and divine traditions, excluding Flameweavers and Bonecallers."],["哥布林的交易契約與聖諭誓言衝突，因此不能選聖諭者。元素盟誓拒絕交易式靈魂契約，因此也不能選契靈師。","Goblin trade pacts conflict with clerical vows, excluding Clerics. Elemental oaths also reject transactional soul contracts, excluding Spiritbinders."],["獸人的戰團傳承不教授織焰與聖諭術。戰團不教授精密藥劑調製，因此也不能選鍊金師。","Orc warbands do not teach flameweaving or clerical rites. Warbands do not teach precise potion preparation, excluding Alchemists."],["巨魔的再生會干擾精密秘法、射術與聖諭儀式。精密調製與元素共鳴也受到再生干擾，不能選鍊金師或契靈師。","Troll regeneration disrupts precise arcana, archery and clerical rituals. Regeneration also disrupts precise brewing and elemental resonance, excluding Alchemists and Spiritbinders."],["吸血鬼的血契無法承受聖諭者的聖光誓約。","Vampiric blood pacts cannot sustain a Cleric's sacred-light oath."],["魔像沒有可簽訂聖諭或骸骨契約的靈魂。元素盟誓同樣需要靈魂，因此不能選契靈師，但可進行鍊金。","Constructs lack the soul required for clerical vows or bone pacts. Elemental oaths also need a soul, excluding Spiritbinders; Alchemy remains available."],["天使的天界誓約禁止影遁與喚骨契約，不能選夜行者或喚骨者。","Celestial vows forbid Shadowwalkers and Bonecallers."],["惡魔的深淵契約與聖諭者的聖光誓言互斥。","Abyssal pacts are incompatible with clerical vows."],["鍊金師先用 7 調製補給，保留至少 1 試劑給酸爆炸彈。契靈師的火元素攻擊較高，冰元素命中使敵人停頓 1 回合，生命元素每 5 回合在兩格內治療你 4 生命；盟友沿用召喚時的元素，7 只改變下一次召喚。8 的療癒需要至少一名活著的盟友與受傷目標。","Alchemists can brew supplies with 7; reserve at least 1 Reagent for an Acid Bomb. Spiritbinders’ Fire elementals hit harder, Frost hits pause an enemy for one turn, and Life elementals heal you for 4 HP every 5 turns within 2 tiles. Allies keep the element they had when summoned; 7 affects the next summon. Healing with 8 requires at least one living ally and an injured target."]])phrase(zh,en);
for(const [zh,en] of EXP_PHRASES.concat([["用此碼重開挑戰","Restart with This Code"],["挑戰碼固定種子、種族、職業與難度。開始前可先匯出目前角色。","Codes fix seed, race, class and difficulty. Export your current character before starting."],["紀錄僅存於本機，分享成績文字即可比較。","Records stay in this browser; share result text to compare."]],[["聲望至少 20 才能進入秘密據點。敵對派系可能派守衛追捕。","Secret refuges require 20 reputation. Hostile factions may send guards."],["匯入會開始新冒險，請先備份目前角色。","Importing starts a new adventure. Back up your current character first."],["先匯出目前角色","Export Current Character First"],["從朋友取得挑戰碼，輸入後開始相同條件的新冒險。","Enter a code from a friend to start a new adventure with the same conditions."],["最深樓層","Deepest Floor"],["擊敗敵人","Enemies Defeated"],["盟友","Ally"]],[["六項遠征系統","Six Expedition Systems"],["按 k 開啟遠征指揮。協助派系提升聲望，20 點可領取秘密據點補給；偷竊會降聲望並引來守衛。盟友可跟隨、守位、集火或撤退，存活 10／25 回合各成長一次。每層的種族遺跡提供通用與專屬解法。火可點燃油與毒氣、燒掉蛛網；冰可凍水並冷卻熔岩；酸可溶解木箱和門。角色等級 5 或抵達主線第 8 層，可選一項不可更換的職業專精。朋友挑戰碼固定遊戲版本、種子、種族、職業與模式；匯入會開始新局，成績只保留在目前瀏覽器。","Press k for expedition command. Help factions gain reputation; at 20, claim supplies at secret refuges. Theft lowers standing and brings guards. Allies can follow, guard, focus or retreat and grow after 10 and 25 surviving turns. Each floor has a racial site with common and unique solutions. Fire ignites oil and gas and burns webs; cold freezes water and cools lava; acid dissolves crates and doors. At character level 5 or main floor 8, choose a permanent class specialization. Friend codes fix the game revision, seed, race, class and mode; importing starts a new run. Results stay in this browser."]]))phrase(zh,en);
plotRegisterTranslations();phrase('擊敗第 24 層守衛後，在餘燼之心選擇終局；擊敗該路線的殘響守衛後，再互動確認結局。','After defeating the floor 24 guardian, choose a finale at the Ember Heart. Defeat its echo guardian, then interact again to confirm the ending.');phrase('五條主線共有二十章，角色與證據在各層入口附近。按 n 與附近角色對話，按 b 查看承諾。','Five stories have twenty chapters. Characters and clues are near floor entrances. Press n to speak nearby or b to review promises.');
const EN_RE=new RegExp([...EN.keys()].sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function englishText(source){source=String(source).replace(/^(.+) · (\d+) 層/, '$1 · Floor $2').replace(/^恢復 (\d+) 生命，獲得 (\d+) 護盾。$/, 'Restore $1 HP and gain $2 shield.').replace(/^獲得 (\d+) 經驗，回滿魔力。$/, 'Gain $1 experience and fully restore mana.').replace(/^主線第 (\d+) 層有入口$/, 'Entrance on main floor $1').replace(/^完成第 (\d+) \/ (\d+) 課$/, 'Lesson $1 / $2');return source.replace(EN_RE,m=>EN.get(m)).replace(/，/g,', ').replace(/。/g,'.').replace(/：/g,': ').replace(/；/g,'; ').replace(/！/g,'!').replace(/？/g,'?').replace(/（/g,' (').replace(/）/g,')').replace(/「|」/g,'').replace(/、/g,', ').replace(/\s+([,.;!?])/g,'$1')}
function t(source){return LANGUAGE==='en'?englishText(source):source}
const localText=new WeakMap(),localAttributes=new WeakMap();
const languageSelect=document.createElement('select');languageSelect.id='languageSelect';languageSelect.setAttribute('aria-label','Language / 語言');languageSelect.innerHTML='<option value="auto">瀏覽器推薦 / Auto</option><option value="zh">繁體中文</option><option value="en">English</option>';languageSelect.value=LANGUAGE_CHOICE;document.querySelector('.toptools').prepend(languageSelect);
const languageObserver=new MutationObserver(()=>localizePage());
function localizePage(){languageObserver.disconnect();document.documentElement.lang=LANGUAGE==='zh'?'zh-Hant':'en';document.title=LANGUAGE==='zh'?'EMBERFALL II · 深淵之書':'EMBERFALL II · The Book of the Abyss';const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement?.closest('script,style,#languageSelect,input,textarea,[data-no-i18n]'))continue;let saved=localText.get(n);if(!saved||n.nodeValue!==saved.rendered)saved={source:n.nodeValue,rendered:null};const translated=t(saved.source);if(n.nodeValue!==translated)n.nodeValue=translated;saved.rendered=translated;localText.set(n,saved)}document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{if(el===languageSelect)return;const values=localAttributes.get(el)||{};for(const attr of ['placeholder','aria-label','title'])if(el.hasAttribute(attr)){const current=el.getAttribute(attr);let saved=values[attr];if(!saved||current!==saved.rendered)saved={source:current};const translated=t(saved.source);if(current!==translated)el.setAttribute(attr,translated);saved.rendered=translated;values[attr]=saved}localAttributes.set(el,values)});languageSelect.options[0].text=LANGUAGE==='zh'?'瀏覽器推薦':'Browser recommendation';languageSelect.title=LANGUAGE==='zh'?'依瀏覽器偏好推薦；手動選擇會記住設定':'Recommended from browser languages; manual choices are remembered';languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']})}
function setLanguage(choice){LANGUAGE_CHOICE=choice;LANGUAGE=choice==='auto'?recommendedLanguage(navigator.languages?.length?navigator.languages:[navigator.language]):choice;try{localStorage.setItem(LANGUAGE_KEY,choice)}catch{}localizePage()}
languageSelect.addEventListener('change',()=>setLanguage(languageSelect.value));
localizePage();

