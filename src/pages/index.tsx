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
    <main className="flex w-full bg-stone-200">
      <div
        className={`bg-stone-300 hidden flex fixed p-1 ${openedRequest ? "w-[50%]" : "w-[100%]"}`}
      >
        <div className="p-2 cursor-pointer flex">^</div>
        <div className="p-2 cursor-pointer flex">+1</div>
        <div className="p-2 cursor-pointer flex">+2</div>
      </div>
      <div
        className={`mt-[48px] flex order-1 gap-1 bg-stone-200 flex-col ${openedRequest ? "w-[50%]" : "w-[100%]"}`}
      >
        {requestsSwr.data?.requests.map((req) => {
          return (
            <RequestRow
              selected={req.id == openedRequest?.id}
              key={req.id}
              request={req}
              openHandler={setOpenedRequest}
            />
          );
        })}
      </div>
      <div
        className={` relative flex order-2 border-s-2 border-stone-200 ${openedRequest ? "w-[50%]" : "w-[0%]"}`}
      >
        {openedRequest && (
          <div className="flex flex-col fixed max-h-screen overflow-y-auto w-[50%]">
            <div className="flex w-100 flex-col bg-zinc-100">
              <div className="text-gray-500 text-center w-100 flex justify-between">
                <div className="flex items-center px-1">
                  {dayjs(openedRequest.created_at).format(
                    "DD.MM.YYYY HH:mm:ss"
                  )}
                </div>
                <div
                  className="p-2 cursor-pointer flex items-center"
                  onClick={() => setOpenedRequest(null)}
                >
                  x
                </div>
              </div>
              <div className="flex flex-row">
                <div className={`p-1 method-${openedRequest.method}`}>
                  {openedRequest.method}
                </div>
                <div className="ms-3 p-1 break-all w-full">
                  {openedRequest.url}
                </div>
              </div>
            </div>
            <div className="bg-blue-300 p-2 gap-2 flex flex-wrap">
              <div className="w-full font-bold">Запрос</div>
              <pre className="w-full">
                <JsonPresentation
                  value={(() => {
                    const search = new URL(openedRequest.url).search.substring(
                      1
                    );
                    if (search) {
                      return (
                        '{"' +
                        decodeURI(search)
                          .replace(/"/g, '\\"')
                          .replace(/&/g, '","')
                          .replace(/=/g, '":"') +
                        '"}'
                      );
                    } else {
                      return {};
                    }
                  })()}
                  name="params"
                  title="Параметры"
                />
              </pre>
              <pre className="w-full">
                <JsonPresentation
                  value={openedRequest.headers}
                  name="headers"
                  title="Заголовки"
                />
              </pre>
              {openedRequest.method.toLowerCase() != "get" && (
                <pre className="w-full">
                  <JsonPresentation
                    value={openedRequest.payload}
                    name="payload"
                    title="Содержимое"
                  />
                </pre>
              )}
            </div>
            <div className=" bg-blue-200 p-2 gap-2 flex flex-wrap">
              <div className="w-full font-bold">Ответ</div>
              <pre className="w-full">
                <JsonPresentation
                  value={openedRequest.response?.headers}
                  name="headers"
                  title="Заголовки"
                />
              </pre>
              <pre className="w-full">
                <JsonPresentation
                  value={openedRequest.response?.payload}
                  name="payload"
                  title="Содержимое"
                />
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
