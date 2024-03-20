<template>
  <div>
    <v-btn icon @click="openDialog()">
      <v-icon color="primary"> mdi-help </v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title>Tamaño recomendado</v-card-title>
        <v-card-text>El tamaño recomendado para subir es de: {{ text }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        dialog : false,
      }
    },
    props : {
      text : {
        type : String,
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      }
    }
  }
</script>

<style>

</style>
