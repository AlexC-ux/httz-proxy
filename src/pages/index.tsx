import { jsonFetcher } from "@/fetcher/jsonFetcher";
import useSWR from "swr";
import { GetRequestsResponseData } from "./api/requests";
import { RequestRow } from "@/components/request/row/RequestRow";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import JsonView from "@uiw/react-json-view";
import { JsonPresentation } from "@/components/json-presentation";

export default function Home() {
  const requestsSwr = useSWR<GetRequestsResponseData, any>(
    "/api/requests",
    jsonFetcher
  );
  const [openedRequest, setOpenedRequest] = useState<Prisma.requestGetPayload<{
    include: { response: true };
  }> | null>(null);
  return (
    <main className="flex w-full">
      <div
        className={`flex order-1 flex-col ${openedRequest ? "w-[50%]" : "w-[100%]"}`}
      >
        {requestsSwr.data?.requests.map((req) => {
          return (
            <RequestRow
              key={req.id}
              request={req}
              openHandler={setOpenedRequest}
            />
          );
        })}
      </div>
      <div className="flex order-2">
        {openedRequest && (
          <div className="flex flex-col fixed max-h-screen overflow-y-auto">
            <div className="flex w-100 flex-col bg-zinc-100">
              <div className="text-gray-500 text-center w-100 py-2">
                {dayjs(openedRequest.created_at).format("DD.MM.YYYY HH:mm:ss")}
              </div>
              <div className="flex flex-row">
                <div className={`p-1 method-${openedRequest.method}`}>
                  {openedRequest.method}
                </div>
                <div className="ms-3 p-1 break-all">{openedRequest.url}</div>
              </div>
              <pre className="">
                <JsonPresentation
                  value={(() => {
                    const search = new URL(openedRequest.url).search.substring(
                      1
                    );
                    return (
                      '{"' +
                      decodeURI(search)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                      '"}'
                    );
                  })()}
                  name="params"
                  title="Query запроса"
                />
              </pre>
            </div>
            <div className="bg-blue-100 p-2">
              <pre>
                <JsonPresentation
                  value={openedRequest.headers}
                  name="headers"
                  title="Заголовки запроса"
                />
              </pre>
              {openedRequest.method.toLowerCase() != "get" && (
                <pre>
                  <JsonPresentation
                    value={openedRequest.payload}
                    name="payload"
                    title="Тело запроса"
                  />
                </pre>
              )}
            </div>
            <div className="bg-cyan-100">
              <pre>
                <JsonPresentation
                  value={openedRequest.response?.headers}
                  name="headers"
                  title="Заголовки ответа"
                />
              </pre>
              <pre>
                <JsonPresentation
                  value={openedRequest.response?.payload}
                  name="payload"
                  title="Тело ответа"
                />
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
