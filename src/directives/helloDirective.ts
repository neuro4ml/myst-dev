import type { DirectiveSpec, DirectiveData, GenericNode } from "myst-common";

export const helloDirective: DirectiveSpec = {
  name: "hello",
  doc: "hello directive displaying Hello world!",
  options: {
    label: {
      type: String,
      alias: ['name'],
    },
    class: {
      type: String,
      alias: ['hello-world-class'],
      doc: `CSS class for hello world directive:

- \`background-color\`: color for the background`
    }},
  arg: { type: String },
  body: {
    type: String,
    doc: 'The body of the custom directive. If there is no title and the body starts with bold text or a heading, that content will be used as the custom directive title.',
  },
  run: (data: DirectiveData) => {
    const children : GenericNode[] = [];

  
      children.push({
        type: data.name,
        value: data.arg as string
        //value: "hello world!"
      });
    
    return children
  },
};

