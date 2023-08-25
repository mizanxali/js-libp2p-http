import { PeerId } from "@libp2p/interface-peer-id";
import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { peerIdFromString } from "@libp2p/peer-id"

interface Libp2pComponents {
    target: PeerId | Multiaddr;
    protocol: string;
}

class Libp2pRequest {
    private target: PeerId | Multiaddr;
    private protocol: string;

    constructor(requestString: string) {
        const match = requestString.match(/^libp2p:\/\/(.*?)(\/[^\/]+)?$/);
        if (!match) {
            throw new Error('Invalid Libp2p Request String');
        }

        const strTarget = match[1];
        this.protocol = match[2] ? match[2].substring(1) : '';

        try {
            this.target = peerIdFromString(strTarget)
        } catch (e) {
            try {
                this.target = multiaddr('/' + strTarget);
            } catch (e) {
                throw new Error('Target is neither a valid PeerId nor a valid Multiaddress');
            }
        }
    }

    getComponents(): Libp2pComponents {
        return {
            target: this.target,
            protocol: this.protocol,
        };
    }
}

export default Libp2pRequest;
