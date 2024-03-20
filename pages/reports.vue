<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-toolbar flat color="primary">
          <v-toolbar-title>Reportes de Incidencias</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </v-card>
    </v-flex>

    <v-flex xs12 md12>
      <ReportsDialog />
    </v-flex>

  </v-layout>
</template>

<script>
  import ReportsDialog from '~/components/report/ReportsDialog';
  export default {
   components : {
     ReportsDialog
   },
   data(){
     return {

     }
   }
  }
</script>

<style>

</style>
