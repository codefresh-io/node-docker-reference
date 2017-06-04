'use strict';

/* eslint-env mocha */

const chai         = require('chai');
const { parseAll } = require('../lib/parsers');

const expect = chai.expect;

describe('All references parser', () => {

    it('should parse a familiar name with no domain, owner and tag', () => {
        const reference = parseAll('redis');

        expect(reference.toString()).to.equal('docker.io/library/redis');
    });

    it('should parse a familiar name with no domain and owner', () => {
        const reference = parseAll('redis:latest');

        expect(reference.toString()).to.equal('docker.io/library/redis:latest');
    });

    it('should parse a qualified name with tag', () => {
        const reference = parseAll('docker.io/library/redis:latest');

        expect(reference.toString()).to.equal('docker.io/library/redis:latest');
    });

    it('should parse a familiar name with digest', () => {
        const reference = parseAll('redis@sha256:dbcc1c35ac38df41fd2f5e413' +
                                   '0b32ffdb93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('docker.io/library/redis@sha256:dbcc1c35ac38df41' +
                                              'fd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse a qualified name with digest', () => {
        const reference = parseAll('docker.io/library/redis@sha256:dbcc1c35ac38df41f' +
                                   'd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('docker.io/library/redis@sha256:dbcc1c35ac38df41' +
                                              'fd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse a familiar name with unofficial owner', () => {
        const reference = parseAll('dmcgowan/myapp');

        expect(reference.toString()).to.equal('docker.io/dmcgowan/myapp');
    });

    it('should parse a familiar name with unofficial owner and tag', () => {
        const reference = parseAll('dmcgowan/myapp:latest');

        expect(reference.toString()).to.equal('docker.io/dmcgowan/myapp:latest');
    });

    it('should parse a qualified name with unofficial owner and tag', () => {
        const reference = parseAll('docker.io/mcgowan/myapp:latest');

        expect(reference.toString()).to.equal('docker.io/mcgowan/myapp:latest');
    });

    it('should parse a familiar name with unofficial owner and digest', () => {
        const reference = parseAll('dmcgowan/myapp@sha256:dbcc1c35ac38df41fd2f5' +
                                   'e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('docker.io/dmcgowan/myapp@sha256:dbcc1c35ac38df41' +
                                              'fd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse a qualified name with unofficial owner and digest', () => {
        const reference = parseAll('docker.io/dmcgowan/myapp@sha256:dbcc1c35ac38df41' +
                                   'fd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('docker.io/dmcgowan/myapp@sha256:dbcc1c35ac38df41' +
                                              'fd2f5e4130b32ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse an identifier name', () => {
        const reference = parseAll('dbcc1c35ac38df41fd2f5e4130b32ffd' +
                                   'b93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('sha256:dbcc1c35ac38df41fd2f5e4130b3' +
                                              '2ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse a digest', () => {
        const reference = parseAll('sha256:dbcc1c35ac38df41fd2f5e4130b3' +
                                   '2ffdb93ebae8b3dbe638c23575912276fc9c');

        expect(reference.toString()).to.equal('sha256:dbcc1c35ac38df41fd2f5e4130b3' +
                                              '2ffdb93ebae8b3dbe638c23575912276fc9c');
    });

    it('should parse familiar name that looks like identifier', () => {
        const reference = parseAll('dbcc1c35ac38df41fd2f5e4130b32ff' +
                                   'db93ebae8b3dbe638c23575912276fc9');

        expect(reference.toString()).to.equal('docker.io/library/dbcc1c35ac38df41fd2f5e' +
                                              '4130b32ffdb93ebae8b3dbe638c23575912276fc9');
    });

    it('should parse familiar name that looks like identifier', () => {
        const reference = parseAll('dbcc1c35ac38df41fd2f5e4130b32ff' +
                                   'db93ebae8b3dbe638c23575912276fc9');

        expect(reference.toString()).to.equal('docker.io/library/dbcc1c35ac38df41fd2f5e' +
                                              '4130b32ffdb93ebae8b3dbe638c23575912276fc9');
    });
});
