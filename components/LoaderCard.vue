<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 md4>
      <v-card outlined class="text-center mt-2 mb-2">
        <v-card-text>
          <v-icon size="80" class="mb-2">mdi-newspaper-variant-outline</v-icon>
          <h1 class="mb-5">Cargando información</h1>
          <h1 class="mb-5">Por favor, espere...</h1>
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>

        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{

  }
};
</script>

<style>
</style>
