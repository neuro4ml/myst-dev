import { useState } from 'react';
import {
  json,
  type V2_MetaFunction,
  type LinksFunction,
  type LoaderFunction,
} from '@remix-run/node';
import { getProject, isFlatSite, type PageLoader } from '@myst-theme/common';
import {
  KatexCSS,
  useOutlineHeight,
  useTocHeight,
  Navigation,
  TopNav,
  getMetaTagsForArticle,
  ArticlePageCatchBoundary,
} from '@myst-theme/site';
import { getConfig, getPage } from '~/utils/loaders.server';
import { useLoaderData } from '@remix-run/react';
import type { SiteManifest } from 'myst-config';
import {
  TabStateProvider,
  UiStateProvider,
  useBaseurl,
  useSiteManifest,
  useThemeTop,
  ProjectProvider,
  GridSystemProvider,
} from '@myst-theme/providers';
import { MadeWithMyst } from '@myst-theme/icons';
import { ComputeOptionsProvider, ThebeLoaderAndServer } from '@myst-theme/jupyter';
import { ArticlePage } from '../components/ArticlePage.js';
import type { TemplateOptions } from '../types.js';
type ManifestProject = Required<SiteManifest>['projects'][0];

export const meta: V2_MetaFunction = ({ data, matches, location }) => {
  if (!data) return [];

  const config: SiteManifest = data.config;
  const project: ManifestProject = data.project;
  const page: PageLoader['frontmatter'] = data.page.frontmatter;

  const siteTitle = config?.title ?? project?.title ?? '';

  return getMetaTagsForArticle({
    origin: '',
    url: location.pathname,
    title: page?.title ? `${page.title}${siteTitle ? ` - ${siteTitle}` : ''}` : siteTitle,
    description: page?.description ?? project?.description ?? config?.description ?? undefined,
    image:
      (page?.thumbnailOptimized || page?.thumbnail) ??
      (project?.thumbnailOptimized || project?.thumbnail) ??
      undefined,
    twitter: config?.options?.twitter,
    keywords: page?.keywords ?? project?.keywords ?? config?.keywords ?? [],
  });
};

export const links: LinksFunction = () => [KatexCSS];

export const loader: LoaderFunction = async ({ params, request }) => {
  const [first, second] = new URL(request.url).pathname.slice(1).split('/');
  const projectName = second ? first : undefined;
  const slug = second || first;
  const config = await getConfig();
  const project = getProject(config, projectName ?? slug);
  const flat = isFlatSite(config);
  const page = await getPage(request, {
    project: flat ? projectName : projectName ?? slug,
    slug: flat ? slug : projectName ? slug : undefined,
    redirect: process.env.MODE === 'static' ? false : true,
  });
  return json({ config, page, project });
};

export function ArticlePageAndNavigation({
  children,
  hide_toc,
  projectSlug,
  inset = 20, // begin text 20px from the top (aligned with menu)
}: {
  hide_toc?: boolean;
  projectSlug?: string;
  children: React.ReactNode;
  inset?: number;
}) {
  const top = useThemeTop();
  const { container, toc } = useTocHeight(top, inset);
  return (
    <UiStateProvider>
      <TopNav />
      <Navigation
        tocRef={toc}
        hide_toc={hide_toc}
        footer={<MadeWithMyst />}
        projectSlug={projectSlug}
      />
      <TabStateProvider>
        <article ref={container} className="article content h-screen fixed" style={{ marginTop: top }}>
          {children}
        </article>
      </TabStateProvider>
    </UiStateProvider>
  );
}

export default function Page() {
  const data = useLoaderData() as { page: PageLoader; project: ManifestProject };
  const baseurl = useBaseurl();
  const pageDesign: TemplateOptions = (data.page.frontmatter as any)?.options ?? {};
  const siteDesign: TemplateOptions =
    (useSiteManifest() as SiteManifest & TemplateOptions)?.options ?? {};
  const { hide_toc, hide_footer_links } = {
    ...siteDesign,
    ...pageDesign,
  };
  const [hideTOC, setHideTOC] = useState(true);

  const inset = 20; // begin text 20px from the top (aligned with menu)

  const top = useThemeTop();
  const { container, toc } = useTocHeight(top, inset);
  
  return (
    <ArticlePageAndNavigation hide_toc={hideTOC} projectSlug={data.page.project}>
      <ProjectProvider>
        <ComputeOptionsProvider
          features={{ notebookCompute: true, figureCompute: true, launchBinder: false }}
        >
          <ThebeLoaderAndServer baseurl={baseurl}>
            <ArticlePage 
              article={data.page} 
              hide_all_footer_links={hide_footer_links}
              tocRef={toc}
              projectSlug={data.page.project}
              footer={<MadeWithMyst />} 
              hideTOC={hideTOC}
              setHideTOC={setHideTOC} 
            />
          </ThebeLoaderAndServer>
        </ComputeOptionsProvider>
      </ProjectProvider>
    </ArticlePageAndNavigation>
  );
}

export function CatchBoundary() {
  return (
    <ArticlePageAndNavigation>
      <main className="article">
        <ArticlePageCatchBoundary />
      </main>
    </ArticlePageAndNavigation>
  );
}