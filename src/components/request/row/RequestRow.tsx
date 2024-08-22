import { Prisma } from "@prisma/client";

export interface RequestRowProps {
  selected?: boolean;
  request: Prisma.requestGetPayload<{ include: { response: true } }>;
  openHandler: (
    req: Prisma.requestGetPayload<{ include: { response: true } }>
  ) => void;
}

export function RequestRow(props: RequestRowProps) {
  return (
    <div
      onClick={() => props.openHandler(props.request)}
      id={props.request.id}
      className={`flex w-full ${props.selected ? "bg-stone-100" : "bg-white"} hover:bg-stone-100 cursor-pointer`}
    >
      <div className={`p-2 method-${props.request.method}`}>
        {props.request.method}
      </div>
      <div className="p-2 ms-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {props.request.url}
      </div>
    </div>
  );
}
