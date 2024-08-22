import { jsonFetcher } from "@/fetcher/jsonFetcher";
import { GetRequestsResponseData } from "@/pages/api/requests";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { JsonPresentation } from "../json-presentation";
import { RequestRow } from "../request/row/RequestRow";
import { RequestInfo } from "./request-info";

export function RequestViewer() {
    const requestsSwr = useSWR<GetRequestsResponseData, any>(
        "/api/requests",
        jsonFetcher
    );
    const [openedRequest, setOpenedRequest] = useState<Prisma.requestGetPayload<{
        include: { response: true };
    }> | null>(null);
    return (<>
        <div
            className={`flex order-1 gap-1 bg-stone-200 flex-col ${openedRequest ? "w-[50%]" : "w-[100%]"}`}
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
            className={` relative flex order-2 border-s-2 h-screen border-stone-200 bg-stone-300 ${openedRequest ? "w-[50%]" : "w-[0%]"}`}
        >
            <RequestInfo openedRequest={openedRequest} setopenedRequest={setOpenedRequest} />
        </div>
    </>)
}