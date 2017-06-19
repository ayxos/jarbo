import objectAssign from 'object-assign'
import initialState from './initialState'

function getIndexOfItem(action, state) {
    console.log(111,action, state)
  let index = -1, data = action.result;

  for (let i = 0; i < state.result.length; i++) {
    if (state.result[i]._id === data._id) {
      index = i;
      break;
    }
  }

  return index;
}

export default function customStateSwitcher(typeName, SINGLE, ALL, CREATE, EDIT, REMOVE) {
    return function(state = initialState, action) {
        let newState
        if (action.error) {
            return {
                result: state.result,
                error: action.error,
            };
        }
        switch(action.type) {
            case SINGLE:
                return [action.result];
            case ALL:
                return action.result;
            case CREATE:
                return [
                    ...state,
                    action.result
                ]
            case EDIT:
                return [Object.assign({}, state, action.result)];
            case REMOVE:
                var index = getIndexOfItem(action, state);
                // todo item not found in state object so return original state
                if (index === -1) return state;

                // todo item found! don't include it in the new state
                return {
                    result: [
                    ...state.result.slice(0, index),
                    ...state.result.slice(index + 1)
                    ],
                };
            default:
                return state;
        }
    }
}