// api/index.ts
function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("Hello from minimal ESModule handler!");
}
export {
  handler as default
};
