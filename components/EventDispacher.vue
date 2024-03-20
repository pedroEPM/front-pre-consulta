<template></template>

<script>
  import { mapActions, mapState } from 'vuex';
export default {
  watch: {
    $route(to, from) {
      console.log("Route changed!");
      if (process.browser) {
        if (localStorage.token != null && localStorage.token != undefined) {
          this.validateSession();
          console.log("There is a session");
        } else {
          this.$store.commit('userLoged', false);
          console.log("There isn't a session");
          this.$store.commit("openSnack", "se ha cerrado sesión");
          this.$store.commit("logOut");
          if(to.name !== 'login') {
            this.$store.commit("getRoutePath", to.path);
          }
          this.$router.push("/login");
        }
      }
    },
  },
  created() {
    if (process.browser) {
      this.$store.commit("setUsername", localStorage.getItem("username"));
    }
  },
  mounted() {
    if (process.browser) {
      if (localStorage.token != null && localStorage.token != undefined) {
        this.validateSession();
        this.$store.commit("logIn");
      } else {
        this.$store.commit("logOut");
        this.$router.push("/login");
      }
    }
  },
  computed: {
    ...mapState(['isLoged', 'notebooksStore', 'publicationsStore']),
  },
  methods: {
    ...mapActions([ 'getUser', 'getReportsStore', 'getRequestsStore', 'getNotebooksS', 'getPublicationsS' ]),
    async validateSession() {
      try {
        const response = await this.$axios
          .$get("/authentication", {
            headers: { Authorization: "Bearer " + localStorage.token },
          })
          .catch((error) => {
            if (error.response.status == 401) {
              this.$store.commit('userLoged', false);
              this.$store.commit("logOut");
              this.$router.push("/login");
            }
          });
        console.log('here is behavor isLoged');
        if(this.isLoged === false) {
          
          await Promise.allSettled([
            this.getUser(),
            this.getReportsStore(),
            this.getRequestsStore(),
            this.getPublicationsS(),
            this.getNotebooksS(),
          ]);
          
          this.$store.commit('userLoged', true);
        }
      } catch (error) {
        this.$store.commit('userLoged', false);
        this.$store.commit("openSnack", "Ha ocurrido un error validando su sesión, por favor intente de nuevo");
        this.$store.commit("logOut");
        this.$router.push("/login");

        console.log('error by eventDispacher');
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>
