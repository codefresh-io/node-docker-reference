/* eslint-env mocha */
import {parseQualifiedName} from '../src';

describe('Qualified name parser', () => {

    it('should parse repository only', () => {
        const reference = parseQualifiedName('test_com');

        expect(reference.type).toEqual('repository');
        expect(reference.repository).toEqual('test_com');
    });

    it('should parse tagged name', () => {
        const reference = parseQualifiedName('test.com:tag');

        expect(reference.type).toEqual('tagged');
        expect(reference.repository).toEqual('test.com');
        expect(reference.tag).toEqual('tag');
    });

    it('should parse tagged name which looks like port', () => {
        const reference = parseQualifiedName('test.com:5000');

        expect(reference.type).toEqual('tagged');
        expect(reference.repository).toEqual('test.com');
        expect(reference.tag).toEqual('5000');
    });

    it('should parse tagged name with domain', () => {
        const reference = parseQualifiedName('test.com/repo:tag');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('test.com');
        expect(reference.repository).toEqual('repo');
        expect(reference.tag).toEqual('tag');
    });

    it('should parse repository only name with domain and port', () => {
        const reference = parseQualifiedName('test.com:5000/repo');

        expect(reference.type).toEqual('repository');
        expect(reference.domain).toEqual('test.com:5000');
        expect(reference.repository).toEqual('repo');
    });

    it('should parse tagged name with domain and port', () => {
        const reference = parseQualifiedName('test:5000/repo:tag');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('test:5000');
        expect(reference.repository).toEqual('repo');
        expect(reference.tag).toEqual('tag');
    });

    it('should parse name with digest', () => {
        const reference = parseQualifiedName('test:5000/repo@sha256:fffffffffffffffffffff' +
                                             'fffffffffffffffffffffffffffffffffffffffffff');

        expect(reference.type).toEqual('canonical');
        expect(reference.domain).toEqual('test:5000');
        expect(reference.repository).toEqual('repo');
        expect(reference.digest).toEqual('sha256:ffffffffffffffffffffffffffff' +
                                          'ffffffffffffffffffffffffffffffffffff');
    });

    it('should parse name with digest and tag', () => {
        const reference = parseQualifiedName('test:5000/repo:tag@sha256:fffffffffffffffffff' +
                                             'fffffffffffffffffffffffffffffffffffffffffffff');

        expect(reference.type).toEqual('dual');
        expect(reference.domain).toEqual('test:5000');
        expect(reference.repository).toEqual('repo');
        expect(reference.tag).toEqual('tag');
        expect(reference.digest).toEqual('sha256:ffffffffffffffffffffffffffff' +
                                          'ffffffffffffffffffffffffffffffffffff');
    });

    it('should throw error when parsing empty name', () => {
        expect(() => parseQualifiedName(''))
            .toThrow('repository name must have at least one component');
    });

    it('should throw error when parsing just a tag', () => {
        expect(() => parseQualifiedName(':justtag')).toThrow('invalid reference format');
    });

    it('should throw error when parsing just a digest', () => {
        expect(() => parseQualifiedName('@sha256:ffffffffffffffffffffffffffff' +
                                        'ffffffffffffffffffffffffffffffffffff'))
            .toThrow('invalid reference format');
    });

    it('should throw error when parsing name with short digest', () => {
        expect(() => parseQualifiedName('repo@sha256:ffffffffffffffffffffffffffffffffff'))
            .toThrow('invalid checksum digest length');
    });

    it('should throw error when parsing name with invalid digest', () => {
        expect(() => parseQualifiedName('validname@invaliddigest:ffffffffffffffffffff' +
                                        'ffffffffffffffffffffffffffffffffffffffffffff'))
            .toThrow('unsupported digest algorithm');
    });

    it('should throw error when parsing name with capitals letters', () => {
        expect(() => parseQualifiedName('Uppercase:tag'))
            .toThrow('repository name must be lowercase');
    });

    it('should throw error when parsing name with domain and capitals letters', () => {
        expect(() => parseQualifiedName('test:5000/Uppercase/lowercase:tag'))
            .toThrow('repository name must be lowercase');
    });

    it('should not throw error when parsing name with capitals letters in the tag', () => {
        const reference = parseQualifiedName('lowercase:Uppercase');

        expect(reference.type).toEqual('tagged');
        expect(reference.repository).toEqual('lowercase');
        expect(reference.tag).toEqual('Uppercase');
    });

    it('should throw error when parsing a long name', () => {
        expect(() => parseQualifiedName(`${new Array(129).fill('a').join('/')}:tag`))
            .toThrow('repository name must not be more than 255 characters');
    });

    it('should not throw error when parsing name with over the max tag', () => {
        const reference = parseQualifiedName(`${new Array(128).fill('a').join('/')}` +
                                             `:tag-puts-this-over-max`);

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('a');
        expect(reference.repository).toEqual(new Array(127).fill('a').join('/'));
        expect(reference.tag).toEqual('tag-puts-this-over-max');
    });

    it('should throw error when parsing an invalid name', () => {
        expect(() => parseQualifiedName('aa/asdf$$^/aa')).toThrow('invalid reference format');
    });

    it('should parse valid name 1', () => {
        const reference = parseQualifiedName('sub-dom1.foo.com/bar/baz/quux');

        expect(reference.type).toEqual('repository');
        expect(reference.domain).toEqual('sub-dom1.foo.com');
        expect(reference.repository).toEqual('bar/baz/quux');
    });

    it('should parse valid name 2', () => {
        const reference = parseQualifiedName('sub-dom1.foo.com/bar/baz/quux:some-long-tag');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('sub-dom1.foo.com');
        expect(reference.repository).toEqual('bar/baz/quux');
        expect(reference.tag).toEqual('some-long-tag');
    });

    it('should parse valid name 3', () => {
        const reference = parseQualifiedName('b.gcr.io/test.example.com/my-app:test.example.com');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('b.gcr.io');
        expect(reference.repository).toEqual('test.example.com/my-app');
        expect(reference.tag).toEqual('test.example.com');
    });

    it('should parse valid name 4', () => {
        const reference = parseQualifiedName('xn--n3h.com/myimage:xn--n3h.com');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('xn--n3h.com');
        expect(reference.repository).toEqual('myimage');
        expect(reference.tag).toEqual('xn--n3h.com');
    });

    it('should parse valid name 5', () => {
        const reference = parseQualifiedName('xn--7o8h.com/myimage:xn--7o8h.com@sha512:fffffffff' +
                                             'ffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                             'ffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                             'fffffffffffffffffff');

        expect(reference.type).toEqual('dual');
        expect(reference.domain).toEqual('xn--7o8h.com');
        expect(reference.repository).toEqual('myimage');
        expect(reference.tag).toEqual('xn--7o8h.com');
        expect(reference.digest).toEqual('sha512:ffffffffffffffffffffffffffffffffffffffffffffff' +
                                          'fffffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                          'fffffffffffffffffffffffffffff');
    });

    it('should parse valid name 6', () => {
        const reference = parseQualifiedName('foo_bar.com:8080');

        expect(reference.type).toEqual('tagged');
        expect(reference.repository).toEqual('foo_bar.com');
        expect(reference.tag).toEqual('8080');
    });

    it('should parse valid name 7', () => {
        const reference = parseQualifiedName('foo/foo_bar.com:8080');

        expect(reference.type).toEqual('tagged');
        expect(reference.domain).toEqual('foo');
        expect(reference.repository).toEqual('foo_bar.com');
        expect(reference.tag).toEqual('8080');
    });
});
