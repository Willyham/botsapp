'use strict';

var TypedError = require('error/typed');
var WrappedError = require('error/wrapped');

var InvalidArgumentError = TypedError({
  type: 'argument.invalid',
  message: 'Invalid argument for `{argument}`. Given {given} expected {expected}',
  argument: null,
  given: null,
  expected: null
});

var ConnectionError = WrappedError({
  type: 'connection',
  message: 'Connection error: {origMessage}'
});

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  ConnectionError: ConnectionError
};
