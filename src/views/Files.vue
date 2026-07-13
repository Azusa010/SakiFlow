<template>
  <div class="files-page">
    <div class="page-header">
      <div>
        <h1>文件中心</h1>
        <p>上传资料并进行 AI 内容分析。</p>
      </div>
    </div>

    <FileUploader @select="fileStore.addFiles" />

    <NGrid class="files-content" cols="1 m:3" x-gap="16" y-gap="16">
      <NGridItem span="1">
        <NCard title="我的文件" :segmented="{ content: true }">
          <NEmpty v-if="fileStore.files.length === 0" description="还没有上传文件" />

          <NList v-else hoverable clickable>
            <NListItem v-for="file in fileStore.files" :key="file.id" class="file-list-item"
              :class="{ active: file.id === fileStore.selectedFileId }" @click="fileStore.selectFile(file.id)">
              <div class="file-item-content">
                <div class="file-item-main">
                  <strong>{{ file.name }}</strong>
                  <span>{{ formatFileSize(file.size) }} · {{ file.uploadedAt }}</span>
                </div>

                <div class="file-item-actions">
                  <NTag size="small" :type="getStatusType(file.status)">
                    {{ getStatusLabel(file.status) }}
                  </NTag>

                  <NButton text type="error" size="small" @click.stop="fileStore.removeFile(file.id)">
                    删除
                  </NButton>
                </div>
              </div>
            </NListItem>
          </NList>
        </NCard>
      </NGridItem>

      <NGridItem span="2">
        <NCard title="文件详情">
          <NEmpty v-if="!fileStore.selectedFile" description="从左侧选择一个文件查看详情" />

          <template v-else>
            <div class="file-detail">
              <div class="detail-row">
                <span>文件名称</span>
                <strong>{{ fileStore.selectedFile.name }}</strong>
              </div>

              <div class="detail-row">
                <span>文件大小</span>
                <strong>{{ formatFileSize(fileStore.selectedFile.size) }}</strong>
              </div>

              <div class="detail-row">
                <span>文件类型</span>
                <strong>{{ fileStore.selectedFile.type }}</strong>
              </div>

              <div class="detail-row">
                <span>当前状态</span>
                <NTag :type="getStatusType(fileStore.selectedFile.status)">
                  {{ getStatusLabel(fileStore.selectedFile.status) }}
                </NTag>
              </div>
            </div>

            <div class="file-preview">
              <h3>文件预览</h3>

              <pre v-if="fileStore.selectedFile.previewKind === 'text'" class="text-preview">
                {{ fileStore.selectedFile.previewContent }}
              </pre>

              <iframe v-else-if="fileStore.selectedFile.previewKind === 'pdf'" class="pdf-preview"
                :src="fileStore.selectedFile.previewUrl" :title="`${fileStore.selectedFile.name} 预览`"></iframe>

              <NEmpty v-else size="small" description="暂不支持预览此类型文件"> </NEmpty>
            </div>

            <NButton type="primary" :loading="fileStore.selectedFile.status === 'analyzing'"
              :disabled="fileStore.selectedFile.status === 'completed'"
              @click="handleAnalyze(fileStore.selectedFile.id)">
              {{
                fileStore.selectedFile.status === 'completed'
                  ? '分析已完成'
                  : '开始 AI 分析'
              }}
            </NButton>

            <NCard v-if="fileStore.selectedFile.analysis" class="analysis-result" title="分析结果" size="small">
              {{ fileStore.selectedFile.analysis }}
            </NCard>
          </template>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>
<script setup lang="ts">
import FileUploader from '@/components/FileUploader.vue';
import { useFileStore, type fileStatus } from '@/stores/file';
import { NButton, NCard, NEmpty, NGrid, NGridItem, NList, NListItem, NTag } from 'naive-ui';

const fileStore = useFileStore()

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

// 根据文件处理状态返回页面显示文字
function getStatusLabel(status: fileStatus): string {
  const lables: Record<fileStatus, string> = {
    ready: '待分析',
    analyzing: '分析中',
    completed: '已完成',
  }
  return lables[status]
}

// 根据文件状态返回Naive UI标签颜色
function getStatusType(status: fileStatus): 'default' | 'warning' | 'success' {
  const types: Record<fileStatus, 'default' | 'warning' | 'success'> = {
    ready: 'default',
    analyzing: 'warning',
    completed: 'success',
  }
  return types[status]
}

function handleAnalyze(id: string): void {
  void fileStore.analyzeFile(id)
}
</script>


<style scoped>
.files-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.page-header p {
  margin: 8px 0 0;
  color: var(--text-secondary);
}

.files-content {
  margin-top: 4px;
}

.file-list-item {
  cursor: pointer;
  border-radius: 8px;
}

.file-list-item.active {
  background: var(--primary-soft);
}

.file-item-content,
.file-item-actions,
.detail-row {
  display: flex;
  align-items: center;
}

.file-item-content {
  justify-content: space-between;
  gap: 12px;
}

.file-item-main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.file-item-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-item-main span {
  color: var(--text-muted);
  font-size: 12px;
}

.file-item-actions {
  gap: 8px;
}

.file-detail {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.detail-row {
  justify-content: space-between;
  gap: 16px;
  color: var(--text-secondary);
}

.detail-row strong {
  color: var(--text-primary);
  text-align: right;
  word-break: break-all;
}

.analysis-result {
  margin-top: 20px;
  line-height: 1.8;
}

.file-preview {
  margin-bottom: 20px;
}

.file-preview h3 {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 15px;
}

.text-preview {
  max-height: 260px;
  margin: 0;
  overflow: auto;
  padding: 14px;
  border-radius: 8px;
  background: var(--surface-muted);
  color: var(--text-primary);
  font: 13px/1.7 Consolas, 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.pdf-preview {
  display: block;
  width: 100%;
  height: 360px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
</style>
