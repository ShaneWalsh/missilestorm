/* 
 *  Created by Shane Walsh
 *  
 */

export default class StateManager{
    constructor(){
        this.props = {
        	campaignUnlockedLevel:0,
        	bulletDamageUnlockedLevel:0,
        	missileUnlockedLevel:0,
        	powerShieldUnlockedLevel:0,
        	shipArmorUnlockedLevel:0,
        	shipStats:{health:200,damage:3,powerShield:5,missileCap:20,missileAmount:10},
        	unlockPoints:2,

        	dashersKilled:0,
        	glidersKilled:0,
        	carriersKilled:0,
        	beekeepersKilled:0,
        	titan:0,
        	megaTitan:0,

        	isPlaying:false,

        	highestSurvivalScore:0

		};
		this.setupListeners();

    }

    clearStorage({}){
        var p = this.props;
        p.campaignUnlockedLevel = 0;
        p.bulletDamageUnlockedLevel = 0;
        p.missileUnlockedLevel = 0;
        p.powerShieldUnlockedLevel = 0;
        p.shipArmorUnlockedLevel = 0;
        p.unlockPoints = 2;
        $jq.Storage.set("MS1_PA", "1");
        $jq.Storage.set("MS1_campaignUnlockedLevel",""+p.campaignUnlockedLevel);
        $jq.Storage.set("MS1_bulletDamageUnlockedLevel",""+p.bulletDamageUnlockedLevel);
        $jq.Storage.set("MS1_missileUnlockedLevel",""+p.missileUnlockedLevel);
        $jq.Storage.set("MS1_powerShieldUnlockedLevel",""+p.powerShieldUnlockedLevel);
        $jq.Storage.set("MS1_shipArmorUnlockedLevel",""+p.shipArmorUnlockedLevel);

        $jq.Storage.set("MS1_unlockPoints",""+p.unlockPoints);
    }

	loadGameState({}){
        var p = this.props;
        var ms1_pa = $jq.Storage.get("MS1_PA");
        if(ms1_pa == "1"){
            p.campaignUnlockedLevel = $jq.Storage.get("MS1_campaignUnlockedLevel");
            p.bulletDamageUnlockedLevel = $jq.Storage.get("MS1_bulletDamageUnlockedLevel");
            p.missileUnlockedLevel = $jq.Storage.get("MS1_missileUnlockedLevel");
            p.powerShieldUnlockedLevel = $jq.Storage.get("MS1_powerShieldUnlockedLevel");
            p.shipArmorUnlockedLevel = $jq.Storage.get("MS1_shipArmorUnlockedLevel");

            p.unlockPoints = $jq.Storage.get("MS1_unlockPoints");

            p.dashersKilled = $jq.Storage.get("MS1_dashersKilled");
            p.glidersKilled = $jq.Storage.get("MS1_glidersKilled");
            p.carriersKilled = $jq.Storage.get("MS1_carriersKilled");
            p.beekeepersKilled = $jq.Storage.get("MS1_beekeepersKilled");
            p.titan = $jq.Storage.get("MS1_titan");
            p.megaTitan = $jq.Storage.get("MS1_megaTitan");
            p.highestSurvivalScore = $jq.Storage.get("MS1_highestSurvivalScore");
            this.clean();
            this.updateValues();
        }
        p.isPlaying = true;
	}

	saveCampaignLevel(btnNumber){
	    var p = this.props;
	    if(p.campaignUnlockedLevel < btnNumber){
	        p.campaignUnlockedLevel = btnNumber;
	    }
	}

	updateValues(){
	    var p = this.props;
	    var tempUnlockPoints = p.unlockPoints;
	    p.unlockPoints = 1000;
	    var temp = 0;

        if(p.powerShieldUnlockedLevel > 0){
            temp = p.powerShieldUnlockedLevel;
            p.powerShieldUnlockedLevel = 0;
            while(p.powerShieldUnlockedLevel < temp){
                unlockShields();
            }
            p.powerShieldUnlockedLevel = temp;
        }

        if(p.shipArmorUnlockedLevel > 0){
            temp = p.shipArmorUnlockedLevel;
            p.shipArmorUnlockedLevel = 0;
            while(p.shipArmorUnlockedLevel < temp){
                unlockArmor();
            }
            p.shipArmorUnlockedLevel = temp;
        }

        if(p.bulletDamageUnlockedLevel > 0){
            temp = p.bulletDamageUnlockedLevel;
            p.bulletDamageUnlockedLevel = 0;
            while(p.bulletDamageUnlockedLevel < temp){
                unlockBullet();
            }
            p.bulletDamageUnlockedLevel = temp;
        }

        if(p.missileUnlockedLevel > 0){
            temp = p.missileUnlockedLevel;
            p.missileUnlockedLevel = 0;
            while(p.missileUnlockedLevel < temp){
                unlockMissile();
            }
            p.missileUnlockedLevel = temp;
        }

        if(p.campaignUnlockedLevel > 0){
            temp = p.campaignUnlockedLevel;
            p.campaignUnlockedLevel = 1;
            while(p.campaignUnlockedLevel <= temp){
                completeLevelUnlockNextGameState(p.campaignUnlockedLevel++);
            }
            p.campaignUnlockedLevel = temp;
        }

        p.unlockPoints = tempUnlockPoints; // do an update of the unlock points
        $jq("#upgradePoints").html("Upgrade Points Avaiable: "+p.unlockPoints);

	}

