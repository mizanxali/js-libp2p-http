import Libp2pHttp from '../dist/src/index.js';
import { createNode, delay } from '../dist/tests/utils/utils.js';
import { multiaddr } from '@multiformats/multiaddr';

(async () => {
    const requesterNode = await createNode();
    const libp2pHttpRequester = Libp2pHttp.init(requesterNode);

    const handlerAddress = '/ip4/127.0.0.1/tcp/49775/ws/p2p/12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ'; // Replace this with the actual address
    await requesterNode.dial(multiaddr(handlerAddress));

    await delay(1000);

    let response;

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/test-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/non-json-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/delayed-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/large-data-handler`, "X".repeat(1e6));
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/nested-handler`, { a: { b: { c: { d: "nested" } } } });
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/number-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/boolean-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.send(`libp2p://12D3KooWGX55JNJePqkcnuq36VmFVy5vXm4ZjRK9RkCibGzrZDAZ/json-handler`, "Hello");
    console.log("Received:", JSON.parse(response.data));
})();
