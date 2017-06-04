'use strict';

const { Reference }                                       = require('./lib/reference');
const { parseQualifiedName, parseFamiliarName, parseAll } = require('./lib/parsers');

Object.assign(exports, {
    Reference,
    parseQualifiedName,
    parseFamiliarName,
    parseAll
});
