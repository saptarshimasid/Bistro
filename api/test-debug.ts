import compiledHandler from "./index.js";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  let log = "";
  
  const addLog = (msg: string) => {
    log += msg + "\n";
  };
  
  // Intercept console.log and console.error
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: any[]) => {
    addLog(`[LOG] ${args.join(" ")}`);
    originalLog.apply(console, args);
  };
  console.error = (...args: any[]) => {
    addLog(`[ERR] ${args.join(" ")}`);
    originalError.apply(console, args);
  };
  
  try {
    addLog("1. Compiled api/index.js imported successfully.");
    
    addLog("2. Mocking request and response objects for /api/data...");
    const mockReq = {
      url: "/api/data",
      method: "GET",
      headers: {},
      on: () => {},
      listeners: () => []
    };
    
    let responseStatus = 200;
    let responseHeaders: any = {};
    let responseBody = "";
    
    const callbacks: any = {};
    
    const mockRes = {
      setHeader: (name: string, value: string) => {
        responseHeaders[name] = value;
      },
      status: (code: number) => {
        responseStatus = code;
        return mockRes;
      },
      json: (data: any) => {
        responseBody = JSON.stringify(data);
        if (callbacks["finish"]) callbacks["finish"]();
      },
      send: (data: any) => {
        responseBody = typeof data === "string" ? data : JSON.stringify(data);
        if (callbacks["finish"]) callbacks["finish"]();
      },
      end: () => {
        if (callbacks["finish"]) callbacks["finish"]();
      },
      on: (event: string, cb: () => void) => {
        callbacks[event] = cb;
      },
      once: (event: string, cb: () => void) => {
        callbacks[event] = cb;
      },
      emit: (event: string) => {
        if (callbacks[event]) callbacks[event]();
      }
    };
    
    addLog("3. Calling compiled handler...");
    const promise = compiledHandler(mockReq, mockRes);
    addLog(`promise type: ${typeof promise}`);
    
    await Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout waiting for handler (5s)")), 5000))
    ]);
    
    addLog(`4. Handler completed. Status: ${responseStatus}`);
    addLog(`Response Body preview: ${responseBody.substring(0, 500)}`);
    
    res.status(200).send(log);
  } catch (error: any) {
    addLog(`Top-level crash caught: ${error.message}\n${error.stack}`);
    res.status(200).send(log);
  } finally {
    // Restore console methods
    console.log = originalLog;
    console.error = originalError;
  }
}
