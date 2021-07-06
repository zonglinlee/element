<template>
  <div>
    <div @click="emitGlobalEvent">emitGlobalEvent</div>
  </div>
</template>

<script>
import Bus from "/examples/bus"
export default {
  name: "testBus",
  methods: {
    emitGlobalEvent() {
      Bus.$emit('emitGlobalEvent','hello,there!')
    }
  }
}
</script>

<style scoped>

</style>
