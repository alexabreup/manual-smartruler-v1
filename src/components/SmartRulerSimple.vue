<template>
  <div class="simple-viewer">
    <TresCanvas v-bind="gl" window-size>
      <TresPerspectiveCamera :position="[0, 0, 6]" :fov="50" />
      
      <!-- Iluminação básica -->
      <TresAmbientLight :intensity="0.7" />
      <TresDirectionalLight :position="[3, 3, 3]" :intensity="0.8" />
      
      <!-- Smart Ruler com rotação no eixo Z -->
      <TresGroup :rotation="[0, 0, rotation]">
        <!-- Base principal -->
        <TresMesh>
          <TresBoxGeometry :args="[0.6, 2.4, 0.1]" />
          <TresMeshLambertMaterial :color="deviceColor" />
        </TresMesh>
        
        <!-- Conexões destacadas -->
        <!-- 1. Alimentação do Dispositivo -->
        <TresMesh :position="[0, 1.0, 0.06]">
          <TresBoxGeometry :args="[0.12, 0.25, 0.06]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- 2. Alimentação do Modem -->
        <TresMesh :position="[0, 0.33, 0.06]">
          <TresBoxGeometry :args="[0.1, 0.2, 0.05]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- 3. Alimentação do PC MUC -->
        <TresMesh :position="[0, -0.33, 0.06]">
          <TresBoxGeometry :args="[0.1, 0.2, 0.05]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- 4. Cabo USB -->
        <TresMesh :position="[0, -1.0, 0.06]">
          <TresBoxGeometry :args="[0.08, 0.15, 0.04]" />
          <TresMeshLambertMaterial :color="0xff6600" />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
    
    <!-- Labels com setas CSS -->
    <div class="assembly-labels">
      <!-- Label 1 -->
      <div class="assembly-label label-1" :class="themeClass">
        <div class="arrow-left"></div>
        <div class="label-content">
          <span class="step-number">1</span>
          <div class="step-text">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do Dispositivo
          </div>
        </div>
      </div>
      
      <!-- Label 2 -->
      <div class="assembly-label label-2" :class="themeClass">
        <div class="arrow-left"></div>
        <div class="label-content">
          <span class="step-number">2</span>
          <div class="step-text">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do Modem
          </div>
        </div>
      </div>
      
      <!-- Label 3 -->
      <div class="assembly-label label-3" :class="themeClass">
        <div class="arrow-left"></div>
        <div class="label-content">
          <span class="step-number">3</span>
          <div class="step-text">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do PC MUC
          </div>
        </div>
      </div>
      
      <!-- Label 4 -->
      <div class="assembly-label label-4" :class="themeClass">
        <div class="label-content">
          <span class="step-number">4</span>
          <div class="step-text">
            <strong>CONEXÃO</strong><br>
            Cabo USB<br>
            para PC
          </div>
        </div>
        <div class="arrow-right"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'

const rotation = ref(0)
const isDark = ref(false)
let animationId: number | null = null

// Canvas transparente
const gl = {
  alpha: true,
  clearColor: 'transparent',
  antialias: true,
}

// Cores adaptáveis ao tema
const deviceColor = computed(() => isDark.value ? 0x2a2a2a : 0x1a1a1a)
const themeClass = computed(() => isDark.value ? 'dark' : 'light')

// Detectar tema
const detectTheme = () => {
  if (typeof window !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme')
    isDark.value = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
}

// Rotação suave no eixo Z
const animate = () => {
  rotation.value += 0.008
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  detectTheme()
  animate()
  
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', detectTheme)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.simple-viewer {
  width: 100%;
  height: 450px;
  position: relative;
  background: transparent;
}

.assembly-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.assembly-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0;
  transition: all 0.3s ease;
}

.label-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  backdrop-filter: blur(8px);
  border: 1px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tema claro */
.assembly-label.light .label-content {
  background: rgba(255, 68, 68, 0.95);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.assembly-label.light .arrow-left,
.assembly-label.light .arrow-right {
  border-color: transparent rgba(255, 68, 68, 0.95) transparent transparent;
}

.assembly-label.light .arrow-right {
  border-color: transparent transparent transparent rgba(255, 68, 68, 0.95);
}

/* Tema escuro */
.assembly-label.dark .label-content {
  background: rgba(255, 87, 34, 0.95);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.assembly-label.dark .arrow-left,
.assembly-label.dark .arrow-right {
  border-color: transparent rgba(255, 87, 34, 0.95) transparent transparent;
}

.assembly-label.dark .arrow-right {
  border-color: transparent transparent transparent rgba(255, 87, 34, 0.95);
}

.step-number {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.step-text {
  text-align: left;
}

.step-text strong {
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.5px;
}

/* Setas CSS */
.arrow-left,
.arrow-right {
  width: 0;
  height: 0;
  border-style: solid;
}

.arrow-left {
  border-width: 8px 12px 8px 0;
  margin-right: -1px;
}

.arrow-right {
  border-width: 8px 0 8px 12px;
  margin-left: -1px;
}

/* Posicionamento das labels */
.label-1 {
  top: 18%;
  left: 8%;
}

.label-2 {
  top: 38%;
  left: 8%;
}

.label-3 {
  top: 62%;
  left: 8%;
}

.label-4 {
  top: 82%;
  right: 8%;
  flex-direction: row-reverse;
}

/* Responsividade */
@media (max-width: 768px) {
  .simple-viewer {
    height: 380px;
  }
  
  .label-content {
    font-size: 10px;
    padding: 6px 12px;
    gap: 8px;
  }
  
  .step-number {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }
  
  .step-text strong {
    font-size: 9px;
  }
  
  .arrow-left,
  .arrow-right {
    border-width: 6px 10px 6px 0;
  }
  
  .arrow-right {
    border-width: 6px 0 6px 10px;
  }
}

@media (max-width: 480px) {
  .simple-viewer {
    height: 320px;
  }
  
  .label-content {
    font-size: 9px;
    padding: 4px 8px;
    gap: 6px;
  }
  
  .step-number {
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
  
  .step-text strong {
    font-size: 8px;
  }
  
  .arrow-left,
  .arrow-right {
    border-width: 5px 8px 5px 0;
  }
  
  .arrow-right {
    border-width: 5px 0 5px 8px;
  }
  
  /* Ajustar posições em telas pequenas */
  .label-1, .label-2, .label-3 {
    left: 2%;
  }
  
  .label-4 {
    right: 2%;
  }
}
</style>