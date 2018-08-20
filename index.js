var ASC = 'asc';
var DESC = 'desc';

/**
 * Make sure keys are an array of strings instead of string just to make it compatible
 * @param {string|Array} keys - key to sort or array of keys to sort
 * @returns {Array} - returns array of strings
 * @private
 */
function convertKeys(keys) {
  if (typeof keys === 'string') {
    return [keys];
  }
  return keys;
}

/**
 * Creates converter for each key either based on one converter or multiply for each of key
 * @param {function} keyConverter - callback function to be called on each of the key that will be sorted
 * @param {Array} keys - array of keys to sort
 * @returns {Array} - array of key converters
 * @private
 */
function convertKeyConverters(keyConverter, keys) {
  var i, j, keyConverters = [];

  // create dummy function
  var dummyConverter = function (value) {
    return value;
  };

  if (typeof keyConverter === 'undefined') {
    keyConverter = dummyConverter;
  }

  if (typeof keyConverter === 'function') {
    keyConverters = [keyConverter];
  } else if (keyConverter instanceof Array) {
    keyConverters = keyConverter;
  } else {
    throw new Error('converter needs to be a function or an array of functions');
  }
  if (keys.length > 1) {
    // if we have 1 converter and more keys it means we use this converter for all keys
    if (keyConverters.length === 1) {
      for (i = 1, j = keys.length; i < j; i++) {
        keyConverters.push(keyConverter);
      }
    } else if (keyConverters.length > 1) {
      if (keys.length !== keyConverters.length) {
        throw new Error('number of keys doesn\'t match number of key converters');
      }
    }
  }
  for (i = 0, j = keyConverters.length; i < j; i++) {
    if (typeof keyConverters[i] !== 'function') {
      keyConverters[i] = dummyConverter;
    }
  }

  return keyConverters;
}

/**
 * defines order for each of key
 * @param {string|Array} orderDirection - either 'asc' or 'desc' can be a single string or array of strings
 * @param {Array} keys - array of keys to sort
 * @returns {Array} - array of order directions for each key
 * @private
 */
function convertOrderDirections(orderDirection, keys) {
  var i, j, orderDirections = [];
  if (!orderDirection) {
    orderDirection = [ASC];
  } else if (typeof orderDirection === 'string') {
    orderDirection = [orderDirection];
  } else if (!(orderDirection instanceof Array)) {
    throw new Error('order is not correct');
  }

  if (keys.length > 1) {
    // if we have 1 order and more keys it means we use this order for all keys
    var defaultOrder;
    if (orderDirection.length === 1) {
      defaultOrder = orderDirection[0];
    } else {
      defaultOrder = ASC;
    }

    for (i = orderDirection.length, j = keys.length; i < j; i++) {
      orderDirection.push(defaultOrder);
    }
  }

  for (i = 0, j = orderDirection.length; i < j; i++) {
    orderDirections.push(getOrderDirectionByName(orderDirection[i]));
  }
  return orderDirections;
}

/**
 *
 * @param {string} orderDirection - either 'asc' or 'desc'
 * @returns {array} - returns array with definition needed for sorting
 * @private
 */
function getOrderDirectionByName(orderDirection) {
  var ascOrder = [1, -1, 0];
  var descOrder = [-1, 1, 0];
  if ((orderDirection || '').toLowerCase() === DESC) {
    return descOrder;
  }
  return ascOrder;
}

/**
 * Finally sorts the array
 * @param {string|Array} keys - key to sort or array of keys to sort
 * @param {Array} keyConverters - array of callback function to be called on each of the key so the value can be converted,
 * before being compared
 * @param {string|Array} orderDirections - how each of key should be sorted either string of array of string ('asc',
 *   'desc')
 * @param {number} keyNumber - used for recurrence sorting
 * @param {object} a - current value
 * @param {object} b - next value
 * @returns {number} number - return how the sort should be provided can be 1 -1 or 0
 * @private
 */
function makeSort(keys, keyConverters, orderDirections, keyNumber, a, b) {
  var key = keys[keyNumber];
  var keyConverter = keyConverters[keyNumber];

  var orderDirection = orderDirections[keyNumber];
  var valueA = keyConverter.call(a[key], a[key]);
  var valueB = keyConverter.call(b[key], b[key]);

  if (valueA > valueB) {
    return orderDirection[0];
  } else if (valueA < valueB) {
    return orderDirection[1];
  } else {
    if (keys.length > keyNumber + 1) {
      return makeSort(keys, keyConverters, orderDirections, keyNumber + 1, a, b);
    } else {
      return orderDirection[2];
    }
  }
}

/**
 * Sorts array of objects
 * @param {Array} array - array to be sorted
 * @param {string|Array} key - array of keys that the array should sorted against, can be also a single string if sorting only by one
 *   key
 * @param {string|Array} orderDirection - how each of key should be sorted - 'asc' or 'desc'. Can be a string or array of string which
 *   allows to define how each key should be sorted
 * @param {function|Array} keyConverter -  array of functions or function to be called on each of the value before it will be compared
 * @return {undefined}
 * @example
 * var arrayToBeSorted = [
 *   {name: 'John', surname: 'Smith', age: 23},
 *   {name: 'Alice', surname: 'Smith', age: 25},
 *   {name: 'Kristine', surname: 'Bean', age: 24},
 *   {name: 'Adam', surname: 'Bean', age: 34},
 *   {name: 'chris', surname: 'Bean', age: 14},
 *   {name: 'Chris', surname: 'Bean', age: 9}
 * ];
 *  arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc']);
 *  //[ { name: 'Adam', surname: 'Bean', age: 34 },
 *  //{ name: 'Chris', surname: 'Bean', age: 9 },
 *  //{ name: 'Kristine', surname: 'Bean', age: 24 },
 *  //{ name: 'chris', surname: 'Bean', age: 14 },
 *  //{ name: 'Alice', surname: 'Smith', age: 25 },
 *  //{ name: 'John', surname: 'Smith', age: 23 } ]
 *
 *  arrayObjectsSortBy(mockArr, ['surname', 'name', 'age'], ['asc', 'asc', 'desc'], [null, function (name) {
 *    return name.toUpperCase();
 *  }, null]);
 * //[ { name: 'Adam', surname: 'Bean', age: 34 },
 * //{ name: 'chris', surname: 'Bean', age: 14 },
 * //{ name: 'Chris', surname: 'Bean', age: 9 },
 * //{ name: 'Kristine', surname: 'Bean', age: 24 },
 * //{ name: 'Alice', surname: 'Smith', age: 25 },
 * //{ name: 'John', surname: 'Smith', age: 23 } ]
 */
function arrayObjectsSortBy(array, key, orderDirection, keyConverter) {
  if (arguments.length < 2) {
    return;
  }
  var keys = convertKeys(key);
  var orderDirections = convertOrderDirections(orderDirection, keys);
  var keyConverters = convertKeyConverters(keyConverter, keys);
  array.sort(makeSort.bind(null, keys, keyConverters, orderDirections, 0));
}

module.exports = arrayObjectsSortBy;