<template>
  <NUpload multiple :default-upload="false" :show-file-list="false" accept=".pdf,.md,.txt,.doc,.docx"
    @change="handleChange">
    <NUploadDragger>
      <div class="upload-content">
        <NIcon size="42" color="#2563eb">
          <CloudUploadOutline />
        </NIcon>

        <p class="upload-title">拖拽文件到这里</p>
        <p class="upload-description">支持 PDF、MD、TXT、DOC、DOCX </p>
      </div>
    </NUploadDragger>
  </NUpload>
</template>

<script lang="ts" setup>
import { NIcon, NUpload, NUploadDragger, type UploadFileInfo } from 'naive-ui';
import { CloudUploadOutline } from '@vicons/ionicons5';

const emit = defineEmits<{
  select: [files: File[]]
}>()

function isSupportedFile(file: File): boolean {
  return /\.(pdf|md|txt|doc|docx)$/i.test(file.name)
}

// 提取 Naive UI 上传对象中的原生文件，并通知父页面写入 Store。
function handleChange(options: { file: UploadFileInfo }) {
  const rawFile = options.file.file

  if (rawFile && isSupportedFile(rawFile)) {
    emit('select', [rawFile])
  }
}
</script>
<style scoped>
.upload-content {
  padding: 26px 16px;
  text-align: center;
}

.upload-title {
  margin: 12px 0 6px;
  color: #334155;
  font-weight: 600;
}

.upload-description {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}
</style>
