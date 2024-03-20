<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title> Migraciones </v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <FileReader ref="fileReader" />
    </v-flex>
  </v-layout>
</template>

<script>

  import FileReader from '~/components/migrations/fileReader';

export default {
  components: {
    FileReader
  }
}
</script>