	clean(){
	    var p = this.props;
        p.campaignUnlockedLevel++;
        p.campaignUnlockedLevel--;
        p.bulletDamageUnlockedLevel++;
        p.bulletDamageUnlockedLevel--;
        p.missileUnlockedLevel++;
        p.missileUnlockedLevel--;
        p.powerShieldUnlockedLevel++;
        p.powerShieldUnlockedLevel--;
        p.shipArmorUnlockedLevel++;
        p.shipArmorUnlockedLevel--;

        p.unlockPoints++;
        p.unlockPoints--;

        p.dashersKilled++;
        p.dashersKilled--;
        p.glidersKilled++;
        p.glidersKilled--;
        p.carriersKilled++;
        p.carriersKilled--;
        p.beekeepersKilled++;
        p.beekeepersKilled--;
        p.titan++;
        p.titan--;
        p.megaTitan++;
        p.megaTitan--;
        p.highestSurvivalScore++;
        p.highestSurvivalScore--;
    }

	saveGameState({}){
        var p = this.props;
        $jq.Storage.set("MS1_PA", "1");
        $jq.Storage.set("MS1_campaignUnlockedLevel",""+p.campaignUnlockedLevel);
        $jq.Storage.set("MS1_bulletDamageUnlockedLevel",""+p.bulletDamageUnlockedLevel);
        $jq.Storage.set("MS1_missileUnlockedLevel",""+p.missileUnlockedLevel);
        $jq.Storage.set("MS1_powerShieldUnlockedLevel",""+p.powerShieldUnlockedLevel);
        $jq.Storage.set("MS1_shipArmorUnlockedLevel",""+p.shipArmorUnlockedLevel);

        $jq.Storage.set("MS1_unlockPoints",""+p.unlockPoints);

        $jq.Storage.set("MS1_dashersKilled",""+p.dashersKilled);
        $jq.Storage.set("MS1_glidersKilled",""+p.glidersKilled);
        $jq.Storage.set("MS1_carriersKilled",""+p.carriersKilled);
        $jq.Storage.set("MS1_beekeepersKilled",""+p.beekeepersKilled);
        $jq.Storage.set("MS1_titan",""+p.titan);
        $jq.Storage.set("MS1_megaTitan",""+p.megaTitan);
        $jq.Storage.set("MS1_highestSurvivalScore",""+p.highestSurvivalScore);

        // unlock medals :D

        if(p.dashersKilled > 2500){
        }
        if(p.dashersKilled > 2000){
            newgroundsImpl.unlockMedal("dashermaster");
        }
        if(p.dashersKilled > 500){
            newgroundsImpl.unlockMedal("dasherdestroyer");
        }
        if(p.dashersKilled > 50){
            newgroundsImpl.unlockMedal("dasherkiller");
        }

        if(p.glidersKilled > 2500){
        }
        if(p.glidersKilled > 2000){
            newgroundsImpl.unlockMedal("glidermaster");
        }
        if(p.glidersKilled > 500){
            newgroundsImpl.unlockMedal("gliderdestroyer");
        }
        if(p.glidersKilled > 50){
            newgroundsImpl.unlockMedal("gliderkiller");
        }

        if(p.carriersKilled > 2500){
        }
        if(p.carriersKilled > 500){
            newgroundsImpl.unlockMedal("carriermaster");
        }
        if(p.carriersKilled > 200){
            newgroundsImpl.unlockMedal("carrierdestroyer");
        }
        if(p.carriersKilled > 25){
            newgroundsImpl.unlockMedal("carrierkiller");
        }

        if(p.beekeepersKilled > 2500){
        }
        if(p.beekeepersKilled > 2000){
            newgroundsImpl.unlockMedal("beekeepermaster");
        }
        if(p.beekeepersKilled > 500){
            newgroundsImpl.unlockMedal("beekeeperdestroyer");
        }
        if(p.beekeepersKilled > 50){
            newgroundsImpl.unlockMedal("beekeeperkiller");
        }
        

        /*
            if p.highestSurvivalScore is > certain amount unlock medal.
        */
        if(p.highestSurvivalScore > 50000){
            newgroundsImpl.unlockMedal("pilotthirdclass");
        }if(p.highestSurvivalScore > 20000){
            newgroundsImpl.unlockMedal("pilotsecondclass");
        }if(p.highestSurvivalScore > 5000){
            newgroundsImpl.unlockMedal("pilotfirstclass");
        }
	}

