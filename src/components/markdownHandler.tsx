import React, { useState, useEffect } from "react";
import { MarkdownRenderer } from "./markdownRenderer";
import { defaultOptions, mystParse } from "myst-parser";
import { defaultDirectives } from "myst-directives";
import { helloDirective } from "../directives/helloDirective";
import { pullRequestDirective } from "../directives/PRDirective";
import { VFile } from "vfile";
import { GenericParent } from "myst-common";

import {
  captionParagraphTransform,
  liftMystDirectivesAndRolesTransform,
  mathTransform,
  mystTargetsTransform,
} from "myst-transforms";

const allDirectives = defaultDirectives.concat(
  helloDirective,
  pullRequestDirective
);

const customOptions = {
  ...defaultOptions,
  directives: allDirectives,
};

function transformTree(tree: GenericParent) {
  const vfile = new VFile(); // used for logging error messages
  tree.children.forEach((node) => {
    if (node.name === "figure") {
      liftMystDirectivesAndRolesTransform(tree);
      mystTargetsTransform(tree);
    }
    if (node.name === "math" || node.type === "math") {
      mathTransform(tree, vfile, { macros: {} });
    }
    if (node.name === "code") {
      captionParagraphTransform(tree);
    }
    if (node.type === "paragraph") {
      if (node.children) {
        node.children.forEach((child) => {
          if (child.type === "inlineMath")
            mathTransform(tree, vfile, { macros: {} });
        });
      }
    }
  });
}

export function MarkdownHandler() {
  const initial = "test";
  const [postContent, setPostContent] = useState(initial);
  // let tree: GenericParent;
  const [tree, setTree] = useState<GenericParent | null>(null);

  useEffect(() => {
    fetch("/docs/hello.md")
      .then(response => response.text())
      .then(text => {
        setPostContent(text);
        console.log(text);
      })
      .catch(error => console.error('Error loading markdown file:', error));
  }, []);

  // if (postContent.length === 0) {
  //   const emptyNode: GenericNode = { type: "paragraph", value: "" };
  //   tree = { type: "paragraph", children: [emptyNode] };
  // }
  // tree = mystParse(postContent, customOptions);
  
  useEffect(() => {
    if (postContent) {
      const parsedTree = mystParse(postContent, customOptions);
      transformTree(parsedTree);
      setTree(parsedTree);
    }
  }, [postContent]);

  return (
    <>
  
      {tree && <MarkdownRenderer tree={tree} />}

    </>
  );
}
