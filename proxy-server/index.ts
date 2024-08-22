import http from "http";
import express, { Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { PrismaClient } from "@prisma/client";
import { ResponseLocals } from "./types/responseLocals";
import { URL } from "url";

const app = express();
const customRouter = function (req: any) {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`; // protocol + host
};
const primaClient = new PrismaClient();

const port: number = Number(process.env.PORT) || 8000;

const proxy = createProxyMiddleware({
  target: "http://localhost:port",
  router: customRouter,
  selfHandleResponse: true,
  on: {
    proxyRes: responseInterceptor(
      async (
        responseBuffer,
        proxyRes,
        req,
        res: Response<any, ResponseLocals>
      ) => {
        try {
          await primaClient.request.update({
            where: {
              id: res.locals.requestDbId,
            },
            data: {
              response: {
                create: {
                  headers: JSON.stringify(res.getHeaders() ?? {}),
                  payload: responseBuffer.toString("utf8"),
                },
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
        return responseBuffer;
      }
    ),
  },
});
app.use(
  async (
    req,
    res: Response<any, ResponseLocals>,
    next: (err?: any) => void
  ) => {
    const newRequest = await primaClient.request.create({
      data: {
        url: req.url,
        method: req.method,
        headers: req.headers ? JSON.stringify(req.headers ?? {}) : "",
        payload: req.body ? JSON.stringify(req.body) : "",
      },
    });
    res.locals.requestDbId = newRequest.id;
    next();
  }
);
app.use(proxy);
app.use(bodyParser.json());

export function setupProxyServer() {
  http.createServer(app).listen(port, "0.0.0.0", () => {
    console.log(`Proxy server linsten on ${port}`);
  });
  setTimeout(() => {
    axios.get("http://ident.me", {
      proxy: {
        host: "127.0.0.1",
        port: port,
      },
    });
  }, 3000);
}
