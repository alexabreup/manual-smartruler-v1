<template>
  <div class="minimal-viewer">
    <TresCanvas v-bind="gl" window-size>
      <TresPerspectiveCamera :position="[0, 0, 5]" />
      
      <!-- Iluminação simples -->
      <TresAmbientLight :intensity="0.8" />
      <TresDirectionalLight :position="[2, 2, 2]" :intensity="0.6" />
      
      <!-- Smart Ruler girando no eixo Z -->
      <TresGroup :rotation="[0, 0, rotation]">
        <!-- Base -->
        <TresMesh>
          <TresBoxGeometry :args="[0.5, 2.0, 0.08]" />
          <TresMeshLambertMaterial :color="0x2a2a2a" />
        </TresMesh>
        
        <!-- Conexão 1 - Topo -->
        <TresMesh :position="[0, 0.8, 0.05]">
          <TresBoxGeometry :args="[0.1, 0.2, 0.04]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 2 -->
        <TresMesh :position="[0, 0.27, 0.05]">
          <TresBoxGeometry :args="[0.08, 0.16, 0.03]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 3 -->
        <TresMesh :position="[0, -0.27, 0.05]">
          <TresBoxGeometry :args="[0.08, 0.16, 0.03]" />
          <TresMeshLambertMaterial :color="0xff4444" />
        </TresMesh>
        
        <!-- Conexão 4 - Base -->
        <TresMesh :position="[0, -0.8, 0.05]">
          <TresBoxGeometry :args="[0.06, 0.12, 0.025]" />
          <TresMeshLambertMaterial :color="0xff6600" />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
    
    <!-- Setas e legendas fixas -->
    <div class="instructions-overlay">
      <!-- Instrução 1 -->
      <div class="instruction step-1">
        <div class="arrow-container">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>
        <div class="instruction-label">
          <span class="step-num">1</span>
          <div class="step-desc">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do Dispositivo
          </div>
        </div>
      </div>
      
      <!-- Instrução 2 -->
      <div class="instruction step-2">
        <div class="arrow-container">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>
        <div class="instruction-label">
          <span class="step-num">2</span>
          <div class="step-desc">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do Modem
          </div>
        </div>
      </div>
      
      <!-- Instrução 3 -->
      <div class="instruction step-3">
        <div class="arrow-container">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>
        <div class="instruction-label">
          <span class="step-num">3</span>
          <div class="step-desc">
            <strong>CONEXÃO</strong><br>
            Alimentação<br>
            do PC MUC
          </div>
        </div>
      </div>
      
      <!-- Instrução 4 -->
      <div class="instruction step-4">
        <div class="instruction-label">
          <span class="step-num">4</span>
          <div class="step-desc">
            <strong>CONEXÃO</strong><br>
            Cabo USB<br>
            para PC
          </div>
        </div>
        <div class="arrow-container reverse">
          <div class="arrow-head reverse"></div>
          <div class="arrow-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'

const rotation = ref(0)
let animationId: number | null = null

// Canvas transparente
const gl = {
  alpha: true,
  clearColor: 'transparent',
  antialias: true,
}

// Rotação contínua no eixo Z
const animate = () => {
  rotation.value += 0.01
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.minimal-viewer {
  width: 100%;
  height: 400px;
  position: relative;
  background: transparent;
}

.instructions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.instruction {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0;
}

.arrow-container {
  display: flex;
  align-items: center;
  height: 20px;
}

.arrow-line {
  width: 60px;
  height: 2px;
  background: var(--sl-color-orange-high);
}

.arrow-head {
  width: 0;
  height: 0;
  border-left: 8px solid var(--sl-color-orange-high);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.arrow-head.reverse {
  border-left: none;
  border-right: 8px solid var(--sl-color-orange-high);
}

.instruction-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--sl-color-orange-high);
  color: var(--sl-color-white);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.step-num {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  flex-shrink: 0;
}

.step-desc {
  text-align: left;
  line-height: 1.1;
}

.step-desc strong {
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.3px;
}

/* Posicionamento das instruções */
.step-1 {
  top: 12%;
  left: 8%;
}

.step-2 {
  top: 32%;
  left: 8%;
}

.step-3 {
  top: 68%;
  left: 8%;
}

.step-4 {
  top: 88%;
  right: 8%;
  flex-direction: row-reverse;
}

/* Tema escuro */
@media (prefers-color-scheme: dark) {
  .arrow-line {
    background: var(--sl-color-orange-low);
  }
  
  .arrow-head {
    border-left-color: var(--sl-color-orange-low);
  }
  
  .arrow-head.reverse {
    border-right-color: var(--sl-color-orange-low);
  }
  
  .instruction-label {
    background: var(--sl-color-orange-low);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .minimal-viewer {
    height: 350px;
  }
  
  .arrow-line {
    width: 45px;
  }
  
  .instruction-label {
    font-size: 10px;
    padding: 4px 8px;
    gap: 6px;
  }
  
  .step-num {
    width: 16px;
    height: 16px;
    font-size: 9px;
  }
  
  .step-desc strong {
    font-size: 8px;
  }
}

@media (max-width: 480px) {
  .minimal-viewer {
    height: 300px;
  }
  
  .arrow-line {
    width: 35px;
  }
  
  .instruction-label {
    font-size: 9px;
    padding: 3px 6px;
    gap: 4px;
  }
  
  .step-num {
    width: 14px;
    height: 14px;
    font-size: 8px;
  }
  
  .step-desc strong {
    font-size: 7px;
  }
  
  .step-1, .step-2, .step-3 {
    left: 4%;
  }
  
  .step-4 {
    right: 4%;
  }
}
</style>