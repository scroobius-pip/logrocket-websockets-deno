function websocketReady(websocket: WebSocket): Promise<WebSocket> {
    return new Promise((resolve, reject) => {

        websocket.onopen = () => {
            console.log('connected')
            resolve(websocket)
        }
        websocket.onclose = (e) => {
            console.log(e)
            reject(e)
        }
    })
}


function createWebSocket(id: number) {
    const websocket = new WebSocket("ws://localhost:80")
    websocket.onopen = () => {
        setInterval(() => {
            websocket.send(`Client ${id} says hello`)
        }, 2000 * id)
    }

    websocket.onmessage = (message) => {
        console.log(`Client ${id}: ${message.data}`)
    }
}

for (let x = 1; x < 10; x++) {
    createWebSocket(x)
}