import Libp2pHttp from '../dist/src/index.js';
import { createNode, delay } from '../dist/tests/utils/utils.js';
import { multiaddr } from '@multiformats/multiaddr';

(async () => {
    const requesterNode = await createNode();
    const libp2pHttpRequester = Libp2pHttp.init(requesterNode);

    const handlerAddress = '/ip4/127.0.0.1/tcp/50297/ws/p2p/12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa'; // Replace this with the actual address
    await requesterNode.dial(multiaddr(handlerAddress));

    await delay(1000);

    let response;

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/test-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/non-json-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/delayed-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/large-data-handler`, "X".repeat(1e6));
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/nested-handler`, { a: { b: { c: { d: "nested" } } } });
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/number-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/boolean-handler`, "Hello");
    console.log("Received:", response.data);

    response = await libp2pHttpRequester.get(`libp2p://12D3KooWEYWw4nxciXofvsZMDqAVqppguonoWThVfqMBTMwtSLaa/json-handler`, "Hello");
    console.log("Received:", JSON.parse(response.data));
})();
