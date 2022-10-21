/* eslint-env mocha */
import {parseFamiliarName} from '../src';

describe('Familiar name parser', () => {

    describe('should parse valid names without errors:', () => {

        it(`Valid name #1`, () => {
            parseFamiliarName('docker/docker');
        });

        it(`Valid name #2`, () => {
            parseFamiliarName('library/debian');
        });

        it(`Valid name #3`, () => {
            parseFamiliarName('debian');
        });

        it(`Valid name #4`, () => {
            parseFamiliarName('docker.io/docker/docker');
        });

        it(`Valid name #5`, () => {
            parseFamiliarName('docker.io/library/debian');
        });

        it(`Valid name #6`, () => {
            parseFamiliarName('docker.io/debian');
        });

        it(`Valid name #7`, () => {
            parseFamiliarName('index.docker.io/docker/docker');
        });

        it(`Valid name #8`, () => {
            parseFamiliarName('index.docker.io/library/debian');
        });

        it(`Valid name #9`, () => {
            parseFamiliarName('index.docker.io/debian');
        });

        it(`Valid name #10`, () => {
            parseFamiliarName('127.0.0.1:5000/docker/docker');
        });

        it(`Valid name #11`, () => {
            parseFamiliarName('127.0.0.1:5000/library/debian');
        });

        it(`Valid name #12`, () => {
            parseFamiliarName('127.0.0.1:5000/debian');
        });

        it(`Valid name #13`, () => {
            parseFamiliarName('thisisthesongthatneverendsitgoesonandonandonthisisthesongthatnev');
        });

        it(`Valid name #14`, () => {
            parseFamiliarName('docker.io/1a3f5e7d9c1b3a5f7e9d1c3b5a7f9e1d3c5b7a9f1e3d5d7c9b1a3f5e7d9c1b3a');
        });
    });

    describe('should parse invalid names without errors:', () => {

        it(`Invalid name #1`, () => {
            expect(() => parseFamiliarName('https://github.com/docker/docker')).toThrow();
        });

        it(`Invalid name #2`, () => {
            expect(() => parseFamiliarName('docker/Docker')).toThrow();
        });

        it(`Invalid name #3`, () => {
            expect(() => parseFamiliarName('-docker')).toThrow();
        });

        it(`Invalid name #4`, () => {
            expect(() => parseFamiliarName('-docker/docker')).toThrow();
        });

        it(`Invalid name #5`, () => {
            expect(() => parseFamiliarName('-docker.io/docker/docker')).toThrow();
        });

        it(`Invalid name #6`, () => {
            expect(() => parseFamiliarName('docker///docker')).toThrow();
        });

        it(`Invalid name #7`, () => {
            expect(() => parseFamiliarName('docker.io/docker/Docker')).toThrow();
        });

        it(`Invalid name #8`, () => {
            expect(() => parseFamiliarName('docker.io/docker///docker')).toThrow();
        });

        it(`Invalid name #9`, () => {
            expect(() => parseFamiliarName(
                '1a3f5e7d9c1b3a5f7e9d1c3b5a7f9e1d3c5b7a9f1e3d5d7c9b1a3f5e7d9c1b3a')).toThrow();
        });

    });
});

