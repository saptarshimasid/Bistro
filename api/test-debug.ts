import app from "../server";

export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  
  let output = `Mock Request URL: /api/data\n`;
  output += `Original Request URL: ${req.url}\n`;
  output += `Request Method: ${req.method}\n`;
  
  // Override the URL to point to /api/data
  req.url = "/api/data";
  
  const mockRes = {
    statusCode: 200,
    headers: {} as any,
    setHeader(name: string, value: any) {
      this.headers[name] = value;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      output += `\n--- Express json() called --- \nStatus: ${this.statusCode}\n`;
      output += JSON.stringify(data, null, 2) + "\n";
      res.status(this.statusCode).send(output);
    },
    send(body: any) {
      output += `\n--- Express send() called --- \nStatus: ${this.statusCode}\n`;
      output += String(body) + "\n";
      res.status(this.statusCode).send(output);
    },
    end() {
      output += `\n--- Express end() called --- \nStatus: ${this.statusCode}\n`;
      res.status(this.statusCode).send(output);
    }
  };
  
  try {
    app(req, mockRes as any);
  } catch (err: any) {
    res.status(500).send(output + `\nExpress throw: ${err.message}\n${err.stack}`);
  }
}
