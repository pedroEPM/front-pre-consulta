<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 md10>
        <v-text-field
          label="Busqueda de usuario"
          hide-details
          outlined
          dense
          class="custom-field"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md2>
        <v-btn block color="primary">
          <v-icon left>mdi-magnify</v-icon> Buscar
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        userHeaders : [
          { text : 'Nombre', value : 'name' },
        ]
      }
    },
    created(){
      if(process.browser){
        this.getUsers();
      }
    },
    methods : {
      async getUsers(){
        const response = await this.$axios.$get('/users', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        console.log(response.data);
      }
    }
  }
</script>

<style>

</style>
