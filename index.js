'use strict';

const { Reference }                                       = require('./lib/reference');
const { parseQualifiedName, parseQualifiedNameOptimized, parseFamiliarName, parseAll } = require('./lib/parsers');

// please export like this to work fine with typescript definitions
exports.Reference = Reference;
exports.parseQualifiedName = parseQualifiedName;
exports.parseQualifiedNameOptimized = parseQualifiedNameOptimized;
exports.parseFamiliarName = parseFamiliarName;
exports.parseAll = parseAll;
