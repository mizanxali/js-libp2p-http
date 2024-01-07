import { Libp2p } from 'libp2p';
import Libp2pRequest from './utils/Libp2pRequest.js';
import Libp2pResponse from './utils/Libp2pResponse.js';
import { pipe } from 'it-pipe';
import toBuffer from 'it-to-buffer';

type DataPayload = string | { [key: string]: any };

class Libp2pHttp {
    node: Libp2p;

    constructor(node: Libp2p) {
        this.node = node;
    }

    static init = (node: Libp2p): Libp2pHttp => {
        const libp2pHttp = new Libp2pHttp(node)
        return libp2pHttp
    }

    get = async (requestString: string, data: DataPayload): Promise<Libp2pResponse<string>> => {
        let request: Libp2pRequest;

        try {
            request = new Libp2pRequest(requestString);
        } catch (error) {
            return {
                data: '',
                status: 'error',
                error: `Invalid request string: ${error.message}`
            };
        }

        const { target, protocol } = request.getComponents();

        const encodedData = typeof data === 'string' ? new TextEncoder().encode(data) : new TextEncoder().encode(JSON.stringify(data));

        try {
            const stream = await this.node.dialProtocol(target, protocol);
            await pipe(
                [encodedData],
                stream
            );

            const response = await pipe(
                stream,
                async function* (source) {
                    for await (const chunk of source) {
                        yield chunk.subarray();
                    }
                },
                toBuffer
            );

            let decodedResponse: string;
            try {
                decodedResponse = new TextDecoder().decode(response);
                JSON.parse(decodedResponse); // check if the response is a valid JSON
            } catch (error) {
                // It's not a JSON; treat as plain string
            }

            return {
                data: decodedResponse,
                status: 'success'
            };
        } catch (error) {
            return {
                data: '',
                status: 'error',
                error: `Failed to send request: ${error.message}`
            };
        }
    }


    registerHandler(protocol: string, handlerFunction: (data: any) => Promise<any>): void {
        this.node.handle(protocol, async ({ stream }) => {
            const requestData = await pipe(
                stream,
                async function* (source) {
                    for await (const chunk of source) {
                        yield chunk.subarray();
                    }
                },
                toBuffer
            );

            let responseData = await handlerFunction(new TextDecoder().decode(requestData));
            if (typeof responseData === 'object' && responseData !== null) {
                responseData = JSON.stringify(responseData);
            } else if (typeof responseData !== 'string') {
                responseData = String(responseData);
            }

            await pipe(
                [new TextEncoder().encode(responseData)],
                stream
            );
        });
    }
}

export default Libp2pHttp;
