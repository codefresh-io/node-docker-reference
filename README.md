# Docker-Reference

A small package to parse and work with docker images references.

## Getting started

To use docker-reference you should start with creating a `Reference` instance:
``` js
const { Reference } = require('@codefresh-io/docker-reference');

const imageReference = new Reference({
    domain: 'r.cfcr.io',
    repository: 'codefresh/demochat',
    tag: 'master',
    digest: 'sha256:58fe87ff24d5a3ac35c887dcef82eb619565987c1083282f876c7c2657a5f94e'
});

console.log(imageReference.repositoryUrl); // r.cfcr.io/codefresh/demochat
console.log(imageReference.toString()); // r.cfcr.io/codefresh/demochat:master@sha256:58fe87ff24d5a3ac35c887dcef82eb619565987c1083282f876c7c2657a5f94e
```

## Using parsers

You can also use parser to create your `Reference` instance:
``` js
const { parseQualifiedName } = require('@codefresh-io/docker-reference');

const imageReference = parseQualifiedName('r.cfcr.io/codefresh/demochat:master@sha256:58fe87ff24d5a3ac35c887dcef82eb619565987c1083282f876c7c2657a5f94e');

console.log(imageReference.domain);     // r.cfcr.io
console.log(imageReference.repository); // codefresh/demochat
console.log(imageReference.tag);        // master
console.log(imageReference.digest);     // sha256:58fe87ff24d5a3ac35c887dcef82eb619565987c1083282f876c7c2657a5f94e
```

There are 3 parsers in the package:
 1. `parseQualifiedName`:

    This should be use when parsing a string representing a qualified image
    reference, meaning the string should contain at least the domain and the
    repository of the image.

 2. `parseFamiliarName`:

    This should be use when parsing a string representing a familiar image
    reference, meaning the string might not contains the domain part and this
    case the domain part would become `docker.io`. Also when the domain is
    missing and the repository contains only one part the repository would be
    prefixed with `library/`.

    **This parser would parse all qualified image reference the same as
    `parseQualifiedName` parser**

3. `parseAll`:

    This should be use when parsing a string representing a familiar image
    reference or identifier.

    **This parser would parse all qualified image reference the same as
    `parseQualifiedName` parser and parse every familiar image reference the
    same as `parseFamiliarName`**

## Grammer for the package

|  | pattaren |
| --- | --- |
| `reference` | `name [ ":" tag ] [ "@" digest ]` |
| `name` | `[domain '/'] path-component ['/' path-component]*` |
| `domain` | `domain-component ['.' domain-component]* [':' port-number]` |
| `domain-component` | `/([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])/` |
| `port-number` | `/[0-9]+/` |
| `path-component` | `alpha-numeric [separator alpha-numeric]*` |
| `alpha-numeric` | `/[a-z0-9]+/` |
| `separator` | `/[_.]|__|[-]*/` |
| `tag` | `/[\w][\w.-]{0,127}/` |
| `digest` | `digest-algorithm ":" digest-hex` |
| `digest-algorithm` | `digest-algorithm-component [ digest-algorithm-separator digest-algorithm-component ]*` |
| `digest-algorithm-separator` | `/[+.-_]/` |
| `digest-algorithm-component` | `/[A-Za-z][A-Za-z0-9]*/` |
| `digest-hex` | `/[0-9a-fA-F]{32,}/` (At least 128 bit digest value) |
| `identifier` | `/[a-f0-9]{64}/` |
| `short-identifier` | `/[a-f0-9]{6,64}/` |
