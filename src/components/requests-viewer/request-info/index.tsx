import { JsonPresentation } from "@/components/json-presentation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import "./request-info.styles.scss";

export function RequestInfo(props: {
    openedRequest: Prisma.requestGetPayload<{ include: { response: true } }> | null,
    setopenedRequest: Dispatch<SetStateAction<Prisma.requestGetPayload<{ include: { response: true } }> | null>>,
}) {
    const requestUrl = new URL(props.openedRequest?.url ?? "http://127.0.0.1/");
    return (<>
        {props.openedRequest && (
            <div
                key={`erq-${props.openedRequest.id}`}
                className="flex flex-col fixed max-h-screen h-screen overflow-y-auto w-[50%]"
            >
                <div className="flex w-100 flex-col bg-zinc-100">
                    <div className="text-gray-500 text-center w-100 flex justify-between">
                        <div className="flex items-center px-1">
                            {dayjs(props.openedRequest.created_at).format(
                                "DD.MM.YYYY HH:mm:ss"
                            )}
                        </div>
                        <div
                            className="p-2 cursor-pointer select-none flex items-center"
                            onClick={() => props.setopenedRequest(null)}
                        >
                            x
                        </div>
                    </div>
                    <div className="flex relative flex-row">
                        <div className={`p-1 method-${props.openedRequest.method}`}>
                            {props.openedRequest.method}
                        </div>
                        <table cellSpacing="2" cellPadding="3" className="request-info-table mx-2 gap-3 spacing">
                            <tr>
                                <td>Сервер</td>
                                <td>{requestUrl.host}</td>
                            </tr>
                            <tr>
                                <td>Протокол</td>
                                <td>{requestUrl.protocol}</td>
                            </tr>
                            <tr>
                                <td>Путь</td>
                                <td className=" text-wrap text-ellipsis">{requestUrl.pathname}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="bg-stone-300 p-2 gap-2 flex flex-wrap">
                    <div className="font-bold select-none w-full text-end">Запрос</div>
                    <pre className="w-full">
                        <JsonPresentation
                            value={(() => {
                                const search = new URL(props.openedRequest.url).search.substring(
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
                            value={props.openedRequest.headers}
                            name="headers"
                            title="Заголовки"
                        />
                    </pre>
                    {props.openedRequest.method.toLowerCase() != "get" && (
                        <pre className="w-full">
                            <JsonPresentation
                                value={props.openedRequest.payload}
                                name="payload"
                                title="Содержимое"
                            />
                        </pre>
                    )}
                </div>
                <div className=" bg-stone-300 p-2 gap-2 flex flex-wrap">
                    <div className="w-full font-bold select-none text-end">Ответ</div>
                    <pre className="w-full">
                        <JsonPresentation
                            value={props.openedRequest.response?.headers}
                            name="headers"
                            title="Заголовки"
                        />
                    </pre>
                    <pre className="w-full">
                        <JsonPresentation
                            value={props.openedRequest.response?.payload}
                            name="payload"
                            title="Содержимое"
                        />
                    </pre>
                </div>
            </div>
        )}
    </>)
}