<template>
  <TresGroup ref="smartRulerGroup">
    <!-- Base principal com detalhes -->
    <TresMesh :cast-shadow="true" :receive-shadow="true">
      <TresBoxGeometry :args="[1.0, 3.5, 0.18]" />
      <TresMeshPhongMaterial 
        :color="0x2a2a2a" 
        :shininess="50"
        :specular="0x111111"
      />
    </TresMesh>
    
    <!-- Chanfros nas bordas -->
    <TresMesh 
      v-for="(pos, index) in edgePositions" 
      :key="`edge-${index}`"
      :position="pos.position"
      :rotation="pos.rotation"
    >
      <TresBoxGeometry :args="[0.05, 3.5, 0.05]" />
      <TresMeshPhongMaterial :color="0x1a1a1a" />
    </TresMesh>
    
    <!-- 4 Tomadas com detalhes realistas -->
    <TresGroup
      v-for="(socket, index) in sockets" 
      :key="`socket-${index}`"
      :position="[0, socketPositions[index], 0.1]"
    >
      <!-- Corpo da tomada -->
      <TresMesh>
        <TresBoxGeometry :args="[0.7, 0.5, 0.1]" />
        <TresMeshPhongMaterial 
          :color="socket.active ? 0xff5722 : 0x555555"
          :emissive="socket.active ? 0x220a00 : 0x000000"
          :shininess="30"
        />
      </TresMesh>
      
      <!-- Moldura da tomada -->
      <TresMesh :position="[0, 0, 0.02]">
        <TresBoxGeometry :args="[0.75, 0.55, 0.06]" />
        <TresMeshPhongMaterial :color="0x333333" />
      </TresMesh>
      
      <!-- Furos da tomada (padrão brasileiro) -->
      <TresMesh 
        v-for="hole in 3" 
        :key="`hole-${hole}`"
        :position="getHolePosition(hole)"
      >
        <TresCylinderGeometry :args="[0.035, 0.035, 0.12, 12]" />
        <TresMeshBasicMaterial :color="0x000000" />
      </TresMesh>
      
      <!-- LED indicador -->
      <TresMesh :position="[0.28, 0.18, 0.06]">
        <TresSphereGeometry :args="[0.025, 12, 12]" />
        <TresMeshBasicMaterial 
          :color="socket.active ? 0x00ff00 : 0x002200"
          :emissive="socket.active ? 0x004400 : 0x000000"
        />
      </TresMesh>
      
      <!-- Texto da tomada -->
      <TresMesh :position="[-0.25, -0.15, 0.06]">
        <TresBoxGeometry :args="[0.15, 0.08, 0.01]" />
        <TresMeshBasicMaterial 
          :color="0xffffff"
          :transparent="true"
          :opacity="0.8"
        />
      </TresMesh>
    </TresGroup>
    
    <!-- Cabo USB com detalhes -->
    <TresGroup :position="[0, -2.0, 0]">
      <!-- Cabo flexível -->
      <TresMesh 
        v-for="segment in cableSegments"
        :key="`cable-${segment.index}`"
        :position="segment.position"
        :rotation="segment.rotation"
      >
        <TresCylinderGeometry :args="[0.025, 0.025, 0.15, 8]" />
        <TresMeshPhongMaterial :color="0x1a1a1a" />
      </TresMesh>
      
      <!-- Conector USB -->
      <TresMesh :position="[0, -0.6, 0]">
        <TresBoxGeometry :args="[0.15, 0.08, 0.3]" />
        <TresMeshPhongMaterial :color="0x333333" />
      </TresMesh>
      
      <!-- Detalhes do conector -->
      <TresMesh :position="[0, -0.6, 0.16]">
        <TresBoxGeometry :args="[0.12, 0.05, 0.02]" />
        <TresMeshBasicMaterial :color="0xffd700" />
      </TresMesh>
    </TresGroup>
    
    <!-- Botão de controle principal -->
    <TresMesh 
      :position="[0, 2.0, 0.12]"
      @click="$emit('toggleAll')"
    >
      <TresCylinderGeometry :args="[0.1, 0.1, 0.06, 20]" />
      <TresMeshPhongMaterial 
        :color="allActive ? 0x4caf50 : 0x666666"
        :emissive="allActive ? 0x002200 : 0x000000"
        :shininess="100"
      />
    </TresMesh>
    
    <!-- Logo/marca -->
    <TresMesh :position="[0, 1.5, 0.1]">
      <TresBoxGeometry :args="[0.6, 0.2, 0.02]" />
      <TresMeshBasicMaterial 
        :color="0x4fc3f7"
        :transparent="true"
        :opacity="0.8"
      />
    </TresMesh>
    
    <!-- Indicadores de status -->
    <TresMesh 
      v-for="(indicator, index) in statusIndicators"
      :key="`indicator-${index}`"
      :position="[0.35, indicator.y, 0.1]"
    >
      <TresSphereGeometry :args="[0.015, 8, 8]" />
      <TresMeshBasicMaterial 
        :color="indicator.active ? 0x00ff00 : 0x333333"
        :emissive="indicator.active ? 0x002200 : 0x000000"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Socket {
  active: boolean
}

const props = defineProps<{
  sockets?: Socket[]
}>()

const emit = defineEmits<{
  toggleAll: []
}>()

const sockets = computed(() => props.sockets || [
  { active: true },
  { active: true },
  { active: false },
  { active: false },
])

const allActive = computed(() => 
  sockets.value.every(socket => socket.active)
)

const socketPositions = [1.2, 0.4, -0.4, -1.2]

const edgePositions = [
  { position: [-0.5, 0, 0.09], rotation: [0, 0, 0] },
  { position: [0.5, 0, 0.09], rotation: [0, 0, 0] },
  { position: [0, 1.75, 0.09], rotation: [0, 0, Math.PI / 2] },
  { position: [0, -1.75, 0.09], rotation: [0, 0, Math.PI / 2] },
]

const getHolePosition = (hole: number) => {
  switch (hole) {
    case 1: return [-0.12, 0, 0.06]      // Fase
    case 2: return [0.12, 0, 0.06]       // Neutro
    case 3: return [0, -0.15, 0.06]      // Terra
    default: return [0, 0, 0.06]
  }
}

// Cabo USB curvado
const cableSegments = Array.from({ length: 8 }, (_, i) => ({
  index: i,
  position: [
    Math.sin(i * 0.2) * 0.1,
    -0.1 - (i * 0.06),
    Math.cos(i * 0.2) * 0.05
  ],
  rotation: [0, 0, i * 0.1]
}))

const statusIndicators = computed(() => 
  sockets.value.map((socket, index) => ({
    y: socketPositions[index],
    active: socket.active
  }))
)
</script>