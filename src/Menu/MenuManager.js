/* 
 *  Created by Shane Walsh
 *  
 */


export default class MenuManager{
    constructor({}){
        this.props = {
			playing:false,
			selectedlevel:"L1TrainingDay",
			levels:[{name:"survival", displayName:"Survival", l:0,description:"An elite pilot finds himself alone in space with enemy signatures all around him.", objective:"Survive for as long as you can"},
			        {name:"L1TrainingDay", displayName:"Training Day", l:1, objective:"Survive for 5 waves", description:"A novice pilot, nicknamed novice, stationed on a desolate mining planet was out on his daily patrols when first contact was made. He sent out comms links to the alien crafts, however they did not respond to his link, and instead began firing."},
			        {name:"L2WelcomeBack",displayName:"Colony Defense", l:2, objective:"Ensure that at least one tower survives the assult.", description:"Having survived the initial contact with the Aliens, Novice arrived back at the mining outpost to find it under attack."},
			        {name:"L3CounterAttack",displayName:"Counter Attack", l:3, objective:"Destroy all of the factory ships.", description:"There appeared to be factory ships orbiting the planet, producing more alien crafts. The miners needed time to repair the damaged turrets, so Novice volenteered to launch a counter attack on the bots and destory the factory ships."},
			        {name:"L4SecondContact",displayName:"Second Contact", l:4, objective:"Survive the onslaught for 10 waves.", description:"After the successful raid on the factory ships the Aliens retreated, the mines celebrated. However two days later, the sirens went off in the early morning. Novice ran from his bunk straight to his ship. His radar was swarming with activity as he took off."},
			        {name:"L5FaceOff",displayName:"Face Off", l:5, objective:"Defeat the alien MegaFactory.", description:"After the Alien onslaught, the bases the defences were crippled. The Aliens obviously seeing their chance to finish off the mines, attacked with a massive factory ship. Novice, without hesitation, intercepted the massive ship, giving the miners vitial time to escape to the bunker."},
			        {name:"L6Reinforcements",displayName:"Reinforcements", l:6, objective:"Help the Alliance Starships. Survive the battle.", description:"Despite Novice's great victory over the mega factory, the base was lost, leaving novice and the miners trapped in the bunker. The sky was swarming with Aliens now, thicker than ever. All hope was lost, until the comms light began to flash.'This is commander Jones, of the sixth navy, we are inbound. T-9 minutes. The miners all glanced to the sky as the ships moved back into space. Then they saw his plane take off.'"},
			        {name:"L7Salvage",displayName:"Salvage", l:7, objective:"Protect the mining ship as it salvages ship parts.", description:"The fleet was lost, and Novice crash landed back on the planet.The miners all agree to risk everything to save him. They launch their one remaining mining ship and recover his ship. They passed a downed starship from the sixth fleet with a single large hull breech and one miner thinks its engine can be salvaged. They make a plan to gather fallen ship parts.'"},
			        {name:"L8TheLaunch",displayName:"The Launch", l:8, objective:"Protect the mining ship as it prepares for orbital launch.", description:"The miners gamble paid off, and they secured enough spare parts to repair all four of the base turrets and even mount an extra turret on the mining vessal. The parts were retrofitted into the mining vessel, making it capable of space travel. But it needs time to charge, and the horizon looks very dark."},
			        {name:"L9Warp",displayName:"The Warp", l:9, objective:"Survive 10 waves to allow the miners to escape.", description:"Novice managed to dock with the the mining ship  before it made it into orbit, however the ships hull was damaged as it broke through the atmosphere. They could repair it, but they needed time. As the Aliens closed in again novice once again stepped up, and lead the Aliens into an asteroid belt to buy the miners time."},
			        {name:"L10Titan",displayName:"The Last Stand", l:10, objective:"Destory the Titan!", description:"A wall of Aliens separated Novice from the Miners, and although it broke their hearts, they had to go to warp without him. Novice relinquished his controls, letting his ship drift in the belt, his fight was over, the miners had escaped. Thats when he say it. A ship, as big as a moon, racing towards him. He took control of the controls again, for one last fight."},
			        {name:"fleetBattle",displayName:"Colony Defense", l:11, objective:"Kill everything!", description:"Aliens attack from space!! agaaghgag3"}
			],

			upgradeBullets:[{f:false, Desc:"Bullet Damage:3 |", upgradeText:"Next Upgrade Cost:2",upCost:2, upValue:4, l:0},
			        {f:false, Desc:"Bullet Damage:4 |", upgradeText:"Next Upgrade Cost:3",upCost:3,upValue:5, l:1},
			        {f:false, Desc:"Bullet Damage:5 |", upgradeText:"Next Upgrade Cost:4",upCost:4,upValue:6, l:2},
			        {f:false, Desc:"Bullet Damage:6 |", upgradeText:"Next Upgrade Cost:5",upCost:5,upValue:7, l:3},
			        {f:true, Desc:"Bullet Damage:7", upgradeText:"",upCost:4000,upValue:7, l:4}
			],

			upgradeArmor:[{f:false, Desc:"Ship Armor:200 |", upgradeText:"Next Upgrade Cost:2",upCost:2, upValue:225, l:0},
                    {f:false, Desc:"Ship Armor:225 |", upgradeText:"Next Upgrade Cost:3",upCost:3,upValue:250, l:1},
                    {f:false, Desc:"Ship Armor:250 |", upgradeText:"Next Upgrade Cost:4",upCost:4,upValue:275, l:2},
                    {f:false, Desc:"Ship Armor:275 |", upgradeText:"Next Upgrade Cost:5",upCost:5,upValue:300, l:3},
                    {f:true, Desc:"Ship Armor:300", upgradeText:"",upCost:4000,upValue:500, l:4}
			],

			upgradeMissiles:[{f:false, Desc:"Missiles:10/20 |", upgradeText:"Next Upgrade Cost:2",upCost:2, upValue:12,upValue2:26, l:0},
                    {f:false, Desc:"Missiles:12/26 |", upgradeText:"Next Upgrade Cost:3",upCost:3,upValue:16,upValue2:32, l:1},
                    {f:false, Desc:"Missiles:14/32 |", upgradeText:"Next Upgrade Cost:4",upCost:4,upValue:18,upValue2:36, l:2},
                    {f:false, Desc:"Missiles:18/36 |", upgradeText:"Next Upgrade Cost:5",upCost:5,upValue:20,upValue2:40, l:3},
                    {f:true, Desc:"Missiles:20/40", upgradeText:"",upCost:4000,upValue:7000, l:4}
			],

			upgradePowerShield:[{f:false, Desc:"Shield Cap 5 |", upgradeText:"Next Upgrade Cost:2",upCost:2, upValue:7, l:0},
                    {f:false, Desc:"Shield Cap 7 |", upgradeText:"Next Upgrade Cost:3",upCost:3,upValue:8, l:1},
                    {f:false, Desc:"Shield Cap 8 |", upgradeText:"Next Upgrade Cost:4",upCost:4,upValue:9, l:2},
                    {f:false, Desc:"Shield Cap 9 |", upgradeText:"Next Upgrade Cost:5",upCost:5,upValue:10, l:3},
                    {f:true, Desc:"Shield Cap 10", upgradeText:"",upCost:4000,upValue:7000, l:4}
			]

		};
		this.setupListeners();
    }

	getLevel(number){
	    return this.props.levels[number];
	}

	setSelectedLevel(name){
        this.props.selectedlevel = name;
	}

	getSelectedLevel(){
	    return this.props.selectedlevel;
	}

	update(){ // move all of the minions
	}
	
	setupListeners(){
		//pSub.subscribe(globe.ALLBOTSDESTROYED,this.levelUpEffect,this);
	}
}