interface inputData{
    id:string,
    url:string
}

export default async function validateData(msg:{
    type: "websiteUpdate",
    data:inputData[]
}) {
    
    const returnData=await Promise.all(msg.data.map(async (e)=>{
        const  { status, latency }= await checkWebsiteStatus(e.url)
        return {
            websiteId:e.id,
            status,
            latency
        }
    }))

    return returnData
};

// Function to check website status and measure latency
const checkWebsiteStatus = async (url: string): Promise<{ status: number; latency: number }> => {
    const startTime = performance.now()
    let status = 1 // Default to down (1)
    try {
        // Add protocol if missing
        const fullUrl = url.startsWith("http") ? url : `https://${url}`
        // Fetch with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        const response = await fetch(fullUrl, {
            method: "GET",
            signal: controller.signal,
        })
        clearTimeout(timeoutId)

        // Status 0 means website is up (HTTP 200)
        status = response.status == 200 ? 0 : 1
    } catch (error) {
        // Any error means the website is down
        status = 1
        // console.error(`Error checking ${url}:`, error)
    } finally {
        // Calculate latency
        const latency = Math.round(performance.now() - startTime)
        return { status, latency }
    }
}