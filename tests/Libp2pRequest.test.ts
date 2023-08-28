import { expect } from 'chai';
import Libp2pRequest from '../src/utils/Libp2pRequest.js';

describe('Libp2pRequest', () => {
    describe('constructor', () => {
        it('should correctly extract PeerId', () => {
            const request = new Libp2pRequest('libp2p://12D3KooWMaNws58kxDMowwP3R6YpDcqJXCpnEXALiZ9TK62uMCNU/protocol');
            const components = request.getComponents();

            expect(components.target.toString()).to.equal('12D3KooWMaNws58kxDMowwP3R6YpDcqJXCpnEXALiZ9TK62uMCNU');
            expect(components.protocol).to.equal('/protocol');  // Adjusted to expect leading "/"
        });

        it('should correctly extract Multiaddr', () => {
            const request = new Libp2pRequest('libp2p://ip4/127.0.0.1/tcp/1234/ws/protocol');
            const components = request.getComponents();

            expect(components.target.toString()).to.equal('/ip4/127.0.0.1/tcp/1234/ws');
            expect(components.protocol).to.equal('/protocol');  // Adjusted to expect leading "/"
        });

        it('should throw error for invalid request string', () => {
            expect(() => new Libp2pRequest('invalid://12D3KooWMaNws58kxDMowwP3R6YpDcqJXCpnEXALiZ9TK62uMC/protocol')).to.throw('Invalid Libp2p Request String');
        });

        it('should throw error for invalid target', () => {
            expect(() => new Libp2pRequest('libp2p://invalidTarget/protocol')).to.throw('Target is neither a valid PeerId nor a valid Multiaddress');
        });
    });
});
