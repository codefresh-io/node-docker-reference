/* eslint-env mocha */
import {validateDigest} from '../src/digest';

describe('Digest Validation', () => {

    it('should validate valid digest with sha256', () => {
        validateDigest('sha256:e58fcf7418d4390dec8e8fb69d88c06ec07039d651fedd3aa72af9972e7d046b');
    });

    it('should validate valid digest with sha384', () => {
        validateDigest('sha384:d3fc7881460b7e22e3d172954463dddd7866d17597e7' +
                       '248453c48b3e9d26d9596bf9c4a9cf8072c9d5bad76e19af801d');
    });

    it('should throw error on empty hex digest', () => {
        expect(() => validateDigest('sha256:')).toThrow('invalid digest format');
    });

    it('should throw error on empty digest', () => {
        expect(() => validateDigest('')).toThrow('invalid digest format');
    });

    it('should throw error on digest with no algorithm', () => {
        expect(() => validateDigest('d41d8cd98f00b204e9800998ecf8427e'))
            .toThrow('invalid digest format');
    });

    it('should throw error on digest with invalid hex', () => {
        expect(() => validateDigest('sha256:d41d8cd98f00b204e9800m98ecf8427e'))
            .toThrow('invalid digest format');
    });

    it('should throw error on digest with shorted hex', () => {
        expect(() => validateDigest('sha256:abcdef0123456789'))
            .toThrow('invalid digest format');
    });

    it('should throw error on digest with shorted hex in other algorithm', () => {
        expect(() => validateDigest('sha512:abcdef0123456789abcdef012345' +
                                    '6789abcdef0123456789abcdef0123456789'))
            .toThrow('invalid checksum digest length');
    });

    it('should throw error on digest with unknown algorithm', () => {
        expect(() => validateDigest('foo:d41d8cd98f00b204e9800998ecf8427e'))
            .toThrow('unsupported digest algorithm');
    });

    it('should throw error on digest with repeated separator', () => {
        expect(() => validateDigest('sha384__foo+bar:d3fc7881460b7e22e3d172954463dddd7866d175' +
                                    '97e7248453c48b3e9d26d9596bf9c4a9cf8072c9d5bad76e19af801d'))
            .toThrow('invalid digest format');
    });
});

