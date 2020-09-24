# Gamma Search
Tool for graph based search.

Developed for Ardoq AS as a part of the course

TDT4290 - Customer Driven Project

at the Norwegian University of Science and Technology.




### Getting data from Ardoq
Firstly, remember to run npm install to get the proxy-adress in pacakge.json.

To send queries to Ardoqs database, simply import useQuery from queryManager. To start sending queries, all you have to do is enter:
```javascript
const queryData = useQuery("g.V().limit(10)");
```

And that's it!

Whenever the program runs that line, it will load the data. However, you might want to fetch the data conditionally, for example build the query step by step and not fetch the data before the query is complete. To do this, use this hook instead:
```javascript
const [executeQuery, queryData] = useQuery();
//onAction or when query is ready you then run:
executeQuery("g.V().limit(10)");
//And your data will appear in queryData:
console.log(queryData);
```
Note that the variable names "queryData" and "executeQuery" are not connected to the queryManager. You can use whatever names you want, so name them something convenient! 

Example:
```javascript
const personData = useQuery("g.V().hasLabel('Person').limit(10)");
```
```javascript
const [getPersonData,personData] = useQuery();
getPersonData("g.V().hasLabel('Person').limit(10)");
```

If you for some reason want to change the access token for Ardoqs database, you can change that in queryManager.js