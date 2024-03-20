<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 md4>
      <v-card outlined v-show="confirm2 === true" class="text-center mt-2 mb-2">
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
      <div style="margin-top:15px">
      <v-btn
      outlined
      color="indigo"
      @click="abrirmensaje()"
    >
      Cancelar Busqueda
    </v-btn>
          </div>
        </v-card-text>
      </v-card>
        <v-card v-show="cancel === true" outlined class="text-center mt-2 mb-2">
        <v-card-text>
          <v-icon size="80" class="mb-2">mdi-newspaper-variant-outline</v-icon>
          <h1 class="mb-5">Se ha cancelado la busqueda</h1>
          <h2 class="mb-5">Puede realizar otra busqueda</h2>
        </v-card-text>
      </v-card>
        <v-dialog v-model="confirm1" max-width="300" persistent>
       <v-card>
        <v-card-title>Mensaje</v-card-title>

        <v-card-text>
         <h3>¿Quieres cancelar la busqueda?</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn outlined @click="confirm1 = false">No</v-btn>
          <v-btn color="primary" @click="cancelar()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-flex>

  </v-layout>
</template>

<script>
export default {
  data(){
    return{
      confirm1 : false,
      confirm2: true,
      cancel : false,
    }
  },
  methods:{
    resetcard(){
      this.confirm1 = false;
      this.confirm2 = true;
      this.cancel  = false;
    },
    cancelar(){
      this.$emit("listencancelar");
      this.confirm1 = false;
       this.confirm2 = false;
      this.cancel = true;
    },
    abrirmensaje(){
      this.confirm1 = true;

    }
  }
};
</script>

<style>
</style>
