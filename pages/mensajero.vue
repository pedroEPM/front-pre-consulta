<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Mensajero</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </v-card>
    </v-flex>

    <v-flex xs12 md12>
      <MensajeroCard />
    </v-flex>

  </v-layout>
</template>

<script>
  import MensajeroCard from '~/components/mensajero/MensajeroCard.vue';
  export default {
   components : {
     MensajeroCard
   },
   data(){
     return {

     }
   }
  }
</script>

<style>

</style>
