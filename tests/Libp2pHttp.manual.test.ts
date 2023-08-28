import type { Libp2p } from "@libp2p/interface-libp2p";
import Libp2pHttp from "../src/Libp2pHttp.js";
import { createNode, delay } from "./utils/utils.js"

const requestHandler = (node: Libp2p) => {
    const libp2pHttp = Libp2pHttp.init(node)
    libp2pHttp.registerHandler("/test-handler", async (data) => {
        console.log(`Request received ${data}`)
        const response = new Promise((resolve) => {
            setTimeout(() => {
                resolve("Rsponse Data")
            }, 3000)
        })
        return response
    })
}

const main = async () => {
    const handlerNode = await createNode()
    requestHandler(handlerNode)
    delay(5000)
    const requesterNode = await createNode()
    await requesterNode.dial(handlerNode.getMultiaddrs()[0])
    const requester = Libp2pHttp.init(requesterNode)
    const response = await requester.get(`libp2p://${handlerNode.peerId.toString()}/test-handler`, "Hello")
    console.log(response)
}

main()