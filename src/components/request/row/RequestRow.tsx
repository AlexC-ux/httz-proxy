import { Prisma } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export interface RequestRowProps {
  selected?: boolean;
  request: Prisma.requestGetPayload<{ include: { response: true } }>;
  openHandler: Dispatch<
    SetStateAction<Prisma.requestGetPayload<{
      include: { response: true };
    }> | null>
  >;
}

export function RequestRow(props: RequestRowProps) {
  const requestUrl = new URL(props.request.url);
  return (
    <div
      onClick={() => {
        if (props.selected) {
          props.openHandler(null);
        } else {
          props.openHandler(props.request);
        }
      }}
      id={props.request.id}
      className={`flex w-full ${props.selected ? "bg-stone-100" : "bg-white"} hover:bg-stone-100 cursor-pointer`}
    >
      <div className={`p-2 select-none method-${props.request.method}`}>
        {props.request.method}
      </div>
      <div className="p-2 ms-4 overflow-hidden text-ellipsis whitespace-nowrap select-none">
        {requestUrl.hostname}
      </div>
      <div className="p-2 ms-4 overflow-hidden text-ellipsis whitespace-nowrap select-none">
        {requestUrl.pathname}
      </div>
    </div>
  );
}
