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
import VideoVolume from './VideoVolume.js';
import ContainerHider from './ContainerHider.js';
import VidHider from './VidHider.js';
import SidebarMedia from './SidebarMedia.js';
import { MyST } from 'myst-to-react';


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

function deepCopyNode(node: GenericNode): GenericNode {
  return {
    ...node,
    children: node.children ? node.children.map(child => deepCopyNode(child)) : undefined,
  };
}

const TOP_OFFSET = 33;

export const ArticlePage = React.memo(function ({
  article,
  hide_all_footer_links,
  hideKeywords,
}: {
  article: PageLoader;
  hide_all_footer_links?: boolean;
  hideKeywords?: boolean;
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

  const sideBarTypes = 'container,proof,math';
  const containers: GenericNode[] = [];
  const videos: GenericNode[] = [];
  let IDCount = 0;
  visit(tree, (node, index, parent) => {
    if (matches(sideBarTypes, node)) {
      if(!node.identifier) {
        node.identifier = "alloc_node_" + IDCount++;
      } 
      containers.push(node);
  
      return SKIP;
    }
  });

  const gridChoice = 'none';
  return (
    <GridSystemProvider gridSystem={gridChoice}>
      <div className="flex flex-row h-screen">
        <main className={`${showSidebar ? 'w-8/12' : 'w-full visible'} h-full px-4 overflow-auto`}>
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
        <SidebarMedia showSidebar={showSidebar} containers={containers} />
      </div>
    </GridSystemProvider>
  );
});