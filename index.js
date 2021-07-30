'use strict';

const { Reference }                                       = require('./lib/reference');
const { parseQualifiedName, parseQualifiedNameOptimized, parseFamiliarName, parseAll } = require('./lib/parsers');

Object.assign(exports, {
    Reference,
    parseQualifiedName,
    parseQualifiedNameOptimized,
    parseFamiliarName,
    parseAll
});
