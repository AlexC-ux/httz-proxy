import { jsonFetcher } from "@/fetcher/jsonFetcher";
import { GetRequestsResponseData } from "@/pages/api/requests";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { RequestRow } from "../request/row/RequestRow";
import { RequestInfo } from "./request-info";
import { Header } from "../navigation/header";

export function RequestViewer() {
    const requestsSwr = useSWR<GetRequestsResponseData, any>(
        "/api/requests",
        jsonFetcher
    );
    const [openedRequest, setOpenedRequest] = useState<Prisma.requestGetPayload<{
        include: { response: true };
    }> | null>(null);
    return (<>
        <div className={`h-screen w-full ${openedRequest ? "hidden md:block md:max-w-[50vw]" : ""}`}>
            <Header />
            <div
                className={`flex order-1 gap-1 bg-stone-200 flex-col overflow-y-auto overflow-x-hidden`}
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
        </div>
        <div
            className={`bg-stone-300 min-h-screen w-full ${openedRequest ? "block" : "hidden "}`}
        >
            <RequestInfo openedRequest={openedRequest} setopenedRequest={setOpenedRequest} />
        </div>
    </>)
}