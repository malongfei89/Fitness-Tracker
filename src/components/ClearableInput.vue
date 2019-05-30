<template>
  <div style="position:relative;z-index:0">
    <input
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :id = "id"
      @input="$emit('input', $event.target.value)"
      class="form-control"
      style="z-index:1;"
    >
    <button class="btn btn-link" @click.prevent="$emit('resetValue')" style="z-index:2;right:0;top:0;bottom:0;position:absolute;margin:auto">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'clearableInput',
  props: ['value', 'type', 'placeholder', 'id']
}
</script>

<style>

</style>
