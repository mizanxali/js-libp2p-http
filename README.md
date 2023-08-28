
# `js-libp2p-http`

## Introduction

`js-libp2p-http` is a lightweight HTTP-like transport built on top of [libp2p](https://github.com/libp2p/js-libp2p). It allows you to send HTTP-like requests over libp2p, with easy handler registration and response handling.
## Installation

To install `js-libp2p-http`, choose your preferred package manager:

- Using npm:
  ``` 
  npm install js-libp2p-http
  ```
- Using yarn:
	```
	yarn add js-libp2p-http
	```
- Using pnpm:
	```
	pnpm add js-libp2p-http
	```

## Usage

### **Import the Library**

```javascript
import Libp2pHttp from 'js-libp2p-http';
```

### **Creating a Libp2p Node**
First, you'll need to create and initialize a libp2p node:

```javascript
import { createLibp2p } from 'libp2p'; 

const node = await createLibp2p({...options});
```
### **Initialize with `js-libp2p-http`**

Once you have a libp2p node, you can initialize `js-libp2p-http`:

```javascript
const libp2pHttp = Libp2pHttp.init(node);
```

### **Creating Handlers**

Handlers respond to specific protocols. Define them and bind to specific routes:

```javascript
libp2pHttp.registerHandler("/your-protocol-endpoint", async (data) => {
    // Process the incoming request data...
    return { data: "Response Data" };
});
```

### **Handling Requests**

Before sending a request to a handler, ensure that the requesting node dials the handler node:

```javascript
await node.dial(multiaddr("HANDLER_NODE_MULTIADDR"));
```
Send a request using the `send` method:
```
const response = await libp2pHttpRequester.get(`libp2p://HANDLER_NODE_PEER_ID/your-protocol-endpoint`, { data: "Request data" });
```
### **Examples**
For a clearer explanation and practical demonstrations of various use cases, please check out the `examples` folder in the package/repository. It provides comprehensive examples to help you understand how to effectively use `js-libp2p-http`.

### **Error Handling**

Always handle errors gracefully:

```javascript
try {
    const response = await libp2pHttpRequester.get(`libp2p://HANDLER_PEER_ID/your-protocol-endpoint`, "Your request data here");
    // Handle the response
} catch (error) {
    console.error("Failed to send request:", error);
}
```

### **Tips**
1. Always catch errors from requests to handle them gracefully.
2. Ensure your handlers return data in the format expected by requesters.
3. Remember to dial a node before sending a request to it.
4. Ensure both handler and requester nodes are running and reachable.

### **Feedback and Contributions**

We value feedback from the community! If you encounter any issues or have suggestions, please [create an issue on GitHub](https://github.com/vaibhavmuchandi/js-libp2p-http/issues).

### **License**

`js-libp2p-http` is released under the [MIT License](https://github.com/vaibhavmuchandi/js-libp2p-http/LICENSE.md). 