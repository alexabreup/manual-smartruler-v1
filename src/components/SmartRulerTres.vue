<template>
  <div class="viewer-container">
    <TresCanvas v-bind="gl" window-size>
      <TresPerspectiveCamera :position="[6, 4, 8]" :fov="50" />
      <OrbitControls 
        :enable-damping="true" 
        :damping-factor="0.05"
        :max-distance="15"
        :min-distance="3"
      />
      
      <!-- Iluminação aprimorada -->
      <TresAmbientLight :intensity="0.4" />
      <TresDirectionalLight 
        :position="[10, 10, 5]" 
        :intensity="1.2"
        :cast-shadow="true"
      />
      <TresPointLight 
        :position="[0, 0, 5]" 
        :intensity="0.5" 
        :color="0x4fc3f7"
      />
      
      <!-- Modelo Smart Ruler -->
      <TresGroup ref="smartRulerGroup" :rotation="[0, rotation, 0]">
        <!-- Base principal -->
        <TresMesh :cast-shadow="true" :receive-shadow="true">
          <TresBoxGeometry :args="[0.9, 3.2, 0.15]" />
          <TresMeshPhongMaterial 
            :color="0x2c2c2c" 
            :shininess="30"
          />
        </TresMesh>
        
        <!-- Bordas laterais -->
        <TresMesh 
          v-for="side in [-0.45, 0.45]" 
          :key="`side-${side}`"
          :position="[side, 0, 0.08]"
        >
          <TresBoxGeometry :args="[0.05, 3.2, 0.1]" />
          <TresMeshPhongMaterial :color="0x1a1a1a" />
        </TresMesh>
        
        <!-- 4 Tomadas com animação -->
        <TresGroup
          v-for="(socket, index) in sockets" 
          :key="index"
          :position="[0, socket.y, 0.08]"
          @click="toggleSocket(index)"
        >
          <!-- Corpo da tomada -->
          <TresMesh>
            <TresBoxGeometry :args="[0.6, 0.45, 0.08]" />
            <TresMeshPhongMaterial 
              :color="socket.active ? 0xff5722 : 0x555555"
              :emissive="socket.active ? 0x331100 : 0x000000"
            />
          </TresMesh>
          
          <!-- Furos da tomada -->
          <TresMesh 
            v-for="hole in 2" 
            :key="`hole-${hole}`"
            :position="[hole === 1 ? -0.1 : 0.1, 0, 0.05]"
          >
            <TresCylinderGeometry :args="[0.04, 0.04, 0.1, 8]" />
            <TresMeshBasicMaterial :color="0x000000" />
          </TresMesh>
          
          <!-- LED indicador -->
          <TresMesh :position="[0.25, 0.15, 0.05]">
            <TresSphereGeometry :args="[0.02, 8, 8]" />
            <TresMeshBasicMaterial 
              :color="socket.active ? 0x00ff00 : 0x333333"
              :emissive="socket.active ? 0x004400 : 0x000000"
            />
          </TresMesh>
        </TresGroup>
        
        <!-- Cabo USB -->
        <TresGroup :position="[0, -1.8, 0]">
          <TresMesh>
            <TresCylinderGeometry :args="[0.03, 0.03, 0.8, 12]" />
            <TresMeshPhongMaterial :color="0x1a1a1a" />
          </TresMesh>
          
          <!-- Conector USB -->
          <TresMesh :position="[0, -0.5, 0]">
            <TresBoxGeometry :args="[0.12, 0.06, 0.25]" />
            <TresMeshPhongMaterial :color="0x333333" />
          </TresMesh>
        </TresGroup>
        
        <!-- Botão de controle -->
        <TresMesh 
          :position="[0, 1.8, 0.1]"
          @click="toggleAllSockets"
        >
          <TresCylinderGeometry :args="[0.08, 0.08, 0.04, 16]" />
          <TresMeshPhongMaterial 
            :color="allActive ? 0x4caf50 : 0x666666"
            :emissive="allActive ? 0x002200 : 0x000000"
          />
        </TresMesh>
      </TresGroup>
      
      <!-- Plano de fundo -->
      <TresMesh :position="[0, 0, -2]" :receive-shadow="true">
        <TresPlaneGeometry :args="[20, 20]" />
        <TresMeshLambertMaterial :color="0x404040" :transparent="true" :opacity="0.3" />
      </TresMesh>
    </TresCanvas>
    
    <!-- Interface de controle -->
    <div class="controls-panel">
      <h3>Smart Ruler 3D</h3>
      <div class="socket-controls">
        <button 
          v-for="(socket, index) in sockets"
          :key="index"
          @click="toggleSocket(index)"
          :class="['socket-btn', { active: socket.active }]"
        >
          Tomada {{ index + 1 }}
        </button>
      </div>
      <button @click="toggleAllSockets" class="master-btn">
        {{ allActive ? 'Desligar Todas' : 'Ligar Todas' }}
      </button>
      <button @click="startAnimation" class="animate-btn">
        {{ animating ? 'Parar Rotação' : 'Rotacionar' }}
      </button>
    </div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">Carregando Smart Ruler 3D...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const loading = ref(true)
const rotation = ref(0)
const animating = ref(false)
let animationId: number | null = null

const gl = {
  clearColor: '#0f0f23',
  antialias: true,
  shadows: true,
  shadowType: 1, // PCF shadows
}

const sockets = ref([
  { y: 1.05, active: true },
  { y: 0.35, active: true },
  { y: -0.35, active: false },
  { y: -1.05, active: false },
])

const allActive = computed(() => 
  sockets.value.every(socket => socket.active)
)

const toggleSocket = (index: number) => {
  sockets.value[index].active = !sockets.value[index].active
}

const toggleAllSockets = () => {
  const newState = !allActive.value
  sockets.value.forEach(socket => {
    socket.active = newState
  })
}

const startAnimation = () => {
  if (animating.value) {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    animating.value = false
  } else {
    animating.value = true
    animate()
  }
}

const animate = () => {
  if (animating.value) {
    rotation.value += 0.01
    animationId = requestAnimationFrame(animate)
  }
}

// Simulação de sequência de ativação
const demoSequence = () => {
  let step = 0
  const interval = setInterval(() => {
    if (step < sockets.value.length) {
      sockets.value[step].active = true
      step++
    } else {
      clearInterval(interval)
    }
  }, 800)
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
    // Inicia uma demonstração após carregar
    setTimeout(demoSequence, 1000)
  }, 1500)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 700px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.controls-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.controls-panel h3 {
  color: #fff;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
}

.socket-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.socket-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.socket-btn:hover {
  background: #555;
  transform: translateX(2px);
}

.socket-btn.active {
  background: #ff5722;
  box-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
}

.master-btn, .animate-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.master-btn:hover, .animate-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.animate-btn {
  background: #2196f3;
}

.animate-btn:hover {
  background: #1976d2;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 15, 35, 0.95);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left: 4px solid #ff5722;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: white;
  font-size: 18px;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsividade */
@media (max-width: 768px) {
  .controls-panel {
    position: static;
    margin: 10px;
    width: calc(100% - 20px);
  }
  
  .viewer-container {
    height: 500px;
  }
  
  .socket-controls {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .socket-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>