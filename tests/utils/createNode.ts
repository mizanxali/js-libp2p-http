import { createLibp2p } from "libp2p";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { webSockets } from "@libp2p/websockets";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { kadDHT } from "@libp2p/kad-dht";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayTransport } from "libp2p/circuit-relay";
import { identifyService } from "libp2p/identify";
import type { Libp2p } from "@libp2p/interface-libp2p";

export const createNode = async (
): Promise<Libp2p> => {
    try {
        const node = await createLibp2p({
            addresses: {
                listen: [`/ip4/0.0.0.0/tcp/0/ws`],
            },
            transports: [
                webSockets(),
                circuitRelayTransport({
                    discoverRelays: 2,
                }),
            ],
            connectionEncryption: [noise()],
            streamMuxers: [yamux(), mplex()],
            services: {
                identify: identifyService(),
                pubsub: gossipsub({ allowPublishToZeroPeers: true }),
                dht: kadDHT({
                    // this is necessary because this node is not connected to the public network
                    // it can be removed if, for example bootstrappers are configured
                    allowQueryWithZeroPeers: true,
                }),
            },
        });
        return node;
    } catch (e) {
        console.log(e);
    }
};