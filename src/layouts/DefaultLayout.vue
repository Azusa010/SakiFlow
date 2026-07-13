<template>
  <NLayout has-sider class="app-layout">
    <NLayoutSider bordered :width="240" content-style="padding: 20px 12px">
      <div class="brand">SakiFlow</div>

      <NMenu :value="activeMenuKey" :options="menuOptions" @update:value="handleMenuSelect" />
    </NLayoutSider>

    <NLayout>
      <NLayoutHeader bordered class="topbar">
        <NAvatar round size="small">S</NAvatar>
        <span>AI 智能工作流平台</span>
      </NLayoutHeader>

      <NLayoutContent content-style="padding: 24px">
        <!-- 缓存工作区页面 -->
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type MenuOption, NAvatar, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, } from "naive-ui";
import { RouterView, useRoute, useRouter } from "vue-router";


const route = useRoute();
const router = useRouter();

const activeMenuKey = computed(() => route.path)

const menuOptions: MenuOption[] = [
  { label: '工作台', key: '/dashboard' },
  { label: '工作流', key: '/workflow' },
  { label: 'AI 聊天', key: '/chat' },
  { label: '文件中心', key: '/files' },
  { label: '在线编辑器', key: '/editor' },
  { label: '数据统计', key: '/statistics' },
  { label: '设置', key: '/settings' },
]

function handleMenuSelect(key: string | number): void {
  void router.push(String(key))
}
</script>
