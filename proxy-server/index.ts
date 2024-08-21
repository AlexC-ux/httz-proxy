import http from "http";
import express from "express";
import bodyParser from "body-parser";
import httpProxy from "http-proxy";
import axios from "axios";
import { createProxyMiddleware, responseInterceptor } from "http-proxy-middleware";
import { Prisma } from "@prisma/client";
import { url } from "inspector";
import { PrismaClient } from "@prisma/client";


const app = express();
const customRouter = function (req:any) {
  return req.url; // protocol + host
};
const primaClient = new PrismaClient();

const proxy = createProxyMiddleware({
  target: 'http://localhost:8080',
  router: customRouter,
  selfHandleResponse: true,
  on: {
    proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        try {
            const result = await primaClient.request.create({
            data:{
                url: req.url,
                method: req.method,
                headers: JSON.stringify(req.headers??{}),
                payload: JSON.stringify(req.body??{}),
                response:{
                    create:{
                        headers: JSON.stringify(res.getHeaders()??{}),
                        payload: responseBuffer.toString('utf8'),
                        created_at: new Date()
                    }
                }
            }
        })
        } catch (error) {
          console.log(error)  
        }
      return responseBuffer
    }),
  },
});
app.use(bodyParser.json());
app.use(proxy)



export function setupProxyServer(){
    http.createServer(app).listen(8080, '0.0.0.0', () => {
  console.log('Proxy server linsten on 8080');
});
setTimeout(()=>{
        axios.post("http://ident.me",{1:2},{
            proxy:{
                host:"127.0.0.1",
                port:8080
            }
        })
    },3000)
  console.log('Applicaton server linsten on 80805');
}

