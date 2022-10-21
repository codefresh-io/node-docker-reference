import {Reference} from './reference';

import {parseAll, parseFamiliarName, parseQualifiedName, parseQualifiedNameOptimized} from './parsers';

// please export like this to work fine with typescript definitions
export {
    Reference,
    parseQualifiedName,
    parseQualifiedNameOptimized,
    parseFamiliarName,
    parseAll
}
