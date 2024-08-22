import { jsonFetcher } from "@/fetcher/jsonFetcher";
import useSWR from "swr";
import { GetRequestsResponseData } from "./api/requests";
import { RequestRow } from "@/components/request/row/RequestRow";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import JsonView from "@uiw/react-json-view";
import { JsonPresentation } from "@/components/json-presentation";
import { RequestViewer } from "@/components/requests-viewer";

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
            <RequestViewer />
        </main>
    );
}
