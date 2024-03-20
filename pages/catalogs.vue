<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title>Catálogo</v-card-title>
      </v-card>
    </v-flex>

     <v-flex xs12 v-if="false">
      <v-card>
        <v-card-text>
          <v-text-field
            label="Clave"
            placeholder="Ingrese la clave"
            outlined
          ></v-text-field>
          <v-text-field
            label="Nombre"
            placeholder="Ingrese el nombre"
            outlined
          ></v-text-field>
          <v-select
            label="Publicación"
            placeholder="Ingrese la publicación"
            outlined
          ></v-select>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md6>
      <Publications-Card />
    </v-flex>

    <v-flex xs12 md6>
      <Notebook-Card />
    </v-flex>

    <v-flex xs12 md6>
      <Editions-card />
    </v-flex>

    <v-flex xs12 md6>
      <Clasifications-Card />
    </v-flex>

    <v-flex xs12 md6>
      <PhotographersCard />
    </v-flex>

    <v-flex xs12 md6>
      <PublishingAgencyCard />
    </v-flex>

    <v-flex xs12 md6>
      <SecctionCard />
    </v-flex>

  </v-layout>
</template>

<script>
import NotebookCard from "~/components/catalogs/NotebookCard";
import SecctionCard from "~/components/catalogs/sectionCard";
import PublicationsCard from "~/components/catalogs/PublicationsCard";
import EditionsCard from "~/components/catalogs/EditionsCard";
import ClasificationsCard from "~/components/catalogs/ClasificationsCard" ;
import PhotographersCard from "~/components/catalogs/PhotographersCard";
import PublishingAgencyCard from '~/components/catalogs/PublishingAgencyCard';



export default {
  components: {
    NotebookCard,
    PublicationsCard,
    EditionsCard,
    ClasificationsCard,
    PhotographersCard,
    PublishingAgencyCard,
    SecctionCard
  },
  data: () => ({}),
};
</script>

<style>
</style>
