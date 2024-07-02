import { GenericNode, GenericParent } from "myst-common";
import { mystToHtml } from "myst-to-html";
import { NodeRenderer, ThemeProvider } from "@myst-theme/providers";
import { MyST, DEFAULT_RENDERERS } from "myst-to-react";
import { HELLO_RENDERERS } from "./hello";
import { PULLREQUEST_RENDERERS } from "./PR";

let CUSTOM_RENDERERS: Record<string, NodeRenderer> = Object.assign(
  DEFAULT_RENDERERS,
  HELLO_RENDERERS,
  PULLREQUEST_RENDERERS
);

function DefaultComponent({ node }: { node: GenericNode }) {
  const specialTypes = ["math", "heading", "list"];
  if (!node.children && !specialTypes.includes(node.type))
    return <span>{node.value}</span>;
  if (node.type === "math") {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: node.html }} />
      </>
    );
  }
  if (node.type === "heading" || node.type === "list") {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: mystToHtml(node as GenericParent),
          }}
        />
      </>
    );
  } else {
    return (
      <ThemeProvider renderers={{ ...CUSTOM_RENDERERS }}>
        <MyST ast={node.children} />
      </ThemeProvider>
    );
  }
}

interface IProps {
  tree: GenericParent;
}

export function MarkdownRenderer(props: IProps) {
  return (
    <>
      <label>
        <p className="text-instruction-class">
          After parsing, rendered content looks like:
        </p>
        <div className="markdown-preview-class">
          {props.tree.children.map((child, index) => (
            <li className="node-list-class" key={index}>
              <DefaultComponent node={child}></DefaultComponent>
            </li>
          ))}
        </div>
      </label>
    </>
  );
}
