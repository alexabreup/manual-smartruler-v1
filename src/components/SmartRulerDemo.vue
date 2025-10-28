<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>Smart Ruler 3D - Demonstração Interativa</h2>
      <p>Explore o modelo 3D do Smart Ruler com controles avançados</p>
    </div>
    
    <div class="demo-content">
      <!-- Visualizador 3D principal -->
      <div class="viewer-main">
        <TresCanvas v-bind="gl" window-size>
          <TresPerspectiveCamera 
            ref="camera"
            :position="cameraPosition" 
            :fov="45" 
          />
          <OrbitControls 
            ref="controls"
            :enable-damping="true" 
            :damping-factor="0.05"
            :max-distance="25"
            :min-distance="3"
            :auto-rotate="autoRotate"
            :auto-rotate-speed="autoRotateSpeed"
          />
          
          <!-- Sistema de iluminação -->
          <TresAmbientLight :intensity="ambientIntensity" />
          <TresDirectionalLight 
            :position="[15, 15, 10]" 
            :intensity="directionalIntensity"
            :cast-shadow="true"
          />
          <TresSpotLight 
            :position="[0, 12, 8]"
            :intensity="spotIntensity"
            :angle="Math.PI / 4"
            :color="spotColor"
          />
          
          <!-- Modelo Smart Ruler -->
          <TresGroup 
            ref="smartRulerGroup"
            :rotation="[0, modelRotation.y, 0]"
            :scale="modelScale"
          >
            <SmartRulerGeometry 
              :sockets="sockets"
              @toggle-all="toggleAllSockets"
            />
          </TresGroup>
          
          <!-- Ambiente -->
          <TresMesh 
            :position="[0, -2.5, 0]" 
            :rotation="[-Math.PI / 2, 0, 0]"
            :receive-shadow="true"
          >
            <TresPlaneGeometry :args="[40, 40]" />
            <TresMeshPhongMaterial 
              :color="floorColor" 
              :shininess="100"
            />
          </TresMesh>
          
          <!-- Grid de referência -->
          <TresGridHelper 
            v-if="showGrid"
            :size="20" 
            :divisions="20" 
          />
        </TresCanvas>
        
        <!-- Overlay de informações -->
        <div class="info-overlay" v-if="showInfo">
          <div class="info-panel">
            <h4>Informações do Modelo</h4>
            <ul>
              <li>Tomadas Ativas: {{ activeSockets }}/{{ sockets.length }}</li>
              <li>Consumo: {{ estimatedPower }}W</li>
              <li>Status: {{ deviceStatus }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Painel de controles -->
      <div class="controls-panel">
        <div class="control-tabs">
          <button 
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- Aba Tomadas -->
          <div v-if="activeTab === 'sockets'" class="tab-panel">
            <h4>Controle de Tomadas</h4>
            <div class="socket-controls">
              <div 
                v-for="(socket, index) in sockets"
                :key="index"
                class="socket-control"
              >
                <label class="socket-label">
                  <input 
                    v-model="socket.active"
                    type="checkbox"
                  >
                  <span class="socket-name">Tomada {{ index + 1 }}</span>
                  <span class="socket-status" :class="{ active: socket.active }">
                    {{ socket.active ? 'ON' : 'OFF' }}
                  </span>
                </label>
              </div>
            </div>
            
            <div class="socket-actions">
              <button @click="toggleAllSockets" class="action-btn primary">
                {{ allActive ? 'Desligar Todas' : 'Ligar Todas' }}
              </button>
              <button @click="sequenceDemo" class="action-btn secondary">
                Demonstração
              </button>
            </div>
          </div>
          
          <!-- Aba Visualização -->
          <div v-if="activeTab === 'view'" class="tab-panel">
            <h4>Controles de Visualização</h4>
            
            <div class="control-group">
              <label>
                <input v-model="autoRotate" type="checkbox">
                Rotação Automática
              </label>
            </div>
            
            <div class="control-group">
              <label>Velocidade: {{ autoRotateSpeed.toFixed(1) }}</label>
              <input 
                v-model="autoRotateSpeed" 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1"
              >
            </div>
            
            <div class="control-group">
              <label>Escala: {{ modelScale.toFixed(1) }}x</label>
              <input 
                v-model="modelScale" 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1"
              >
            </div>
          </div>
          
          <!-- Aba Iluminação -->
          <div v-if="activeTab === 'lighting'" class="tab-panel">
            <h4>Controles de Iluminação</h4>
            
            <div class="control-group">
              <label>Ambiente: {{ ambientIntensity.toFixed(1) }}</label>
              <input 
                v-model="ambientIntensity" 
                type="range" 
                min="0" 
                max="2" 
                step="0.1"
              >
            </div>
            
            <div class="control-group">
              <label>Direcional: {{ directionalIntensity.toFixed(1) }}</label>
              <input 
                v-model="directionalIntensity" 
                type="range" 
                min="0" 
                max="3" 
                step="0.1"
              >
            </div>
          </div>
          
          <!-- Aba Efeitos -->
          <div v-if="activeTab === 'effects'" class="tab-panel">
            <h4>Efeitos Visuais</h4>
            
            <div class="effect-toggles">
              <label>
                <input v-model="showGrid" type="checkbox">
                Grid de Referência
              </label>
              
              <label>
                <input v-model="showInfo" type="checkbox">
                Informações
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import SmartRulerGeometry from './SmartRulerGeometry.vue'

// Estado principal
const activeTab = ref('sockets')
const autoRotate = ref(false)
const autoRotateSpeed = ref(0.5)
const modelScale = ref(1.0)
const showGrid = ref(false)
const showInfo = ref(true)

// Controles de iluminação
const ambientIntensity = ref(0.4)
const directionalIntensity = ref(1.2)
const spotIntensity = ref(0.8)
const spotColor = 0x4fc3f7
const floorColor = 0x222222

// Estado do modelo
const modelRotation = ref({ y: 0 })
const cameraPosition = ref([8, 6, 10])

// Configuração do canvas
const gl = {
  clearColor: '#0a0a1a',
  antialias: true,
  shadows: true,
}

// Tomadas
const sockets = ref([
  { active: true },
  { active: true },
  { active: false },
  { active: false },
])

// Computadas
const allActive = computed(() => 
  sockets.value.every(socket => socket.active)
)

const activeSockets = computed(() => 
  sockets.value.filter(socket => socket.active).length
)

const estimatedPower = computed(() => 
  activeSockets.value * 75 // 75W por tomada ativa
)

const deviceStatus = computed(() => {
  if (activeSockets.value === 0) return 'Standby'
  if (activeSockets.value === sockets.value.length) return 'Máximo'
  return 'Parcial'
})

// Abas
const tabs = [
  { id: 'sockets', label: 'Tomadas' },
  { id: 'view', label: 'Visualização' },
  { id: 'lighting', label: 'Iluminação' },
  { id: 'effects', label: 'Efeitos' },
]

// Métodos
const toggleAllSockets = () => {
  const newState = !allActive.value
  sockets.value.forEach(socket => {
    socket.active = newState
  })
}

const sequenceDemo = async () => {
  sockets.value.forEach(socket => socket.active = false)
  
  for (let i = 0; i < sockets.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 600))
    sockets.value[i].active = true
  }
}
</script>

