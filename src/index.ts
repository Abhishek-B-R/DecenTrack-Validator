import validateData from "./validateData";
import axios from "axios"
import dotenv from "dotenv"
import { BACKEND_URL, WS_URL } from "./config";
dotenv.config()

async function waitForWebSocket(url:string) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket Connected 🎉");

            // Send ping every 30 seconds to keep the connection alive
            setInterval(() => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ type: "ping" }));
                }
            }, 30_000);

            resolve(ws);
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error", error);
            reject(error);
        };

        ws.onclose = () => {
            console.log("WebSocket Closed");
        };     
        
        ws.onmessage=async (e)=>{
            const msg=JSON.parse(e.data)
            const returnData=await validateData(msg)
            console.log(returnData)
            await axios.post(BACKEND_URL as string, returnData).then((response:any) =>{
                console.log("Response recieved: ");
                console.log(response.data);
            }).catch(err =>{
                console.log(err);
            })
        }
    });
}

(async ()=>{
    await waitForWebSocket(WS_URL as string)
})()