require('es6-promise').polyfill();
import axios from 'axios';
var debug = process.env.DEBUG_NODE ? 'http://localhost:4000' : null;

export default function helperQuery(url, type, response, objectToSend, toDelete) {
  if (debug && url.charAt(0) === '/') url = debug + url;
  return dispatch => {
    var promise = (!objectToSend) ? 
      axios.get(url) : (!toDelete) ? 
      axios.post(url, objectToSend) : axios.delete(url);
    return promise
      .then((result) => {
        if (result.data.errors) {
          console.log('Err');
          dispatch({
            type: type,
            error: result.data.errors,
          })
          return;
        }
        dispatch({
          type: type,
          result: response ? result.data[response] : result.data,
        });
      });
    };
}