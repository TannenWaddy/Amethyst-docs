<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const launcherLogo = withBase('/logo.png')

const { frontmatter, lang } = useData()
const currentYear = new Date().getFullYear()

const isEnglish = computed(() => lang.value === 'en-US')
const hasSidebarLayout = computed(() => frontmatter.value.layout !== 'home')

const copyrightText = computed(() => (
  isEnglish.value ? `${currentYear} © Amethyst Launcher Team` : `${currentYear} © Amethyst Launcher 团队`
))
const disclaimerText = computed(() => (
  isEnglish.value ? `NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.` : `本软件非 Minecraft 官方产品。未经 Mojang 或 Microsoft 批准，也不与 Mojang 或 Minecraft 关联。`
))
</script>

<template>
  <footer
    class="sjmcl-site-footer"
    :class="{ 'sjmcl-site-footer--with-sidebar': hasSidebarLayout }"
  >
    <div class="sjmcl-site-footer__main">
      <div class="sjmcl-site-footer__brand">
        <div class="sjmcl-site-footer__launcher">
          <img
            :src="launcherLogo"
            alt="Amethyst Launcher"
            class="sjmcl-site-footer__launcher-logo"
          >
          <div class="sjmcl-site-footer__title">
            <span>Amethyst</span>
            <span class="highlight">&nbsp;L</span>
            <span>auncher</span>
          </div>
        </div>


      </div>
    </div>

    <div class="sjmcl-site-footer__meta">
      <p>{{ copyrightText }}</p>
	  <p>{{ disclaimerText }}</p>
    </div>
  </footer>
</template>

<style scoped>
.sjmcl-site-footer {
  margin-top: 64px;
  border-top: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.72));
}

.dark .sjmcl-site-footer {
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.44), rgba(15, 23, 42, 0.68));
}

.sjmcl-site-footer__main,
.sjmcl-site-footer__meta {
  margin: 0 auto;
  width: min(1200px, calc(100% - 48px));
}

.sjmcl-site-footer__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 0 28px;
}

.sjmcl-site-footer__brand {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.sjmcl-site-footer__launcher {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sjmcl-site-footer__launcher-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex: 0 0 auto;
}

.sjmcl-site-footer__title {
  display: inline-flex;
  align-items: baseline;
  font-family: "Trebuchet MS", Arial, sans-serif;
  font-size: clamp(1.6rem, 2.4vw, 2.15rem);
  font-weight: 700;
  white-space: nowrap;
}

.sjmcl-site-footer__title .highlight {
  color: #2b6cb0;
}

.dark .sjmcl-site-footer__title .highlight {
  color: #7cc0ff;
}


.sjmcl-site-footer__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 0 28px;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  border-top: 1px solid var(--vp-c-divider);
}

.sjmcl-site-footer__meta p {
  margin: 0;
}

@media (min-width: 960px) {
  .sjmcl-site-footer--with-sidebar {
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .sjmcl-site-footer--with-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

@media (max-width: 960px) {
  .sjmcl-site-footer__main {
    flex-direction: column;
    align-items: flex-start;
  }

  .sjmcl-site-footer__brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .sjmcl-site-footer__meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
