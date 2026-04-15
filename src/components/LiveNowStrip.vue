<template>
  <section class="live-strip" :style="bgStyle" @mouseenter="paused = true" @mouseleave="paused = false">
    <div class="overlay"></div>
    <div class="strip-inner">
      <div class="left">
        <div class="hint">Mensaje en vivo</div>
        <h2 class="title">
          <span class="word-main">ESPERANZA</span>
          <span class="word-sub"><span class="sub-normal">EN TIEMPOS</span> <span class="sub-strong">DIFÍCILES</span></span>
        </h2>
        <button class="btn-ver" @click="viewNow">Ver Ahora</button>
      </div>

      <div class="center">
      </div>
      <div class="dots" aria-hidden="false">
        <button v-for="n in images.length" :key="n" :class="{ active: (n-1) === current }" @click="go(n-1)" :aria-label="`Ir a imagen ${n}`"></button>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  image: { type: String, default: 'https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/470532693_18389062843096993_1223019033339111840_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=sq8TXiG4M8wQ7kNvwG8j3M_&_nc_oc=Adqvq1GljVtKBnQs1s-AeHouAfMSQSNHz4NuTb8-r-uUolpWSNsuAQZEHfqa10yBT-w&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=J3XcoG3kMRXMrSjXOuYgbQ&_nc_ss=7a389&oh=00_Af3neuW_378MmNYc5DmnYm_EiuKMaGnqREpoipXb30G5zQ&oe=69E39FEE' },
  images: { type: Array as () => string[], default: () => [
    'https://scontent-bog2-2.xx.fbcdn.net/v/t39.30808-6/470532693_18389062843096993_1223019033339111840_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=sq8TXiG4M8wQ7kNvwG8j3M_&_nc_oc=Adqvq1GljVtKBnQs1s-AeHouAfMSQSNHz4NuTb8-r-uUolpWSNsuAQZEHfqa10yBT-w&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=J3XcoG3kMRXMrSjXOuYgbQ&_nc_ss=7a389&oh=00_Af3neuW_378MmNYc5DmnYm_EiuKMaGnqREpoipXb30G5zQ&oe=69E39FEE',
    'https://scontent-bog2-1.xx.fbcdn.net/v/t39.30808-6/485694368_1056615243168360_8674931321701657098_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=dd6889&_nc_ohc=2djRzisobFYQ7kNvwEDb5O4&_nc_oc=AdrVqsbnBLh40o37PbwckX0xHzkULmaP0eJ4jXJ5R8Gn2GInwvWElPLwOsoOPWrWR0Y&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=sQuZozx8JgL2xhpkxzz3Ow&_nc_ss=7a389&oh=00_Af2tElTp0XDbgbo5rbPpFV7pCVI2i4JxH5lO4hw8xtV_aw&oe=69E3805D'
  ] }
})

const current = ref(0)
const images = computed(() => (props.images && props.images.length) ? props.images : [props.image])

const paused = ref(false)
let intervalId: number | null = null

const startAutoplay = () => {
  if (intervalId !== null) return
  intervalId = window.setInterval(() => {
    if (!paused.value && images.value.length > 1) {
      current.value = (current.value + 1) % images.value.length
    }
  }, 4500)
}

const stopAutoplay = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

const go = (i: number) => { current.value = i }
const viewNow = () => { try { window.open('/live','_blank') } catch(e){} }

const bgStyle = computed(() => ({
  backgroundImage: `url(${images.value[current.value]})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))
</script>
<style scoped>
.live-strip{ position: relative; width:100%; height:400px; display:block; overflow:hidden }
.overlay{ position:absolute; inset:0; background: linear-gradient(90deg, rgba(3,10,30,0.74), rgba(3,10,30,0.26)); z-index:0 }
.strip-inner{ position:relative; z-index:1; max-width:1400px; margin:0 auto; padding:36px 40px; display:flex; align-items:center; justify-content:space-between; gap:26px; height:100%; }
.left{ display:flex; flex-direction:column; gap:10px; justify-content:center; }
.hint{
  color: rgba(202, 194, 158, 0.98);
  font-weight:900;
  font-size:1.3rem;
  opacity:0.99;
  margin-bottom: 18px;
}
.title{
  color:#fff;
  font-weight:700;
  margin:0;
  font-family: var(--font-display);
  text-transform: uppercase;
  line-height:1;
  letter-spacing: 0.6px;
}
.word-main{
  display:block;
  font-size:2.3rem;
  font-weight:700;
  letter-spacing:1px;
  line-height:1;
}
.word-sub{
  display:block;
  font-size:1.75rem;
  font-weight:400;
  opacity:0.95;
  margin-top:6px;
}
.sub-normal{
  font-weight:200;
}
.sub-strong{
  font-weight:700;
}
.btn-ver{
  margin-top:14px;
  background:#2a4f94;
  color:#fff;
  border:none;
  padding:14px 20px;
  border-radius:10px;
  font-weight:500;
  cursor:pointer;
  font-size:1.05rem;
  width:200px;
}
.center{ display:flex; align-items:center; justify-content:center }
.dots{ position:absolute; left:50%; transform:translateX(-50%); bottom:10px; display:flex; gap:13px; z-index:2 }
.dots button{ width:10px; height:10px; border-radius:50%; background: rgba(255,255,255,0.34); border:none; transition: transform .15s ease }
.dots button.active{ background:#fff; width:12px; height:12px; box-shadow: 0 10px 26px rgba(0,0,0,0.45); transform: translateY(-3px) }
.right{ display:flex; align-items:center; gap:14px }
.social{ display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; background: rgba(255,255,255,0.06); border-radius:8px; color:#fff }

@media (max-width:768px){
  .live-strip{ height:260px }
  .strip-inner{ padding:18px 22px; flex-direction:column; justify-content:center; gap:14px }
  .word-main{ font-size:2.2rem }
  .word-sub{ font-size:1rem }
  .hint{ font-size:1rem }
  .dots button{ width:14px; height:14px }
  .dots button.active{ width:18px; height:18px }
  .center{ order:3 }
  .right{ order:2 }
}

</style>