<style scoped>
.demo-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #2d1b69 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.demo-header {
  padding: 30px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.demo-header h2 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
}

.demo-header p {
  color: #ccc;
  margin: 0;
  font-size: 16px;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  height: 800px;
}

.viewer-main {
  position: relative;
  background: linear-gradient(45deg, #0a0a1a, #1a1a2e);
}

.info-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.info-panel {
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-panel h4 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.info-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-panel li {
  color: #ccc;
  font-size: 12px;
  margin-bottom: 5px;
}

.controls-panel {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.control-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 15px 10px;
  border: none;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: rgba(255, 87, 34, 0.2);
  color: #ff5722;
  border-bottom: 2px solid #ff5722;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.tab-panel {
  padding: 20px;
}

.tab-panel h4 {
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
}

.socket-controls {
  margin-bottom: 20px;
}

.socket-control {
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.socket-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
}

.socket-label input {
  margin-right: 10px;
}

.socket-name {
  color: #fff;
  font-weight: 500;
  flex: 1;
}

.socket-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: #666;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.socket-status.active {
  background: #ff5722;
}

.socket-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #ff5722;
  color: white;
}

.action-btn.secondary {
  background: #4caf50;
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  color: #ccc;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.control-group input[type="range"] {
  width: 100%;
  margin: 0;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.effect-toggles label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  color: #ccc;
  font-size: 13px;
}

@media (max-width: 1200px) {
  .demo-content {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .viewer-main {
    height: 600px;
  }
  
  .controls-panel {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 768px) {
  .demo-header {
    padding: 20px;
  }
  
  .demo-header h2 {
    font-size: 24px;
  }
  
  .viewer-main {
    height: 500px;
  }
  
  .tab-btn {
    font-size: 10px;
    padding: 12px 8px;
  }
  
  .tab-panel {
    padding: 15px;
  }
}
</style>