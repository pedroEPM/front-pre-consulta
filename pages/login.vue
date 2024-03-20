<template>
  <div class="center-background">
    <div class="background"></div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center class="text-center">
        <login-card />
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import LoginCard from "@/components/LoginCard";

export default {
  components: {
    LoginCard,
  },
};
</script>

<style lang="scss" scoped>
.center-background {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
}
.background {
  background-image: url("/pre-consulta/pre-consulta/login_background.jpg");
  //filter: blur(4px);
  //-webkit-filter: blur(4px);
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
}
</style>
