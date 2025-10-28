<template>
  <div class="advanced-viewer">
    <TresCanvas v-bind="gl" window-size>
      <TresPerspectiveCamera :position="[8, 6, 10]" :fov="45" />
      <OrbitControls 
        :enable-damping="true" 
        :damping-factor="0.05"
        :max-distance="20"
        :min-distance="2"
        :auto-rotate="autoRotate"
        :auto-rotate-speed="0.5"
      />
      
      <!-- Iluminação cinematográfica -->
      <TresAmbientLight :intensity="0.3" />
      <TresDirectionalLight 
        :position="[15, 15, 10]" 
        :intensity="1.5"
        :cast-shadow="true"
        :shadow-map-size-width="2048"
        :shadow-map-size-height="2048"
      />
      <TresSpotLight 
        :position="[0, 10, 0]"
        :intensity="0.8"
        :angle="Math.PI / 6"
        :penumbra="0.3"
        :cast-shadow="true"
        :color="0x4fc3f7"
      />
      
      <!-- Modelo GLB se disponível -->
      <Suspense>
        <GLTFModel 
          v-if="useGLBModel && !loading"
          :path="'/smart4-tomadas-verm.glb'"
          :scale="[2, 2, 2]"
          :position="[0, 0, 0]"
          @loaded="onModelLoaded"
          @error="onModelError"
        />
        <template #fallback>
          <SmartRulerGeometry v-if="!useGLBModel" />
        </template>
      </Suspense>
      
      <!-- Modelo procedural como fallback -->
      <SmartRulerGeometry v-if="!useGLBModel" />
      
      <!-- Ambiente -->
      <TresGroup>
        <!-- Chão com reflexo -->
        <TresMesh 
          :position="[0, -2, 0]" 
          :rotation="[-Math.PI / 2, 0, 0]"
          :receive-shadow="true"
        >
          <TresPlaneGeometry :args="[30, 30]" />
          <TresMeshPhongMaterial 
            :color="0x222222" 
            :shininess="100"
            :transparent="true"
            :opacity="0.8"
          />
        </TresMesh>
        
        <!-- Parede de fundo -->
        <TresMesh :position="[0, 0, -8]">
          <TresPlaneGeometry :args="[20, 15]" />
          <TresMeshLambertMaterial :color="0x1a1a2e" />
        </TresMesh>
      </TresGroup>
      
      <!-- Partículas flutuantes -->
      <TresPoints v-if="showParticles">
        <TresBufferGeometry>
          <TresBufferAttribute
            :array="particlePositions"
            :count="particleCount"
            :size="3"
            attach="attributes-position"
          />
        </TresBufferGeometry>
        <TresPointsMaterial 
          :color="0x4fc3f7"
          :size="0.05"
          :transparent="true"
          :opacity="0.6"
        />
      </TresPoints>
    </TresCanvas>
    
    <!-- Painel de controle avançado -->
    <div class="advanced-controls">
      <div class="control-section">
        <h4>Visualização</h4>
        <label class="switch">
          <input v-model="autoRotate" type="checkbox">
          <span class="slider">Auto Rotação</span>
        </label>
        <label class="switch">
          <input v-model="showParticles" type="checkbox">
          <span class="slider">Partículas</span>
        </label>
        <label class="switch">
          <input v-model="useGLBModel" type="checkbox">
          <span class="slider">Modelo GLB</span>
        </label>
      </div>
      
      <div class="control-section">
        <h4>Iluminação</h4>
        <div class="slider-control">
          <label>Intensidade: {{ lightIntensity.toFixed(1) }}</label>
          <input 
            v-model="lightIntensity" 
            type="range" 
            min="0.1" 
            max="3" 
            step="0.1"
          >
        </div>
      </div>
      
      <div class="control-section">
        <h4>Tomadas</h4>
        <div class="socket-grid">
          <button 
            v-for="(socket, index) in sockets"
            :key="index"
            @click="toggleSocket(index)"
            :class="['socket-btn-mini', { active: socket.active }]"
          >
            {{ index + 1 }}
          </button>
        </div>
        <button @click="sequenceDemo" class="demo-btn">
          Demonstração
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-advanced">
      <div class="loading-content">
        <div class="loading-spinner-advanced"></div>
        <p>{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, GLTFModel } from '@tresjs/cientos'
import SmartRulerGeometry from './SmartRulerGeometry.vue'

const loading = ref(true)
const loadingMessage = ref('Inicializando visualizador 3D...')
const autoRotate = ref(false)
const showParticles = ref(true)
const useGLBModel = ref(true)
const lightIntensity = ref(1.5)

const gl = {
  clearColor: '#0a0a1a',
  antialias: true,
  shadows: true,
  shadowType: 1,
  toneMapping: 2, // ACESFilmicToneMapping
  toneMappingExposure: 1.2,
}

const sockets = ref([
  { active: true },
  { active: true },
  { active: false },
  { active: false },
])

// Partículas
const particleCount = 100
const particlePositions = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount * 3; i += 3) {
  particlePositions[i] = (Math.random() - 0.5) * 20     // x
  particlePositions[i + 1] = Math.random() * 10         // y
  particlePositions[i + 2] = (Math.random() - 0.5) * 20 // z
}

const toggleSocket = (index: number) => {
  sockets.value[index].active = !sockets.value[index].active
}

const sequenceDemo = async () => {
  // Reset all sockets
  sockets.value.forEach(socket => socket.active = false)
  
  // Activate one by one
  for (let i = 0; i < sockets.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 500))
    sockets.value[i].active = true
  }
  
  // Wait and reset
  await new Promise(resolve => setTimeout(resolve, 1000))
  sockets.value.forEach(socket => socket.active = false)
  
  // Final activation
  await new Promise(resolve => setTimeout(resolve, 500))
  sockets.value.forEach(socket => socket.active = true)
}

const onModelLoaded = () => {
  loadingMessage.value = 'Modelo carregado com sucesso!'
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const onModelError = () => {
  loadingMessage.value = 'Erro ao carregar modelo, usando geometria procedural...'
  useGLBModel.value = false
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

onMounted(() => {
  loadingMessage.value = 'Carregando recursos 3D...'
  
  // Simula carregamento se não usar modelo GLB
  if (!useGLBModel.value) {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
})

// Watch para mudanças no modelo
watch(useGLBModel, (newValue) => {
  if (!newValue) {
    loading.value = false
  }
})
</script>

<style scoped>
.advanced-viewer {
  width: 100%;
  height: 800px;
  position: relative;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #2d1b69 100%);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.advanced-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 200px;
  z-index: 10;
}

.control-section {
  margin-bottom: 20px;
}

.control-section h4 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.switch {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.switch input {
  margin-right: 8px;
}

.switch .slider {
  color: #ccc;
  font-size: 13px;
}

.slider-control {
  margin-bottom: 10px;
}

.slider-control label {
  color: #ccc;
  font-size: 12px;
  display: block;
  margin-bottom: 5px;
}

.slider-control input[type="range"] {
  width: 100%;
  margin: 0;
}

.socket-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.socket-btn-mini {
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 600;
}

.socket-btn-mini:hover {
  background: #555;
}

.socket-btn-mini.active {
  background: #ff5722;
  box-shadow: 0 0 8px rgba(255, 87, 34, 0.6);
}

.demo-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1px;
}

.demo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.loading-advanced {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(10px);
  z-index: 20;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner-advanced {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-left: 3px solid #ff5722;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-content p {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .advanced-controls {
    position: static;
    margin: 10px;
    width: calc(100% - 20px);
  }
  
  .advanced-viewer {
    height: 600px;
  }
}
</style>