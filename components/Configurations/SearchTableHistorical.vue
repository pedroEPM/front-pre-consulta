<template>
  <v-layout wrap>
    <v-layout row>
      <v-flex xs12 md9>
        <v-text-field
          label="Busqueda"
          hide-details
          outlined
          dense
          class="custom-field"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md3>
        <v-btn block color="primary">
          <v-icon left>mdi-magnify</v-icon>Buscar
        </v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
  export default {

  }
</script>

<style>

</style>
