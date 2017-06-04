'use strict';

/* eslint-env mocha */

const chai = require('chai');
const { parseQualifiedName } = require('../lib/parsers');

const expect = chai.expect;

describe('Qualified name parser', () => {

    it('should parse repository only', () => {
        const reference = parseQualifiedName('test_com');

        expect(reference.type).to.equal('repository');
        expect(reference.repository).to.equal('test_com');
    });

    it('should parse tagged name', () => {
        const reference = parseQualifiedName('test.com:tag');

        expect(reference.type).to.equal('tagged');
        expect(reference.repository).to.equal('test.com');
        expect(reference.tag).to.equal('tag');
    });

    it('should parse tagged name which looks like port', () => {
        const reference = parseQualifiedName('test.com:5000');

        expect(reference.type).to.equal('tagged');
        expect(reference.repository).to.equal('test.com');
        expect(reference.tag).to.equal('5000');
    });

    it('should parse tagged name with domain', () => {
        const reference = parseQualifiedName('test.com/repo:tag');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('test.com');
        expect(reference.repository).to.equal('repo');
        expect(reference.tag).to.equal('tag');
    });

    it('should parse repository only name with domain and port', () => {
        const reference = parseQualifiedName('test.com:5000/repo');

        expect(reference.type).to.equal('repository');
        expect(reference.domain).to.equal('test.com:5000');
        expect(reference.repository).to.equal('repo');
    });

    it('should parse tagged name with domain and port', () => {
        const reference = parseQualifiedName('test:5000/repo:tag');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('test:5000');
        expect(reference.repository).to.equal('repo');
        expect(reference.tag).to.equal('tag');
    });

    it('should parse name with digest', () => {
        const reference = parseQualifiedName('test:5000/repo@sha256:fffffffffffffffffffff' +
                                             'fffffffffffffffffffffffffffffffffffffffffff');

        expect(reference.type).to.equal('canonical');
        expect(reference.domain).to.equal('test:5000');
        expect(reference.repository).to.equal('repo');
        expect(reference.digest).to.equal('sha256:ffffffffffffffffffffffffffff' +
                                          'ffffffffffffffffffffffffffffffffffff');
    });

    it('should parse name with digest and tag', () => {
        const reference = parseQualifiedName('test:5000/repo:tag@sha256:fffffffffffffffffff' +
                                             'fffffffffffffffffffffffffffffffffffffffffffff');

        expect(reference.type).to.equal('dual');
        expect(reference.domain).to.equal('test:5000');
        expect(reference.repository).to.equal('repo');
        expect(reference.tag).to.equal('tag');
        expect(reference.digest).to.equal('sha256:ffffffffffffffffffffffffffff' +
                                          'ffffffffffffffffffffffffffffffffffff');
    });

    it('should throw error when parsing empty name', () => {
        expect(() => parseQualifiedName(''))
            .to.throw('repository name must have at least one component');
    });

    it('should throw error when parsing just a tag', () => {
        expect(() => parseQualifiedName(':justtag')).to.throw('invalid reference format');
    });

    it('should throw error when parsing just a digest', () => {
        expect(() => parseQualifiedName('@sha256:ffffffffffffffffffffffffffff' +
                                        'ffffffffffffffffffffffffffffffffffff'))
            .to.throw('invalid reference format');
    });

    it('should throw error when parsing name with short digest', () => {
        expect(() => parseQualifiedName('repo@sha256:ffffffffffffffffffffffffffffffffff'))
            .to.throw('invalid checksum digest length');
    });

    it('should throw error when parsing name with invalid digest', () => {
        expect(() => parseQualifiedName('validname@invaliddigest:ffffffffffffffffffff' +
                                        'ffffffffffffffffffffffffffffffffffffffffffff'))
            .to.throw('unsupported digest algorithm');
    });

    it('should throw error when parsing name with capitals letters', () => {
        expect(() => parseQualifiedName('Uppercase:tag'))
            .to.throw('repository name must be lowercase');
    });

    it('should throw error when parsing name with domain and capitals letters', () => {
        expect(() => parseQualifiedName('test:5000/Uppercase/lowercase:tag'))
            .to.throw('repository name must be lowercase');
    });

    it('should not throw error when parsing name with capitals letters in the tag', () => {
        const reference = parseQualifiedName('lowercase:Uppercase');

        expect(reference.type).to.equal('tagged');
        expect(reference.repository).to.equal('lowercase');
        expect(reference.tag).to.equal('Uppercase');
    });

    it('should throw error when parsing a long name', () => {
        expect(() => parseQualifiedName(`${new Array(129).fill('a').join('/')}:tag`))
            .to.throw('repository name must not be more than 255 characters');
    });

    it('should not throw error when parsing name with over the max tag', () => {
        const reference = parseQualifiedName(`${new Array(128).fill('a').join('/')}` +
                                             `:tag-puts-this-over-max`);

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('a');
        expect(reference.repository).to.equal(new Array(127).fill('a').join('/'));
        expect(reference.tag).to.equal('tag-puts-this-over-max');
    });

    it('should throw error when parsing an invalid name', () => {
        expect(() => parseQualifiedName('aa/asdf$$^/aa')).to.throw('invalid reference format');
    });

    it('should parse valid name 1', () => {
        const reference = parseQualifiedName('sub-dom1.foo.com/bar/baz/quux');

        expect(reference.type).to.equal('repository');
        expect(reference.domain).to.equal('sub-dom1.foo.com');
        expect(reference.repository).to.equal('bar/baz/quux');
    });

    it('should parse valid name 2', () => {
        const reference = parseQualifiedName('sub-dom1.foo.com/bar/baz/quux:some-long-tag');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('sub-dom1.foo.com');
        expect(reference.repository).to.equal('bar/baz/quux');
        expect(reference.tag).to.equal('some-long-tag');
    });

    it('should parse valid name 3', () => {
        const reference = parseQualifiedName('b.gcr.io/test.example.com/my-app:test.example.com');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('b.gcr.io');
        expect(reference.repository).to.equal('test.example.com/my-app');
        expect(reference.tag).to.equal('test.example.com');
    });

    it('should parse valid name 4', () => {
        const reference = parseQualifiedName('xn--n3h.com/myimage:xn--n3h.com');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('xn--n3h.com');
        expect(reference.repository).to.equal('myimage');
        expect(reference.tag).to.equal('xn--n3h.com');
    });

    it('should parse valid name 5', () => {
        const reference = parseQualifiedName('xn--7o8h.com/myimage:xn--7o8h.com@sha512:fffffffff' +
                                             'ffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                             'ffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                             'fffffffffffffffffff');

        expect(reference.type).to.equal('dual');
        expect(reference.domain).to.equal('xn--7o8h.com');
        expect(reference.repository).to.equal('myimage');
        expect(reference.tag).to.equal('xn--7o8h.com');
        expect(reference.digest).to.equal('sha512:ffffffffffffffffffffffffffffffffffffffffffffff' +
                                          'fffffffffffffffffffffffffffffffffffffffffffffffffffff' +
                                          'fffffffffffffffffffffffffffff');
    });

    it('should parse valid name 6', () => {
        const reference = parseQualifiedName('foo_bar.com:8080');

        expect(reference.type).to.equal('tagged');
        expect(reference.repository).to.equal('foo_bar.com');
        expect(reference.tag).to.equal('8080');
    });

    it('should parse valid name 7', () => {
        const reference = parseQualifiedName('foo/foo_bar.com:8080');

        expect(reference.type).to.equal('tagged');
        expect(reference.domain).to.equal('foo');
        expect(reference.repository).to.equal('foo_bar.com');
        expect(reference.tag).to.equal('8080');
    });
});
