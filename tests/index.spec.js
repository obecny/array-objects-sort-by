var arrayObjectsSortBy = require("../index");

var arrayToBeSorted = [
  {name: 'John', surname: 'Smith', age: 23},
  {name: 'Alice', surname: 'Smith', age: 25},
  {name: 'Kristine', surname: 'Bean', age: 24},
  {name: 'Adam', surname: 'Bean', age: 34},
  {name: 'chris', surname: 'Bean', age: 14},
  {name: 'Chris', surname: 'Bean', age: 9}
];

describe("index.js", function () {
  var mockArr;
  beforeEach(function () {
    mockArr = arrayToBeSorted.map(function (result) {
      return result;
    });
  });
  it("should sort using keys and different order", function () {
    arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc']);
    expect(mockArr[3]).toEqual(arrayToBeSorted[4]);
  });
  it("should sort using keys, different order and key converter", function () {
    arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc'], [null, function (name) {
      return name.toUpperCase();
    }, null]);
    expect(mockArr[3]).toEqual(arrayToBeSorted[2]);
  });
});