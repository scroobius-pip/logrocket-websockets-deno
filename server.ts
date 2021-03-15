import { serve } from "https://deno.land/std@0.87.0/http/server.ts";
import {
    acceptWebSocket,
    acceptable,
    WebSocket,
    isWebSocketCloseEvent

} from "https://deno.land/std@0.87.0/ws/mod.ts";

import { v4 } from 'https://deno.land/std/uuid/mod.ts';

const sockets = new Map<string, WebSocket>()

function broadcastMessage(message: string, uid: string) {
    sockets.forEach((socket, id) => {
        if (!socket.isClosed && uid !== id)
            socket.send(message)
    })
}

async function handleWs(sock: WebSocket) {
    console.log('connected')
    const uid = v4.generate()
    sockets.set(uid, sock)

    for await (const ev of sock) {
        if (isWebSocketCloseEvent(ev)) {
            sockets.delete(uid)
            return
        }

        if (typeof ev === "string") {
            console.log(ev)
            broadcastMessage(ev, uid)

        }

    }
}






for await (const req of serve({ port: 80 })) {
    const { conn, r: bufReader, w: bufWriter, headers } = req;

    acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
    }).then(handleWs)
    // .catch(console.error)
}







