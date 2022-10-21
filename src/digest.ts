import {anchoredDigestRegexp} from './regexp';

class InvalidDigestFormatError extends Error {
    constructor() {
        super('invalid digest format');
        this.name = 'InvalidDigestFormatError';
    }
}

class UnsupportedAlgorithmError extends Error {
    constructor() {
        super('unsupported digest algorithm');
        this.name = 'UnsupportedAlgorithmError';
    }
}

class InvalidDigestLengthError extends Error {
    constructor() {
        super('invalid checksum digest length');
        this.name = 'InvalidDigestLengthError';
    }
}

const algorithmsSizes  ={
    sha256: 32,
    sha384: 48,
    sha512: 64,
}

type AlgorithmsSizes = keyof typeof algorithmsSizes
type ErrorHandler = <TError extends Error>(t: new () => TError) => void

function checkDigest(digest: string, handleError: ErrorHandler) {
    const indexOfColon = digest.indexOf(':');
    if (indexOfColon < 0 ||
        indexOfColon + 1 === digest.length ||
        !anchoredDigestRegexp.test(digest)) {
        return handleError(InvalidDigestFormatError);
    }

    const algorithm = digest.substring(0, indexOfColon) as AlgorithmsSizes;

    if (!Object.hasOwnProperty.call(algorithmsSizes, algorithm)) {
        return handleError(UnsupportedAlgorithmError);
    }

    if (algorithmsSizes[algorithm] * 2 !== (digest.length - indexOfColon - 1)) {
        return handleError(InvalidDigestLengthError);
    }

    return true;
}

const validateDigest = (digest: string) => {
    checkDigest(digest, (ErrorType) => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new ErrorType();
    });
};

const isDigest = (digest: string) => {
    return checkDigest(digest, () => false);
};

export {
    validateDigest,
    isDigest
}
