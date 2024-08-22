import JsonView from "@uiw/react-json-view";

export function JsonPresentation(props: {
  value: any;
  name?: string;
  title?: string;
}) {
  let valueObject: any = {};
  if (typeof props.value === "string") {
    try {
      valueObject = JSON.parse(props.value);
    } catch (error) {
      valueObject[props.name ?? "root"] = props.value;
    }
  }
  return (
    <div className=" py-2 px-3 bg-white rounded-md">
      <div>{props.title && <div className="ps-1">{props.title}</div>}</div>
      <div className="p-2 border-2 border-gray-300 rounded-md mt-3 break-all">
        <JsonView
          displayDataTypes={false}
          collapsed={true}
          enableClipboard={false}
          value={valueObject}
        />
      </div>
    </div>
  );
}
