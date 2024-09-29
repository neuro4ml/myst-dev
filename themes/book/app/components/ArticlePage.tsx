import React, { useState } from 'react';
import {
  GridSystemProvider,
  ReferencesProvider,
  useProjectManifest,
  useSiteManifest,
  useThemeTop,
} from '@myst-theme/providers';
import classNames from 'classnames';
import {
  Bibliography,
  ContentBlocks,
  FooterLinksBlock,
  FrontmatterParts,
  BackmatterParts,
  DocumentOutline,
  extractKnownParts,
  Footnotes,
  DEFAULT_NAV_HEIGHT,
} from '@myst-theme/site';
import type { SiteManifest } from 'myst-config';
import type { PageLoader } from '@myst-theme/common';
import { copyNode, GenericNode, type GenericParent } from 'myst-common';
import { SourceFileKind } from 'myst-spec-ext';
import {
  ExecuteScopeProvider,
  BusyScopeProvider,
  NotebookToolbar,
  ConnectionStatusTray,
  ErrorTray,
  useComputeOptions,
} from '@myst-theme/jupyter';
import { FrontmatterBlock } from '@myst-theme/frontmatter';
import type { SiteAction } from 'myst-config';
import type { TemplateOptions } from '../types.js';
import { matches } from 'unist-util-select';
import { remove } from 'unist-util-remove';
import { visit, SKIP } from 'unist-util-visit';
import SidebarMedia from './SidebarMedia.js';
import { MyST } from 'myst-to-react';
import Split from 'react-split';
import GutterStyle from './GutterStyle.js';
import ControlBar from './ControlBar.js';


/**
 * Combines the project downloads and the export options
 */
function combineDownloads(
  siteDownloads: SiteAction[] | undefined,
  pageFrontmatter: PageLoader['frontmatter'],
) {
  if (pageFrontmatter.downloads) {
    return pageFrontmatter.downloads;
  }
  // No downloads on the page, combine the exports if they exist
  if (siteDownloads) {
    return [...(pageFrontmatter.exports ?? []), ...siteDownloads];
  }
  return pageFrontmatter.exports;
}

function AddPlaybackAttributes({node}: {node: any}) {
  let source = node.src;
  if(source) {
    if(source.indexOf("?") == -1) {
      source += "?";
    }
    // if(source.indexOf("autoplay") == -1) {
    //   source += "&autoplay=1";
    // }
    if(source.indexOf("controls") == -1) {
      source += "&controls=0";
    }
    if(source.indexOf("enablejsapi") == -1) {
      source += "&enablejsapi=1";
    }
  }
  
  return(source);
}

const TOP_OFFSET = 33;

export const ArticlePage = React.memo(function ({
  article,
  hide_all_footer_links,
  hideKeywords,
  hideTOC,
  setHideTOC,
}: {
  article: PageLoader;
  hide_all_footer_links?: boolean;
  hideKeywords?: boolean;
  hideTOC?: boolean;
  setHideTOC?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const manifest = useProjectManifest();
  const compute = useComputeOptions();
  const top = useThemeTop();

  const pageDesign: TemplateOptions = (article.frontmatter as any)?.options ?? {};
  const siteDesign: TemplateOptions =
    (useSiteManifest() as SiteManifest & TemplateOptions)?.options ?? {};
  const { hide_title_block, hide_footer_links, hide_outline, outline_maxdepth } = {
    ...siteDesign,
    ...pageDesign,
  };
  const downloads = combineDownloads(manifest?.downloads, article.frontmatter);
  const tree = copyNode(article.mdast);
  const keywords = article.frontmatter?.keywords ?? [];
  const parts = extractKnownParts(tree);

  const [showSidebar, setShowSidebar] = useState(true);

  const [sizes, setSizes] = useState(showSidebar ? [50, 50] : [100, 0]);

  const sidebarMediaTypes = 'container,proof,math';
  const sidebarVideoTypes = 'iframe';
  const sidebarMedia: GenericNode[] = [];
  const sidebarVideos: GenericNode[] = [];
  let IDCount = 0;
  visit(tree, (node) => {
    if (matches(sidebarMediaTypes, node)) {
      if(!node.identifier) {
        node.identifier = "alloc_node_" + IDCount++;
      } 
      sidebarMedia.push(node);
      return SKIP;
    }
    else if (matches(sidebarVideoTypes, node)) {
      node.src = AddPlaybackAttributes({node});
      sidebarVideos.push(node);
      return SKIP;
    }
  });

  const gridChoice = 'none';
  return (
    <GridSystemProvider gridSystem={gridChoice}>
      <div className="flex flex-row h-screen">
        <ControlBar 
          hideTOC={hideTOC} 
          setHideTOC={setHideTOC}
          showSidebar={showSidebar} 
          setShowSidebar={setShowSidebar} 
        />
        <Split
          className="flex flex-row"
          sizes={showSidebar ? sizes : [100, 0]}
          minSize={[500, 0]}
          gutterSize={showSidebar ? 10 : 0}
          onDrag={(newSizes) => setSizes(newSizes)}
        >
          <main className={"h-full px-4 overflow-auto"}>
            <ReferencesProvider
              references={{ ...article.references, article: article.mdast }}
              frontmatter={article.frontmatter}
            >
              <BusyScopeProvider>
                <ExecuteScopeProvider enable={compute?.enabled ?? false} contents={article}>
                  {!hide_title_block && (
                    <FrontmatterBlock
                      kind={article.kind}
                      frontmatter={{ ...article.frontmatter, downloads }}
                      className="pt-5 mb-8"
                      authorStyle="list"
                    />
                  )}
                  {compute?.enabled &&
                    compute.features.notebookCompute &&
                    article.kind === SourceFileKind.Notebook && <NotebookToolbar showLaunch />}
                  {compute?.enabled && article.kind === SourceFileKind.Article && (
                    <ErrorTray pageSlug={article.slug} />
                  )}
                  <div id="skip-to-article" />
                  <FrontmatterParts parts={parts} keywords={keywords} hideKeywords={hideKeywords} />
                  <button onClick={() => setShowSidebar(!showSidebar)}>
                    Toggle Sidebar
                  </button>
                  <ContentBlocks pageKind={article.kind} mdast={tree as GenericParent} />
                  <BackmatterParts parts={parts} />
                  <Footnotes />
                  <Bibliography />
                  <ConnectionStatusTray />
                  {!hide_footer_links && !hide_all_footer_links && (
                    <FooterLinksBlock links={article.footer} />
                  )}
                </ExecuteScopeProvider>
              </BusyScopeProvider>
            </ReferencesProvider>
          </main>
          <div style={{ display: showSidebar ? 'block' : 'none', width: showSidebar ? 'auto' : '0' }}>
            <SidebarMedia showSidebar={showSidebar} sidebarMedia={sidebarMedia} sidebarVideos={sidebarVideos} />
          </div>
        </Split>
        <GutterStyle />
      </div>
    </GridSystemProvider>
  );  
});