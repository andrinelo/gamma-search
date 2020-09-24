import {useState, useEffect, useCallback} from 'react';
function useQuery(input=undefined){
  async function postData(data = {}) {
      //let correctData = (typeof data === 'object' ) ? JSON.stringify(data) : data;
      let correctData = JSON.stringify({"query": data})
      const response = await fetch('http://localhost:3000/api', {
        method: 'POST',                                             // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',                                               // no-cors, *cors, same-origin
        cache: 'no-cache',                                          // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',                                 // include, *same-origin, omit
        headers: {
          'Authorization': 'Token token=5025706857394e28ab294f1bd8c482cb',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        redirect: 'follow',                                         // manual, *follow, error
        referrerPolicy: 'no-referrer',                              // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: correctData                                  // body data type must match "Content-Type" header
      });
      
    return response;
  }

  const [result, setResult] = useState({status:"not called", result:undefined, count:undefined, from:undefined, size:undefined});

  function RunQuery(queryInput) {
    const fetchMyAPI = useCallback(async() => {
      let response = await postData(queryInput)
      response = await response.json()
      setResult(response)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    
    useEffect(() => {
      fetchMyAPI()
    }, [fetchMyAPI])
  }

  if (input === undefined){
    return [RunQuery, result];
  }
  else{
    RunQuery(input);
    return result
  }
}
  

export default useQuery;