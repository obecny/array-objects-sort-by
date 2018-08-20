## Array Objects Sort By - function for sorting array of objects with advanced options

### Example

```$javascript
var arrayToBeSorted = [
  {name: 'John', surname: 'Smith', age: 23},
  {name: 'Alice', surname: 'Smith', age: 25},
  {name: 'Kristine', surname: 'Bean', age: 24},
  {name: 'Adam', surname: 'Bean', age: 34},
  {name: 'chris', surname: 'Bean', age: 14},
  {name: 'Chris', surname: 'Bean', age: 9}
];
 arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc']);
 //[ { name: 'Adam', surname: 'Bean', age: 34 },
 //{ name: 'Chris', surname: 'Bean', age: 9 },
 //{ name: 'Kristine', surname: 'Bean', age: 24 },
 //{ name: 'chris', surname: 'Bean', age: 14 },
 //{ name: 'Alice', surname: 'Smith', age: 25 },
 //{ name: 'John', surname: 'Smith', age: 23 } ]

 arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc'], [null, function (name) {
   return name.toUpperCase();
 }, null]);
//[ { name: 'Adam', surname: 'Bean', age: 34 },
//{ name: 'chris', surname: 'Bean', age: 14 },
//{ name: 'Chris', surname: 'Bean', age: 9 },
//{ name: 'Kristine', surname: 'Bean', age: 24 },
//{ name: 'Alice', surname: 'Smith', age: 25 },
//{ name: 'John', surname: 'Smith', age: 23 } ]

```
