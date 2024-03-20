<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title>Alimentador</v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md4>
              <v-btn block color="primary" large><v-icon left>mdi-clipboard-check</v-icon> Crear tarea</v-btn>
            </v-flex>

            <v-flex xs12 md4>
              <v-btn block color="primary" large><v-icon left>mdi-database-refresh</v-icon>Actualizar</v-btn>
            </v-flex>

            <v-flex xs12 md4>
              <v-btn block color="primary" large><v-icon left>mdi-lock-open</v-icon>Log admin</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card>
        <v-card-title>Directorio</v-card-title>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card outlined height="500">

              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style>
</style>