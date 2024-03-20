<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title>Página principal</v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <FeaturedEvents />
    </v-flex>

    <v-flex xs12>
      <NewsBanners />
    </v-flex>

    <v-flex xs12>
      <BackgroundBanner />
    </v-flex>
  </v-layout>
</template>

<script>

  import FeaturedEvents from '~/components/principalPage/FeaturedEvents';
  import NewsBanners from '~/components/principalPage/Banners';
  import BackgroundBanner from '~/components/principalPage/backgroundBanner';

  export default {
    components: {
      FeaturedEvents,
      NewsBanners,
      BackgroundBanner
    },
    data: () => ({}),
  };
</script>

<style>
</style>
