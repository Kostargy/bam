import fs from 'fs';

const io = {
    readActionsFile(path) {
        /*
        action_obj = {
            completed: <boolean>,
            name: <string>,
            date: <date dd-mm-yyyy>
        }
        */
        let action_txt;
        let actions_arr = [];
        let data = fs.readFileSync(path, 'utf-8');
        try {
                action_txt = data.toString().split('\n');
        } catch (error) {
            console.log(error);

                // an error occured return empy array
                return [];
        }
        if (action_txt == null || action_txt[0] == '') {
            // the action file is empty
            return [];
        }
        actions_arr = io.parseActionArray(action_txt);
        return actions_arr;
    },
    parseActionArray(actions) {
        let action_arr = [];

        for (let i = 0; i < actions.length; i++) {
            let action = {
                name: null,
                date: null,
                completed: null
            }
            const j = actions[i];
            // get checkbox
            let checkbox = j.split(']')[0];
            if(checkbox.length >=2){
                action.completed = true;
            }else{
                action.completed = false;
            }

            action.name = j.substring(
                j.lastIndexOf(']') + 1,
                j.lastIndexOf('//')
            );
            action.date = j.split('//')[1];

            if(action.name && action.date){
                action_arr.push(action);
            }
        }

        return action_arr;
    }
}

export default io