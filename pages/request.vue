<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Solicitud de Archivos</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </v-card>
    </v-flex>

    <v-flex xs12 md12>
      <RequestDialog />
    </v-flex>

  </v-layout>
</template>

<script>
  import RequestDialog from '~/components/report/RequestDialog';
  export default {
   components : {
     RequestDialog
   },
   data(){
     return {
     }
   }
  }
</script>

<style>

</style>
