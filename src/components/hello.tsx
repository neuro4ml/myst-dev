import { NodeRenderer } from "@myst-theme/providers";

const helloRenderer: NodeRenderer = ({ node }) => {
  console.log("In renderer, node.value is ", node.value);
  console.log('node:', node.value)
  if (node.type === "hello") {
    return (
      <span
        className="hello-world-class"> {node.value}</span>
    );
  }
};

export const HELLO_RENDERERS = {
  hello: helloRenderer,
};

