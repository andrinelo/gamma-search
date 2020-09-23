import { FETCH_FULL_RESULTS } from "./types.js";

// Redux actions.

export function fetchFullResults(gremlinQuery) {

  var xhttp = new XMLHttpRequest();
  var url = 'http://localhost:3000/api';
  xhttp.open('POST', url, true);
  //xhttp.withCredentials = false;
  
  xhttp.setRequestHeader('Authorization', 'Token token=5025706857394e28ab294f1bd8c482cb');
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.setRequestHeader('Accept', 'application/json');
  
  xhttp.onreadystatechange = function() { 
    if (this.readyState === 4 && this.status === 200) {
      alert(xhttp.responseText);
    }
  }

  //if (this.readyState === 4 && this.status === 201) {
    //console.log(JSON.parse(xhttp.response).result);    
  //}
  
  xhttp.send(gremlinQuery);
  
  return{results: JSON.parse(xhttp.response).result, type: FETCH_FULL_RESULTS}
};
