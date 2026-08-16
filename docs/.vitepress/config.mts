import { defineConfig, type DefaultTheme } from "vitepress";

const BASE = "/Amethyst-docs/";
const FAVICON_URL = `${BASE}logo.png`;
const localSearch = {
  provider: "local",
  options: {
    translations: {
      button: {
        buttonText: "搜索",
        buttonAriaLabel: "搜索",
      },
      modal: {
        resetButtonTitle: "清除查询条件",
        backButtonTitle: "关闭搜索",
        noResultsText: "未找到相关结果",
        displayDetails: "显示详细列表",
        footer: {
          selectText: "选择",
          selectKeyAriaLabel: "回车键",
          navigateText: "切换",
          navigateUpKeyAriaLabel: "向上方向键",
          navigateDownKeyAriaLabel: "向下方向键",
          closeText: "关闭",
          closeKeyAriaLabel: "Esc 键",
        },
      },
    },
  },
} as const;

function createBreadcrumbs(relativePath: string, title: string) {
  const normalized = relativePath.replace(/(^\/|\/$)/g, "");
  const segments = normalized.split("/").filter(Boolean);
  const contentSegments = segments[0] === "zh-Hant" ? segments.slice(1) : segments;

  if (!segments.length || normalized === "index.md") return [];

  if (contentSegments[0] === "blog" || contentSegments[0] === "about")
    return [];

  const isZhHant = segments[0] === "zh-Hant";
  const labels: Record<string, string> = isZhHant
    ? {
        docs: "文檔",
        instance: "遊戲實例",
        intelligence: "智慧",
        dev: "開發者",
        "visual-identity": "視覺形象",
        extension: "擴展",
        blog: "部落格",
        about: "關於",
      }
    : {
        docs: "文档",
        instance: "游戏实例",
        intelligence: "智能",
        dev: "开发者",
        "visual-identity": "视觉形象",
        extension: "扩展",
        blog: "博客",
        about: "关于",
      };

  const breadcrumbs: { title: string; link: string }[] = [];

  for (let i = isZhHant ? 1 : 0; i < segments.length; i++) {
    const segment = segments[i];

    if (segment === "index.md") continue;

    const isLast = i === segments.length - 1;
    const breadcrumbTitle = isLast ? title : labels[segment] || segment;
    const partial = segments.slice(0, i + 1).join("/");
    const link = isLast
      ? `/${partial.replace(/\.md$/, "")}`
      : `/${partial.replace(/\/index\.md$/, "/").replace(/index\.md$/, "")}`;

    breadcrumbs.push({
      title: breadcrumbTitle,
      link: isLast ? link : link.endsWith("/") ? link : `${link}/`,
    });
  }

  if (breadcrumbs.length > 1) breadcrumbs[breadcrumbs.length - 1].link = "";

  return breadcrumbs;
}

const sharedThemeConfig = {
  logo: "/logo.png",
  siteTitle: false,
  socialLinks: [{ icon: "github", link: "https://github.com/TannenWaddy/Amethyst-Launcher" }],
  search: localSearch,
} satisfies DefaultTheme.Config;

function isChangelogPage(env: unknown) {
  const pageEnv = env as { relativePath?: unknown; path?: unknown };
  const relativePath =
    typeof pageEnv.relativePath === "string"
      ? pageEnv.relativePath
      : typeof pageEnv.path === "string"
        ? pageEnv.path
        : "";

  return /(^|\/)(zh-Hans\/|zh-Hant\/)?docs\/changelog\.md$/.test(relativePath);
}

function renderChangelogGitHubMarks(text: string, escapeHtml: (str: string) => string) {
  const tokenPattern = /#[0-9]+|@[A-Za-z0-9-]+(?:\[bot\])?/g;
  let result = "";
  let lastIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    result += escapeHtml(text.slice(lastIndex, index));

    if (token.startsWith("#")) {
      const prNumber = token.slice(1);
      result += `<a class="arcmc-changelog-ref" href="https://github.com/UNIkeEN/SJMCL/pull/${prNumber}" target="_blank" rel="noreferrer">${escapeHtml(token)}</a>`;
    } else {
      const username = token.slice(1).replace(/\[bot\]$/, "");
      result += `<a class="arcmc-changelog-ref arcmc-changelog-mention" href="https://github.com/${username}" target="_blank" rel="noreferrer"><strong>${escapeHtml(token)}</strong></a>`;
    }

    lastIndex = index + token.length;
  }

  result += escapeHtml(text.slice(lastIndex));
  return result;
}

