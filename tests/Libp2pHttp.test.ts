import { expect } from 'chai';
import { describe, it, before } from 'mocha';

import Libp2pHttp from '../src/Libp2pHttp.js';
import { createNode, delay } from './utils/utils.js';

describe('Libp2pHttp', function () {
    this.timeout(30000);

    let handlerNode;
    let requesterNode;
    let libp2pHttpHandler;
    let libp2pHttpRequester;

    before(async () => {
        handlerNode = await createNode();
        requesterNode = await createNode();

        libp2pHttpHandler = Libp2pHttp.init(handlerNode);
        libp2pHttpRequester = Libp2pHttp.init(requesterNode);

        await requesterNode.dial(handlerNode.getMultiaddrs()[0]);
    });

    it('should initialize correctly', () => {
        expect(libp2pHttpHandler).to.be.instanceOf(Libp2pHttp);
        expect(libp2pHttpRequester).to.be.instanceOf(Libp2pHttp);
    });

    it('should register a handler and respond to requests', async () => {
        const testData = "Hello";

        libp2pHttpHandler.registerHandler("/test-handler", async (data) => {
            expect(data).to.equal(testData);
            return "Response Data";
        });

        await delay(1000);

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/test-handler`, testData);

        // Assertions
        expect(response.status).to.equal('success');
        expect(response.data).to.equal('Response Data');
    });

    it('should handle non-JSON response gracefully', async () => {
        const testData = "Hello";

        libp2pHttpHandler.registerHandler("/non-json-handler", async (data) => {
            return "This is not a JSON string.";
        });

        await delay(1000);

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/non-json-handler`, testData);

        expect(response.status).to.equal('success');
        expect(response.data).to.equal('This is not a JSON string.');
    });

    it('should return error for non-existent protocol', async () => {
        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/non-existent-handler`, "testData");

        expect(response.status).to.equal('error');
        expect(response.error).to.contain('Failed to send request');
    });

    it('should handle delayed response from handler', async () => {
        const testData = "Delayed Hello";

        libp2pHttpHandler.registerHandler("/delayed-handler", async (data) => {
            await delay(3000);  // Deliberate delay
            return "Delayed Response";
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/delayed-handler`, testData);

        expect(response.status).to.equal('success');
        expect(response.data).to.equal('Delayed Response');
    });

    it('should handle sending large data', async () => {
        const largeData = "X".repeat(1e6);  // 1MB of data

        libp2pHttpHandler.registerHandler("/large-data-handler", async (data) => {
            expect(data).to.equal(largeData);
            return "Received large data";
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/large-data-handler`, largeData);

        expect(response.status).to.equal('success');
        expect(response.data).to.equal('Received large data');
    });

    it('should handle malformed request string gracefully', async () => {
        const response = await libp2pHttpRequester.send(`malformed_request`, "testData");

        expect(response.status).to.equal('error');
        expect(response.error).to.contain('Invalid request string');
    });

    it('should handle deeply nested object data', async () => {
        const nestedData = { a: { b: { c: { d: "nested" } } } };

        libp2pHttpHandler.registerHandler("/nested-handler", async (data) => {
            expect(JSON.parse(data)).to.deep.equal(nestedData);
            return "Received nested data";
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/nested-handler`, nestedData);

        expect(response.status).to.equal('success');
        expect(response.data).to.equal('Received nested data');
    });

    it('should handle number responses', async () => {
        const numberData = 12345;

        libp2pHttpHandler.registerHandler("/number-handler", async (data) => {
            expect(data).to.equal("testData");
            return numberData;
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/number-handler`, "testData");

        expect(response.status).to.equal('success');
        expect(response.data).to.equal(String(numberData));
    });

    it('should handle boolean responses', async () => {
        const booleanData = true;

        libp2pHttpHandler.registerHandler("/boolean-handler", async (data) => {
            expect(data).to.equal("testData");
            return booleanData;
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/boolean-handler`, "testData");

        expect(response.status).to.equal('success');
        expect(response.data).to.equal(String(booleanData));
    });

    it('should handle JSON object responses', async () => {
        const jsonObject = {
            name: "John",
            age: 30,
            city: "New York"
        };

        libp2pHttpHandler.registerHandler("/json-handler", async (data) => {
            expect(data).to.equal("testData");
            return jsonObject;
        });

        const response = await libp2pHttpRequester.send(`libp2p://${handlerNode.peerId.toString()}/json-handler`, "testData");

        expect(response.status).to.equal('success');

        const parsedData = JSON.parse(response.data);
        expect(parsedData).to.deep.equal(jsonObject);
    });
});