	update(){

	}

	updateHighestScore(topic,{score}){
	    if(this.props.highestSurvivalScore < score){
	        this.props.highestSurvivalScore = score;
	    }
	}

    bulletUpgrade({upgradeBullets}){
        var p = this.props;
        var bulletUpgrade = this.getLevelObj({upgrade:upgradeBullets,unlockedLevel:p.bulletDamageUnlockedLevel++});
        p.unlockPoints -= bulletUpgrade.upCost;

        p.shipStats.damage = bulletUpgrade.upValue;
        var nextBulletUpgrade = this.getLevelObj({upgrade:upgradeBullets,unlockedLevel:p.bulletDamageUnlockedLevel});
        return nextBulletUpgrade;
    }

	checkBulletUpgrade({upgradeBullets}){
	    var p = this.props;

        var bulletUpgrade = this.getLevelObj({upgrade:upgradeBullets,unlockedLevel:p.bulletDamageUnlockedLevel});
        if(bulletUpgrade.upCost <= p.unlockPoints){
            return true;
        }

        return false;
	}

	armorUpgrade({upgradeArmor}){
        var p = this.props;
        var bUpgrade = this.getLevelObj({upgrade:upgradeArmor,unlockedLevel:p.shipArmorUnlockedLevel++});
        p.unlockPoints -= bUpgrade.upCost;

        p.shipStats.health = bUpgrade.upValue;
        var nextBUpgrade = this.getLevelObj({upgrade:upgradeArmor,unlockedLevel:p.shipArmorUnlockedLevel});
        return nextBUpgrade;
    }

	checkArmorUpgrade({upgradeArmor}){
	    var p = this.props;

        var bulletUpgrade = this.getLevelObj({upgrade:upgradeArmor,unlockedLevel:p.shipArmorUnlockedLevel});
        if(bulletUpgrade.upCost <= p.unlockPoints){
            return true;
        }

        return false;
	}

	shieldUpgrade({upgradePowerShield}){
        var p = this.props;
        var bUpgrade = this.getLevelObj({upgrade:upgradePowerShield,unlockedLevel:p.powerShieldUnlockedLevel++});
        p.unlockPoints -= bUpgrade.upCost;

        p.shipStats.powerShield = bUpgrade.upValue;
        var nextBUpgrade = this.getLevelObj({upgrade:upgradePowerShield,unlockedLevel:p.powerShieldUnlockedLevel});
        return nextBUpgrade;
    }

	checkShieldUpgrade({upgradePowerShield}){
	    var p = this.props;

        var bulletUpgrade = this.getLevelObj({upgrade:upgradePowerShield,unlockedLevel:p.powerShieldUnlockedLevel});
        if(bulletUpgrade.upCost <= p.unlockPoints){
            return true;
        }

        return false;
	}

	missileUpgrade({upgradeMissiles}){
        var p = this.props;
        var bUpgrade = this.getLevelObj({upgrade:upgradeMissiles,unlockedLevel:p.missileUnlockedLevel++});
        p.unlockPoints -= bUpgrade.upCost;

        p.shipStats.missileAmount = bUpgrade.upValue;
        p.shipStats.missileCap = bUpgrade.upValue2;
        var nextBUpgrade = this.getLevelObj({upgrade:upgradeMissiles,unlockedLevel:p.missileUnlockedLevel});
        return nextBUpgrade;
    }

	checkMissileUpgrade({upgradeMissiles}){
	    var p = this.props;

        var bulletUpgrade = this.getLevelObj({upgrade:upgradeMissiles,unlockedLevel:p.missileUnlockedLevel});
        if(bulletUpgrade.upCost <= p.unlockPoints){
            return true;
        }

        return false;
	}

	getLevelObj({upgrade,unlockedLevel}){
        for (let key in upgrade) {
            if (upgrade.hasOwnProperty(key)) {
                var upgradeInstance = upgrade[key];
                if(upgradeInstance.l == unlockedLevel){
                    return upgradeInstance;
                }
            }
        }
        return undefined;
	}
	
	setupListeners(){
        pSub.subscribe(globe.REMOVEDASHER,this.removeDasher,this);
		pSub.subscribe(globe.REMOVEGLIDER,this.removeGlider,this);
		pSub.subscribe(globe.REMOVEKEEPER,this.removeKeeper,this);
		pSub.subscribe(globe.REMOVECARRIER,this.removeCarrier,this);
		pSub.subscribe(globe.POSTSCORE,this.updateHighestScore,this);
	}

	removeDasher(){
	    this.props.dashersKilled++;
	}
	removeGlider(){
	    this.props.glidersKilled++;
	}
	removeKeeper(){
	    this.props.beekeepersKilled++;
	}
	removeCarrier(){
	    this.props.carriersKilled++;
	}

	playing(){
	    if(this.props.isPlaying == true){
	        return true;
	    }else{
	        return false;
	    }

	}
}