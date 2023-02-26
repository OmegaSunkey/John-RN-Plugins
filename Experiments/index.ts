import { Plugin } from "aliucord/entities";
import { getByProps, UserStore, FluxDispatcher } from "aliucord/metro";

export default class Experiments extends Plugin {
    public enableExperiments() {
        var actions = getByProps('_actionHandlers')._actionHandlers["_orderedActionHandlers"]["CONNECTION_OPEN"];
        var user = UserStore.getCurrentUser();
        actions.find(n => n.name === "ExperimentStore").actionHandler({
            type: "CONNECTION_OPEN", user: { flags: user.flags |= 1 }, experiments: [],
        });
        actions.find(n => n.name === "DeveloperExperimentStore").actionHandler();
        user.flags &= ~1;
    }
    
    public sleep(milliseconds) {
  	var start = new Date().getTime();
  	for (var i = 0; i < 1e7; i++) {
    	if ((new Date().getTime() - start) > milliseconds){
      	break;
    	}
  	}
	}
    
    public handleConnect() {
	try {
                const handleThis = () => {
                    FluxDispatcher.unsubscribe("CONNECTION_OPEN", handleThis);
                    this.enableExperiments()
                }

                FluxDispatcher.subscribe("CONNECTION_OPEN", handleThis);
            } catch (error) {
                this.logger.error((error as Error).stack)
            }
    } 
    
    public async start() {
    	this.sleep(10000)
        if (UserStore.getCurrentUser()) {
        	//this.sleep 
            this.enableExperiments()
            } else {
        	this.sleep(10000)
            this.handleConnect()
        }
    }
}
