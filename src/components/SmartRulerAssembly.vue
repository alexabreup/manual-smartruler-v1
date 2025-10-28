<template>
  <div class="assembly-viewer">
    <TresCanvas v-bind="gl" window-size>
      <TresPerspectiveCamera :position="[0, 0, 8]" :fov="45" />
      <OrbitControls 
        :enable-damping="true"
        :damping-factor="0.05"
        :enable-rotate="false"
        :enable-zoom="false"
        :enable-pan="false"
        :auto-rotate="false"
      />
      
      <!-- Iluminação suave -->
      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="0.8" />
      
      <!-- Smart Ruler Model -->
      <TresGroup ref="smartRulerGroup" :rotation="[0, 0, rotation]">
        <!-- Base principal -->
        <TresMesh>
          <TresBoxGeometry :args="[0.8, 2.8, 0.12]" />
          <TresMeshLambertMaterial :color="deviceColor" />
        </TresMesh>
        
        <!-- Conexão 1 - Alimentação do Dispositivo (topo) -->
        <TresMesh :position="[0, 1.2, 0.07]">
          <TresBoxGeometry :args="[0.15, 0.3, 0.08]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 2 - Alimentação do Modem (meio-superior) -->
        <TresMesh :position="[0, 0.4, 0.07]">
          <TresBoxGeometry :args="[0.12, 0.25, 0.06]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 3 - Alimentação do PC MUC (meio-inferior) -->
        <TresMesh :position="[0, -0.4, 0.07]">
          <TresBoxGeometry :args="[0.12, 0.25, 0.06]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 4 - Cabo USB (base) -->
        <TresMesh :position="[0, -1.2, 0.07]">
          <TresBoxGeometry :args="[0.1, 0.2, 0.05]" />
          <TresMeshLambertMaterial :color="0xff6600" />
        </TresMesh>
      </TresGroup>
      
      <!-- Setas 3D -->
      <!-- Seta 1 - Alimentação do Dispositivo -->
      <TresGroup :position="[-1.5, 1.2, 0]">
        <TresMesh :rotation="[0, 0, -Math.PI / 2]">
          <TresConeGeometry :args="[0.08, 0.25, 6]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
        <TresMesh :position="[0.6, 0, 0]">
          <TresBoxGeometry :args="[1.2, 0.015, 0.015]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
      </TresGroup>
      
      <!-- Seta 2 - Alimentação do Modem -->
      <TresGroup :position="[-1.5, 0.4, 0]">
        <TresMesh :rotation="[0, 0, -Math.PI / 2]">
          <TresConeGeometry :args="[0.08, 0.25, 6]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
        <TresMesh :position="[0.6, 0, 0]">
          <TresBoxGeometry :args="[1.2, 0.015, 0.015]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
      </TresGroup>
      
      <!-- Seta 3 - Alimentação do PC MUC -->
      <TresGroup :position="[-1.5, -0.4, 0]">
        <TresMesh :rotation="[0, 0, -Math.PI / 2]">
          <TresConeGeometry :args="[0.08, 0.25, 6]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
        <TresMesh :position="[0.6, 0, 0]">
          <TresBoxGeometry :args="[1.2, 0.015, 0.015]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
      </TresGroup>
      
      <!-- Seta 4 - Cabo USB -->
      <TresGroup :position="[1.5, -1.2, 0]">
        <TresMesh :rotation="[0, 0, Math.PI / 2]">
          <TresConeGeometry :args="[0.08, 0.25, 6]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
        <TresMesh :position="[-0.6, 0, 0]">
          <TresBoxGeometry :args="[1.2, 0.015, 0.015]" />
          <TresMeshBasicMaterial :color="arrowColor" />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
    
    <!-- Labels HTML sobrepostos -->
    <div class="labels-overlay">
      <!-- Label 1 -->
      <div class="label label-1" :class="{ 'dark-theme': isDark }">
        <div class="label-number">1</div>
        <div class="label-text">
          <strong>CONEXÃO</strong><br>
          Alimentação<br>
          do Dispositivo
        </div>
      </div>
      
      <!-- Label 2 -->
      <div class="label label-2" :class="{ 'dark-theme': isDark }">
        <div class="label-number">2</div>
        <div class="label-text">
          <strong>CONEXÃO</strong><br>
          Alimentação<br>
          do Modem
        </div>
      </div>
      
      <!-- Label 3 -->
      <div class="label label-3" :class="{ 'dark-theme': isDark }">
        <div class="label-number">3</div>
        <div class="label-text">
          <strong>CONEXÃO</strong><br>
          Alimentação<br>
          do PC MUC
        </div>
      </div>
      
      <!-- Label 4 -->
      <div class="label label-4" :class="{ 'dark-theme': isDark }">
        <div class="label-number">4</div>
        <div class="label-text">
          <strong>CONEXÃO</strong><br>
          Cabo USB<br>
          para PC
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const rotation = ref(0)
const isDark = ref(false)
let animationId: number | null = null

// Configuração do canvas com fundo transparente
const gl = {
  alpha: true,
  clearColor: 'transparent',
  antialias: true,
}

// Cores que se adaptam ao tema
const deviceColor = computed(() => isDark.value ? 0x2a2a2a : 0x1a1a1a)
const arrowColor = computed(() => isDark.value ? 0xff5722 : 0xff4444)

// Detectar tema
const detectTheme = () => {
  if (typeof window !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme')
    isDark.value = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
}

// Animação de rotação suave no eixo Z
const animate = () => {
  rotation.value += 0.005
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  detectTheme()
  animate()
  
  // Observer para mudanças de tema
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    // Listener para mudanças de preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', detectTheme)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', detectTheme)
    }
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.assembly-viewer {
  width: 100%;
  height: 500px;
  position: relative;
  background: transparent;
}

.labels-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 68, 68, 0.9);
  color: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.label.dark-theme {
  background: rgba(255, 87, 34, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.label-number {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.label-text {
  text-align: left;
}

.label-text strong {
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.5px;
}

/* Posicionamento das labels */
.label-1 {
  top: 15%;
  left: 5%;
  transform: translateY(-50%);
}

.label-2 {
  top: 35%;
  left: 5%;
  transform: translateY(-50%);
}

.label-3 {
  top: 65%;
  left: 5%;
  transform: translateY(-50%);
}

.label-4 {
  top: 85%;
  right: 5%;
  transform: translateY(-50%);
  flex-direction: row-reverse;
}

/* Responsividade */
@media (max-width: 768px) {
  .assembly-viewer {
    height: 400px;
  }
  
  .label {
    font-size: 10px;
    padding: 6px 12px;
    gap: 8px;
  }
  
  .label-number {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
  
  .label-text strong {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .assembly-viewer {
    height: 350px;
  }
  
  .label {
    font-size: 9px;
    padding: 4px 8px;
    gap: 6px;
  }
  
  .label-number {
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
}
</style>