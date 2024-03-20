<template>
  <v-list dense>

    <v-list-item class="list" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Clave:</b> {{ id }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Publicada:</b>
          {{ date }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Tomada:</b> {{ taked }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="section != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Sección:</b> {{ section }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Lugar:</b> {{ location }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="agency != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Agencia</b>: {{ agency }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item style="min-height: 25px" v-if="type == 'images'">
      <v-list-item-content style="padding: 2px 0; text-transform: capitalize">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Clasificación</b>: {{ clasification }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Página:</b> {{ page }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Fotógrafo:</b> {{ photographer }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item  style="min-height: 25px" v-if="type == 'images'">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Material:</b>
          {{ material }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Formato:</b> {{ format }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Medidas:</b> {{ size }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>
<!-- 
    <v-list-item v-if="published != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 4px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Publicada:</b>
          {{ published }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="selleable != ''" style="min-height: 25px">
      <v-list-item-content style="padding: 4px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Vendible:</b>
          {{ selleable }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item> -->

    <v-list-item v-if="type == 'images'" style="min-height: 25px">
      <v-list-item-content style="padding: 2px 0">
        <v-list-item-title style="font-size: 16px; color: #909090; font-weight: 400;"
          ><b style="color: black">Observadores:</b> {{ descriptors }}</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },
    id: {
      type: String,
    },
    date: {
      type: String,
    },
    section: {
      type: String,
    },
    taked: {
      type: String,
    },
    location: {
      type: String,
    },
    agency: {
      type: String,
    },
    clasification: {
      type: String
    },
    page: {
      type: Number,
    },
    photographer: {
      type: String
    },
    material: {
      type: String,
    },
    published: {
      type: String,
    },
    selleable: {
      type: String,
    },
    format: {
      type: String
    },
    size: {
      type: String
    },
    descriptors: {
      type: String
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
