import Libp2pHttp from '../dist/src/index.js';
import { createNode } from '../dist/tests/utils/utils.js';

(async () => {
    const handlerNode = await createNode();
    const libp2pHttpHandler = Libp2pHttp.init(handlerNode);

    console.log("Handler Node started at:", handlerNode.getMultiaddrs()[0].toString());

    libp2pHttpHandler.registerHandler("/test-handler", async (data) => {
        return "Response Data";
    });

    libp2pHttpHandler.registerHandler("/non-json-handler", async (data) => {
        return "This is not a JSON string.";
    });

    libp2pHttpHandler.registerHandler("/delayed-handler", async (data) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return "Delayed Response";
    });

    libp2pHttpHandler.registerHandler("/large-data-handler", async (data) => {
        return "Received large data";
    });

    libp2pHttpHandler.registerHandler("/nested-handler", async (data) => {
        return "Received nested data";
    });

    libp2pHttpHandler.registerHandler("/number-handler", async (data) => {
        return 12345;
    });

    libp2pHttpHandler.registerHandler("/boolean-handler", async (data) => {
        return true;
    });

    libp2pHttpHandler.registerHandler("/json-handler", async (data) => {
        return {
            name: "John",
            age: 30,
            city: "New York"
        };
    });
})();
