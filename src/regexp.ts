/**
 * expression defines a full expression, where each regular expression must follow the previous.
 */
const expression = (...regexps: RegExp[]) => new RegExp(regexps
    .map(re => re.source)
    .join(''));

/**
 * group wraps the regexp in a non-capturing group.
 */
const group = (...regexps: RegExp[]) => new RegExp(`(?:${expression(...regexps).source})`);

/**
 * repeated wraps the regexp in a non-capturing group to get one or more matches.
 */
const optional = (...regexps: RegExp[]) => new RegExp(`${group(...regexps).source}?`);

/**
 * repeated wraps the regexp in a non-capturing group to get one or more matches.
 */
const repeated = (...regexps: RegExp[]) => new RegExp(`${group(...regexps).source}+`);

/**
 * anchored anchors the regular expression by adding start and end delimiters.
 */
const anchored = (...regexps: RegExp[]) => new RegExp(`^${expression(...regexps).source}$`);

/**
 * capture wraps the expression in a capturing group.
 */
const capture = (...regexps: RegExp[]) => new RegExp(`(${expression(...regexps).source})`);

const alphaNumericRegexp = /[a-z0-9]+/;
const separatorRegexp    = /(?:[._]|__|[-]*)/;

const nameComponentRegexp = expression(
    alphaNumericRegexp,
    optional(repeated(separatorRegexp, alphaNumericRegexp))
);

const domainComponentRegexp = /(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])/;

const domainRegexp = expression(
    domainComponentRegexp,
    optional(repeated(/\./, domainComponentRegexp)),
    optional(/:/, /[0-9]+/)
);

const tagRegexp = /[\w][\w.-]{0,127}/;

const digestRegexp = /[a-zA-Z][a-zA-Z0-9]*(?:[-_+.][a-zA-Z][a-zA-Z0-9]*)*[:][a-fA-F0-9]{32,}/;

const anchoredDigestRegexp = anchored(digestRegexp);

const nameRegexp = expression(
    optional(domainRegexp, /\//),
    nameComponentRegexp,
    optional(repeated(/\//, nameComponentRegexp))
);

const anchoredNameRegexp = anchored(
    optional(capture(domainRegexp), /\//),
    capture(nameComponentRegexp, optional(repeated(/\//, nameComponentRegexp)))
);

const referenceRegexp = anchored(
    capture(nameRegexp),
    optional(/:/, capture(tagRegexp)),
    optional(/@/, capture(digestRegexp))
);

const identifierRegexp = /[a-f0-9]{64}/;

const anchoredIdentifierRegexp = anchored(identifierRegexp);
export {
    referenceRegexp,
    anchoredNameRegexp,
    anchoredDigestRegexp,
    anchoredIdentifierRegexp
}
