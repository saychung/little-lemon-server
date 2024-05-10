const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(async (req, res) => {
  const reqPath = await req.url;
  const reqMethod = await req.method;
  let body = "";
  await new Promise((resolve) => {
    req.on("data", async (chunk) => {
      body += await chunk;
    }).on("end", () => {
      resolve();
    });
  });
  console.log(reqMethod)

  if (reqPath === "/" && reqMethod === "GET") {
    res.writeHead("200", {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": req.headers.origin,
    });
    const jsonFile = path.resolve(__dirname, "reserved.json");
    const jsonFileData = fs.readFileSync(jsonFile, "utf-8");
    res.write(jsonFileData);
    return res.end();
  } else if (reqPath === "/" && reqMethod === "POST") {
    res.writeHead("200", {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": req.headers.origin,
    });
    const fileDir = path.resolve(__dirname, "reserved.json");
    const newObj = JSON.parse(body);
    const overall = fs.readFileSync(fileDir, "utf8");
    const parsedOverall = JSON.parse(overall);
    const keyOfNewObj = Object.keys(newObj)[0];
    parsedOverall[keyOfNewObj] = newObj[keyOfNewObj];
    const updatedJson = JSON.stringify(parsedOverall, null, 2);
    fs.writeFileSync(fileDir, updatedJson, "utf-8");
    res.write(`{"screen":"${body}"}`);
    return res.end();
  } else if (reqPath === "/deleteSlot" && reqMethod === "POST") {
    res.writeHead("200", {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": req.headers.origin,
    });
    const fileDir = path.resolve(__dirname, "reserved.json");
    const overall = fs.readFileSync(fileDir, "utf8");
    const parsedOverall = JSON.parse(overall);
    const key = await JSON.parse(body)
    delete parsedOverall[key];
    /* console.log(parsedOverall) */
    const updatedJson = JSON.stringify(parsedOverall, null, 2);
    fs.writeFileSync(fileDir, updatedJson, "utf-8");
    res.write(`{"message":"Deleted ${key} from the reservation."}`);
    return res.end();
  } else {
    res.setHeader("404", {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": req.headers.origin,
    });
    res.write('{"error":"Not FOUND"}"');
    return res.end();
  }
});

server.listen("5000", () => {
  console.log("server is running on port 5000");
});