<template>
  <v-app dark id="app">
    <v-container class="padding-lat">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="primary"
      dark
      v-if="logged"
    >
      <v-list nav >
        <v-list-item two-line @click="$refs.userProfileDialog.openDialog()">
          <v-list-item-avatar>
            <v-avatar color="white">
              <v-icon color="#272727" v-if="!img">mdi-account</v-icon>
              <v-img v-if="img"
                :src="img"
                :lazy-src="img"
              ></v-img>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title> {{ username ? username.split(" ")[0] + ' ' + username.split(" ")[1] : 'Usuario' }} </v-list-item-title>
            <v-list-item-subtitle>Administrador</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" style="hyphens: auto" />
          </v-list-item-content>
          <v-avatar v-if="item.counter && counters.requests > 0 && item.title == 'Solicitudes'" color="error" size="30">
            <span>{{ counters.requests }}</span>
          </v-avatar>
          <v-avatar v-if="item.counter && counters.reports > 0 && item.title == 'Reportes'" color="error" size="30">
            <span>{{ counters.reports }}</span>
          </v-avatar>
          <v-avatar v-if="item.counter && counters.mensajero > 0 && item.title == 'Mensajero'" color="error" size="30">
            <span>{{ counters.mensajero }}</span>
          </v-avatar>

        </v-list-item>
      <v-divider></v-divider>
       <v-list-item two-line>
         <br>
         <div>
           <center>
          <v-btn style="width:200px"  color="" block @click="logout()">Cerrar sesión</v-btn>
           </center>
         </div>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    </v-container>

    <v-app-bar :clipped-left="clipped" fixed app height="48" v-if="logged">

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />


      <v-toolbar-title @click.stop="drawer = !drawer" class="logo">
        <v-img
          src="/pre-consulta/pre-consulta/logo_mega.png"
          lazy-src="/pre-consulta/logo_mega.png"
          max-width="114"
          left="-30"
        ></v-img>
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-main>
      <transition name="fade">
      <v-container grid-list-xl>
        <nuxt />
      </v-container>
    </transition>
    </v-main>
  <!--mensaje login-->
    <div>
      <v-dialog
        transition="dialog-top-transition"
        max-width="400"
        v-model="snackBar"
      >
          <v-card>
            <v-toolbar
              color="primary"
              dark
              class="tittle1"
            >
          <div class="tittle1">
              Mensaje
          </div>
            </v-toolbar>
            <v-card-text>
              <div>
                <v-container>
                  <div class="mensaje">
              {{ snackText }}
                  </div>
                </v-container>
              </div>
            </v-card-text>
            <v-card-actions class="justify-end">
            </v-card-actions>
          </v-card>
      </v-dialog>
    </div>

    <Event-Dispacher />
    <UserProfileDialog ref="userProfileDialog" />
  </v-app>
</template>

<script>
import EventDispacher from "~/components/EventDispacher";
import UserProfileDialog from '~/components/UserProfileDialog.vue';

import { mapState } from "vuex";

export default {
  components: {
    EventDispacher,
    UserProfileDialog
  },
  data() {
    /**
     * ocultado
     *    {
          icon: "mdi-file-upload",
          title: "Migración",
          to: "/",
        },
        {
          icon: "mdi-file-upload",
          title: "Alimentador",
          to: "/feeder",
        },
     */
    return {
          dialogM: false,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-file-edit",
          title: "Editor",
          to: "/editor",
        },
        {
          icon: "mdi-file-multiple",
          title: "Catálogo",
          to: "/catalogs",
        },
        {
          icon: "mdi-home-edit",
          title: "Página principal",
          to: '/principalPage'
        },
        {
          icon: "mdi-file-cog",
          title: "Estadísticas y Gráficas",
          to: "/chartsAndGraphics",
        },
        {
          icon: "mdi-file-find",
          title: "Solicitudes",
          to: '/request',
          counter : true,
        },
        {
          icon: "mdi-alert-circle",
          title: "Reportes",
          to: '/reports',
          counter : true,
        },
        {
          icon: "mdi-message-image",
          title: "Mensajero",
          to: '/mensajero',
          counter : true,
        },
        {
          icon: "mdi-cog-box",
          title: "Configuración",
          to: "/configuration",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  computed: mapState(["logged", "snackText", "snackBar", "username", "img", 'counters']),
  methods: {
    logout() {
      localStorage.clear();
      this.$store.commit("logOut");
      this.$store.commit("openSnack", "Su sesión ha finalizado con éxito");
      this.$router.push("/login");

    },
  },
};
</script>
<style scoped>

.mensaje{
  text-align: center !important;
  vertical-align: middle;
  font-size:21px;
  padding-top:12px;
  font-weight: 400;
}
.tittle1{
  text-align: center !important;
  vertical-align: middle;
  font-size: 25px;
  align-items: center;
  display: flex;
  justify-content: center;
}
.padding-lat{
  padding-left: 1px;
  padding-right: 1px;
}


</style>
