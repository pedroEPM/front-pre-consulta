<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <div
        v-for="(item, index) in browsers"
        v-bind:key="index"
        class="mb-5"
      >
        <label>{{ item.name }}</label>
        <v-progress-linear
          :value="item.value"
          color="light-blue darken-3"
          height="25"
          rounded
        >
          <template>
            <strong>{{ item.value.toFixed() }}%</strong>
          </template>
        </v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data(){
      return {

      }
    },
    props : [ 'title', 'browsers' ]
  }
</script>

<style>

</style>