export default defineConfig({
  title: "Amethyst Launcher",
  description: "Docs for the Amethyst Launcher",
  base: BASE,
  themeConfig: {
    search: localSearch,
  },
  head: [
    ["link", { rel: "icon", type: "image/png", href: FAVICON_URL }],
    ["link", { rel: "apple-touch-icon", href: FAVICON_URL }],
  ],
  lastUpdated: true,
  rewrites: (id) =>
    id.startsWith("zh-Hans/") ? id.slice("zh-Hans/".length) : id,
  markdown: {
    config(md) {
      const defaultTextRenderer =
        md.renderer.rules.text ??
        ((tokens, idx) => md.utils.escapeHtml(tokens[idx].content));

      md.renderer.rules.text = (tokens, idx, options, env, self) => {
        if (!isChangelogPage(env)) {
          return defaultTextRenderer(tokens, idx, options, env, self);
        }

        return renderChangelogGitHubMarks(tokens[idx].content, md.utils.escapeHtml);
      };
    },
  },
  vite: {
    ssr: {
      noExternal: [
        "@nolebase/vitepress-plugin-breadcrumbs",
        "@nolebase/vitepress-plugin-enhanced-readabilities",
        "@nolebase/ui",
      ],
    },
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      themeConfig: {
        ...sharedThemeConfig,
        nav: [
          { text: "下载", link: "/downloads/", activeMatch: "^/downloads/" },
          { text: "文档", link: "/docs/", activeMatch: "^/docs/" },
          { text: "开发者", link: "/dev/", activeMatch: "^/dev/" },
          { text: "博客", link: "/blog/", activeMatch: "^/blog/" },
          { text: "关于", link: "/about/", activeMatch: "^/about/" }
        ],
        sidebar: {
          "/docs/": [
            {
              text: "快速开始",
              collapsed: false,
              items: [
                { text: '简介', link: '/docs/' },
                { text: '下载与安装', link: '/docs/install' },
                { text: '新手教程', link: '/docs/beginners-guide' }
              ]
            },
            {
              text: "游戏实例",
              collapsed: false,
              items: [
                {
                  text: '模组与加载器',
                  link: '/docs/instance/mod-loader'
                }
              ]
            },
            {
              text: "智能",
              collapsed: false,
              items: [
                {
                  text: "启动器 MCP 服务",
                  link: "/docs/intelligence/launcher-mcp",
                },

              ],
            },
            { text: "背景图库", link: "/docs/background-gallery" },
            { text: "更新日志", link: "/docs/changelog" },
            { text: "用户协议", link: "/docs/tos" },
            { text: "用户社群", link: "/docs/user-group" },
          ],
          "/dev/": [
            {
              text: "开发者",
              items: [
                { text: "概览", link: "/dev/" },
                { text: "基础工作流", link: "/dev/guide" },
                { text: "开源协议", link: "/dev/license" },
              ],
            },
            {
              text: "扩展",
              items: [
                {
                  text: "系统介绍",
                  link: "/dev/extension/",
                },
                {
                  text: "文件结构",
                  link: "/dev/extension/file-structure",
                },
                {
                  text: "快速开始（使用脚手架）",
                  link: "/dev/extension/quick-start-scaffold",
                },
                {
                  text: "快速开始（手动编写）",
                  link: "/dev/extension/quick-start",
                },
                {
                  text: "API",
                  link: "/dev/extension/api",
                },
              ],
            },
            {
              text: "外部集成",
              items: [{ text: "Deeplink API", link: "/dev/deeplink-api" }],
            },
            {
              text: "视觉形象",
              items: [
                {
                  text: "概览",
                  link: "/dev/visual-identity/"
                },
                {
                  text: "徽标",
                  link: "/dev/visual-identity/icon"
                },
              ],
            },
          ],
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },
        outline: {
          label: "页面导航",
        },
        lastUpdated: {
          text: "最后更新于",
          formatOptions: {
            dateStyle: "short",
            timeStyle: "medium",
          },
        },
        langMenuLabel: "多语言",
        returnToTopLabel: "回到顶部",
        sidebarMenuLabel: "菜单",
        darkModeSwitchLabel: "主题",
        lightModeSwitchTitle: "切换到浅色模式",
        darkModeSwitchTitle: "切换到深色模式",
      },
    },
    "zh-Hant": {
      label: "繁體中文",
      lang: "zh-TW",
      link: "/zh-Hant/",
      themeConfig: {
        ...sharedThemeConfig,
        nav: [
          { text: "下載", link: "/zh-Hant/downloads/", activeMatch: "^/zh-Hant/downloads/" },
          { text: "文檔", link: "/zh-Hant/docs/", activeMatch: "^/zh-Hant/docs/" },
          { text: "開發者", link: "/zh-Hant/dev/", activeMatch: "^/zh-Hant/dev/" },
          { text: "部落格", link: "/zh-Hant/blog/", activeMatch: "^/zh-Hant/blog/" },
          { text: "關於", link: "/zh-Hant/about/", activeMatch: "^/zh-Hant/about/" }
        ],
        sidebar: {
          "/zh-Hant/docs/": [
            {
              text: "快速開始",
              collapsed: false,
              items: [
                { text: '簡介', link: '/zh-Hant/docs/' },
                { text: '下載與安裝', link: '/zh-Hant/docs/install' },
                { text: '新手教學', link: '/zh-Hant/docs/beginners-guide' }
              ]
            },
            {
              text: "遊戲實例",
              collapsed: false,
              items: [
                {
                  text: '模組與載入器',
                  link: '/zh-Hant/docs/instance/mod-loader'
                }
              ]
            },
            {
              text: "智慧",
              collapsed: false,
              items: [
                {
                  text: "啟動器 MCP 服務",
                  link: "/zh-Hant/docs/intelligence/launcher-mcp",
                },

              ],
            },
            { text: "背景圖庫", link: "/zh-Hant/docs/background-gallery" },
            { text: "更新日誌", link: "/zh-Hant/docs/changelog" },
            { text: "使用者協議", link: "/zh-Hant/docs/tos" },
            { text: "使用者社群", link: "/zh-Hant/docs/user-group" },
          ],
          "/zh-Hant/dev/": [
            {
              text: "開發者",
              items: [
                { text: "概覽", link: "/zh-Hant/dev/" },
                { text: "基礎工作流", link: "/zh-Hant/dev/guide" },
                { text: "開源協議", link: "/zh-Hant/dev/license" },
              ],
            },
            {
              text: "擴展",
              items: [
                {
                  text: "系統介紹",
                  link: "/zh-Hant/dev/extension/",
                },
                {
                  text: "檔案結構",
                  link: "/zh-Hant/dev/extension/file-structure",
                },
                {
                  text: "快速開始（使用腳手架）",
                  link: "/zh-Hant/dev/extension/quick-start-scaffold",
                },
                {
                  text: "快速開始（手動編寫）",
                  link: "/zh-Hant/dev/extension/quick-start",
                },
                {
                  text: "API",
                  link: "/zh-Hant/dev/extension/api",
                },
              ],
            },
            {
              text: "外部整合",
              items: [{ text: "Deeplink API", link: "/zh-Hant/dev/deeplink-api" }],
            },
            {
              text: "視覺形象",
              items: [
                {
                  text: "概覽",
                  link: "/zh-Hant/dev/visual-identity/"
                },
                {
                  text: "徽標",
                  link: "/zh-Hant/dev/visual-identity/icon"
                },
              ],
            },
          ],
        },
        docFooter: {
          prev: "上一頁",
          next: "下一頁",
        },
        outline: {
          label: "頁面導航",
        },
        lastUpdated: {
          text: "最後更新於",
          formatOptions: {
            dateStyle: "short",
            timeStyle: "medium",
          },
        },
        langMenuLabel: "多語言",
        returnToTopLabel: "回到頂部",
        sidebarMenuLabel: "選單",
        darkModeSwitchLabel: "主題",
        lightModeSwitchTitle: "切換到淺色模式",
        darkModeSwitchTitle: "切換到深色模式",
      },
    },
  },
  transformPageData(pageData) {
    pageData.frontmatter.breadcrumbs = createBreadcrumbs(
      pageData.relativePath,
      pageData.title,
    );
  },
});
