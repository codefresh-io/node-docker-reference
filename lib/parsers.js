"use strict";

let RE2;

try {
  RE2 = require("re2");
  // Test if native is working
  new RE2(".*").exec("test");
  console.log("Using RE2 as regex engine");
  RegEx = RE2;
} catch (err) {
  console.log("RE2 not usable, falling back to RegExp");
  RE2 = RegExp;
}

const {
  referenceRegexp,
  anchoredNameRegexp,
  anchoredIdentifierRegexp,
} = require("./regexp");
const { validateDigest, isDigest } = require("./digest");
const { Reference } = require("./reference");

const NAME_MAX_LENGTH = 255;

class InvalidReferenceFormatError extends Error {
  constructor() {
    super("invalid reference format");
    this.name = "InvalidReferenceFormatError";
  }
}

class NameContainsUppercaseError extends Error {
  constructor() {
    super("repository name must be lowercase");
    this.name = "NameContainsUppercaseError";
  }
}

class EmptyNameError extends Error {
  constructor() {
    super("repository name must have at least one component");
    this.name = "EmptyNameError";
  }
}

class NameTooLongError extends Error {
  constructor() {
    super(
      `repository name must not be more than ${NAME_MAX_LENGTH} characters`
    );
    this.name = "NameTooLongError";
  }
}

const DEFAULT_DOMAIN = "docker.io";
const LEGACY_DEFAULT_DOMAIN = "index.docker.io";
const OFFICIAL_REPOSITORY_NAME = "library";

function _parseQualifiedName(regexp, name) {
  const matches = regexp.exec(name);

  if (!matches) {
    if (name === "") {
      throw new EmptyNameError();
    }

    if (regexp.test(name.toLowerCase())) {
      throw new NameContainsUppercaseError();
    }

    throw new InvalidReferenceFormatError();
  }

  if (matches[1].length > NAME_MAX_LENGTH) {
    throw new NameTooLongError();
  }

  let reference;

  const nameMatch = anchoredNameRegexp.exec(matches[1]);
  if (nameMatch && nameMatch.length === 3) {
    reference = {
      domain: nameMatch[1],
      repository: nameMatch[2],
    };
  } else {
    reference = {
      domain: "",
      repository: matches[1],
    };
  }

  reference.tag = matches[2];

  if (matches[3]) {
    validateDigest(matches[3]);
    reference.digest = matches[3];
  }

  return new Reference(reference);
}

exports.parseQualifiedNameOptimized = (name) => {
  return _parseQualifiedName(new RE2(referenceRegexp), name);
};

exports.parseQualifiedName = (name) => {
  return _parseQualifiedName(referenceRegexp, name);
};

function splitDockerDomain(name) {
  let domain;
  let reminder;

  const indexOfSlash = name.indexOf("/");
  if (
    indexOfSlash === -1 ||
    !(
      name.lastIndexOf(".", indexOfSlash) !== -1 ||
      name.lastIndexOf(":", indexOfSlash) !== -1 ||
      name.startsWith("localhost/")
    )
  ) {
    domain = DEFAULT_DOMAIN;
    reminder = name;
  } else {
    domain = name.substring(0, indexOfSlash);
    reminder = name.substring(indexOfSlash + 1);
  }

  if (domain === LEGACY_DEFAULT_DOMAIN) {
    domain = DEFAULT_DOMAIN;
  }

  if (domain === DEFAULT_DOMAIN && !reminder.includes("/")) {
    reminder = `${OFFICIAL_REPOSITORY_NAME}/${reminder}`;
  }

  return [domain, reminder];
}

exports.parseFamiliarName = (name, parseQualifiedNameFunc) => {
  if (anchoredIdentifierRegexp.test(name)) {
    throw new TypeError(
      `invalid repository name (${name}),` +
        `cannot specify 64-byte hexadecimal strings`
    );
  }

  const [domain, remainder] = splitDockerDomain(name);

  let remoteName;
  const tagSeparatorIndex = remainder.indexOf(":");
  if (tagSeparatorIndex > -1) {
    remoteName = remainder.substring(0, tagSeparatorIndex);
  } else {
    remoteName = remainder;
  }

  if (remoteName.toLowerCase() !== remoteName) {
    throw new TypeError(
      `invalid reference format: repository name must be lowercase`
    );
  }

  if (parseQualifiedNameFunc) {
    // ability to define custom park func , we have performance
    // issue with old one and we need a way to override
    // it for prevent use js native regexp
    return parseQualifiedNameFunc(`${domain}/${remainder}`);
  }

  return exports.parseQualifiedName(`${domain}/${remainder}`);
};

exports.parseAll = (name) => {
  if (anchoredIdentifierRegexp.test(name)) {
    return new Reference({ digest: `sha256:${name}` });
  }

  if (isDigest(name)) {
    return new Reference({ digest: name });
  }

  return exports.parseFamiliarName(name);
};
