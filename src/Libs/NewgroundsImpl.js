/* 
 *  Created by Shane Walsh
 *  https://bitbucket.org/newgrounds/newgrounds.io-for-javascript-html5
 */

export default class NewgroundsImpl{
    constructor({api,key}){
		this.props ={
			ngio:new Newgrounds.io.core(api, key),
			medals:undefined,
			scoreboards:undefined,
			scoreboardId:7367,
			loggedIn:false,
		}
    }

    onLoggedIn() {
        logg("Welcome " + this.props.ngio.user.name + "!");
        this.props.loggedIn = true;
    }

    onLoggedInTwo() {
        this.props.loggedIn = true;
        window.displayMenu();
    }

    onLoginFailed() {
        logg("There was a problem logging in: " . ngio.login_error.message );
    }

    onLoginCancelled() {
        logg("The user cancelled the login.");
    }

    initSession() {
        var p = this.props
        var self = this;
        p.ngio.getValidSession(function() {
            if (p.ngio.user) {
                /*
                 * If we have a saved session, and it has not expired,
                 * we will also have a user object we can access.
                 * We can go ahead and run our onLoggedIn handler here.
                 */
                self.onLoggedIn();
            } else {
                /*
                 * If we didn't have a saved session, or it has expired
                 * we should have been given a new one at this point.
                 * This is where you would draw a 'sign in' button and
                 * have it execute the following requestLogin function.
                 */
                 // I dont have to do anything, becasuse its false by default.
            }

        });
    }

    /*
     * Call this when the user clicks a 'sign in' button from your game.  It MUST be called from
     * a mouse-click event or pop-up blockers will prevent the Newgrounds Passport page from loading.
     */
    requestLogin() {
        this.props.ngio.requestLogin(this.onLoggedInTwo.bind(this), this.onLoginFailed.bind(this), this.onLoginCancelled.bind(this));
    }

    /*
     * If your user is logged in, you should also draw a 'sign out' button for them
     * and have it call this.
     */
    logOut() {
        this.props.ngio.logOut(function() {
            /*
             * Because we have to log the player out on the server, you will want
             * to handle any post-logout stuff in this function, wich fires after
             * the server has responded.
             */
        });
    }

	loadAll(){
		this.startSession();
		this.loadMedals();
		this.loadScoreBoards();
		this.loadHighScores();
		//console.log(this);
	}

    /* handle loaded medals */
    onPostedScore(result) {
        if (result.success) {
            //console.log(result);
        }
        else{
            //console.log("feck");
            //console.log(result);
        }
    }

    /* handle loaded top 10 */
    onTopTen(result) {
        if (result.success) {
            window.setTopTen(result.scores);
        }
    }


	postScore(topic, {score}){
	    if (!this.props.ngio.user) return;
	    this.props.ngio.callComponent('ScoreBoard.postScore', {id:this.props.scoreboardId, value:score},this.onPostedScore);
	   // this.props.ngio.queueComponent("ScoreBoard.postScore", {id:this.props.scoreboardId,value:score}, this.onScoreboardsLoaded.bind(this));
        //this.props.ngio.executeQueue();
	}

	onMedalUnlocked(medal) {
        logg('MEDAL GET:', medal.name);
    }

	unlockMedal(medal_name) {
        var p = this.props;
        /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
        if (!p.ngio.user) return;
        var medal;
        for (var i = 0; i < p.medals.length; i++) {
            medal = p.medals[i];
            /* look for a matching medal name */
            if (medal.name == medal_name) {
                /* we can skip unlocking a medal that's already been earned */
                if (!medal.unlocked) {
                    var self = this;
                    /* unlock the medal from the server */
                    p.ngio.callComponent('Medal.unlock', {id:medal.id}, function(result) {

                        if (result.success) self.onMedalUnlocked(result.medal);

                    });
                }

                return;
            }
        }
    }



	/* handle loaded medals */
	onSessionLoaded(result) {
		if (result.success) this.props.session = result.session;
	}

	/* handle loaded medals */
	onMedalsLoaded(result) {
		if (result.success) this.props.medals = result.medals;
	}

	/* handle loaded scores */
	onScoreboardsLoaded(result) {
		if (result.success){
		    this.props.scoreboards = result.scoreboards;
		    //console.log(result.scoreboards);
		    this.loadHighScores();
		}
	}

	startSession(){
		this.props.ngio.queueComponent("App.startSession", {}, this.onSessionLoaded.bind(this));
		this.props.ngio.executeQueue();
	}

	loadMedals(){
		this.props.ngio.queueComponent("Medal.getList", {}, this.onMedalsLoaded.bind(this));
		this.props.ngio.executeQueue();
	}
	
	loadScoreBoards(){
		this.props.ngio.queueComponent("ScoreBoard.getBoards", {}, this.onScoreboardsLoaded.bind(this));
		this.props.ngio.executeQueue();
	}

	loadHighScores(){
        this.props.ngio.callComponent('ScoreBoard.getScores', {id:this.props.scoreboardId,period:"A"},this.onTopTen);
	}
}


