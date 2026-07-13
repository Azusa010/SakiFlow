<template>
  <div ref="editorContainer" class="code-editor" :style="{ height }"></div>

</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// 为Monaco 的不同语言能力提供对应的Web Worker
self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string): Worker {
    if (label === 'json') return new JsonWorker()
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker()
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new HtmlWorker()
    if (label === 'typescript' || label === 'javascript') return new TsWorker()
    return new EditorWorker()
  }
}

interface CodeEditorProps {
  modelValue: string
  language?: string
  readonly?: boolean
  height?: string
  theme?: 'vs' | 'vs-dark'
}

const props = withDefaults(defineProps<CodeEditorProps>(), {
  language: 'typescript',
  readonly: false,
  height: '480px',
  theme: 'vs'
})


const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()


// Monaco挂载节点
const editorContainer = ref<HTMLElement | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null

//初始化编辑器并监听用输入
function createEditor() {
  if (!editorContainer.value) return

  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    readOnly: props.readonly,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 22,
    scrollBeyondLastLine: false,
  })

  // 监听编辑器内容变化
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor?.getValue() || '')
  })
}

onMounted(() => {
  createEditor()
})

async function formatDocument():Promise<void> {
  await editor?.getAction('editor.action.formatDocument')?.run()
}
defineExpose({
  formatDocument
})

watch(() => props.modelValue, (value) => {
  if (editor && value !== editor.getValue()) {
    editor.setValue(value)
  }
})

watch(() => props.language, (language) => {
  const model = editor?.getModel()

  if (model) {
    monaco.editor.setModelLanguage(model, language)
  }
})

watch(() => props.readonly, (readonly) => {
  editor?.updateOptions({ readOnly: readonly })
})

watch(()=>props.theme,(theme)=>{
  monaco.editor.setTheme(theme)
})

onBeforeUnmount(() => {
  editor?.dispose()
})



</script>
<style scoped>
.code-editor {
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
</style>
