<template>
  <v-app dark >
     <v-layout row wrap justify-center>

    <v-flex xs12 md6>
      <br>
    <v-card height="400" elevation="1"
  shaped>
  <v-card-text>
    <v-container>
     <br>
      <center>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <br>
    <p style="font-size:20px">Oops! Parece que ha ocurrido un error con la página que estabas buscando, puedes regresar al inicio </p>
  </center>
    </v-container>
  </v-card-text>
    </v-card>
    </v-flex>
    <v-flex xs12 md6>
       <br>
   <v-card
        height="400"
        elevation="1"
        shaped>
          <v-card-text>
            <v-container>
       <br>
            <center>
              <div>
           <v-img
          src="/pre-consulta/pre-consulta/logo_mega.png"
          lazy-src="/pre-consulta/logo_mega.png"
          max-width="300"
        ></v-img>
              </div>
              <div>
                <br>
      <v-btn
      color="primary"
      large
      dark
      @click="goToHome()"
    >
       Regresar al Inicio
    </v-btn>
          </div>
            </center>
            </v-container>
          </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
  </v-app>
</template>
<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Página no encontrada',
      otherError: 'Ha ocurrido un error'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  methods:{
      goToHome() {
      this.$router.push("/");
    },
  }
}
</script>

<style scoped>
h1 {
  font-size: 35px;
  line-height: 35px;
}


</style>
