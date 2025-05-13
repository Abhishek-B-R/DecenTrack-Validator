import validateData from "./validateData";
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

async function waitForWebSocket(url:string) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket Connected 🎉");
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
            await axios.post(process.env.BACKEND_URL as string, returnData).then((response:any) =>{
                console.log("Response recieved: ");
                console.log(response.data.error);
            }).catch(err =>{
                console.log(err);
            })
        }
    });
}

(async ()=>{
    await waitForWebSocket(process.env.WS_URL as string)
})()