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
    <div className=" py-2 px-3">
      {props.title && <div>{props.title}</div>}
      <JsonView
        displayDataTypes={false}
        collapsed={true}
        enableClipboard={false}
        value={valueObject}
      />
    </div>
  );
}
