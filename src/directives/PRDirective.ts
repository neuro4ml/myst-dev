import type { DirectiveSpec, DirectiveData, GenericNode } from "myst-common";

export const pullRequestDirective: DirectiveSpec = {
  name: "pullrequest",
  doc: "pull request directive",
  options: {
    label: {
      type: String,
      alias: ['name'],
    }},
  arg: { type: String },
  run: (data: DirectiveData) => {
    const children : GenericNode[] = [];
      children.push({
        type: data.name,
        value: data.arg as string
      });
    return children

  },
};
