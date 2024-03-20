<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title>Configuración</v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-card>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md6 v-for="( item, index ) in TAPuses" :key="index">
              <v-btn @click="openDialog(true, item.title, item)" block large color="primary"><v-icon left>mdi-pencil</v-icon>{{ item.title }}</v-btn>
            </v-flex>

            <!-- <v-flex xs12 md6>
              <v-btn @click="openDialog(false, 'Políticas de uso')" block large color="primary"><v-icon left>mdi-pencil</v-icon>Políticas de uso</v-btn>
            </v-flex> -->
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md5>
      <DepartamentsGroupCard />
    </v-flex>

    <v-flex xs12 md7>
      <FrequestQuestion />
    </v-flex>
    <!---PUESTOS Y PERMISOS--->
    <v-flex xs12 md6>
      <PositionsCard />
    </v-flex>

      <v-flex xs12 md6>
      <Permissions />
    </v-flex>
    <v-flex xs12>
      <v-tabs
        v-model="tab"
        background-color="transparent"
        color="secondary"
        grow
      >
        <v-tab
          v-for="item in items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <Users-Card />
        </v-tab-item>
        <v-tab-item>
          <Users-Card :isAdmin="true"/>
      </v-tab-item>
      </v-tabs-items>

    </v-flex>
    <EditorTextDialog ref="editorTextDialog" :title="dialogTitle" :isTerms="isTerms"/>
  </v-layout>
</template>

<script>
import UsersCard from "~/components/Configurations/UsersCard.vue";
import FrequestQuestion from '~/components/Configurations/frequentQuestionsCard.vue';
import DepartamentsGroupCard from '~/components/Configurations/DepartamentsGroupCard.vue';
import EditorTextDialog from '~/components/Configurations/EditorTextDialog.vue';
import PositionsCard from '~/components/catalogs/PositionCard';
import Permissions from '~/components/Configurations/Permissions.vue';
export default {
  components: {
    UsersCard,
    FrequestQuestion,
    DepartamentsGroupCard,
    EditorTextDialog,
    PositionsCard,
    Permissions
  },
  data:()=> ({
    permissionHeaders: [
      {
        text: "Nombre",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Acciones", value: "actions", aling: 'center', sortable: false },
    ],
    permissions: [],
    TAPuses : [],
    tab: null,
    items: [
      'Usuarios centro de consulta', 'Usuarios centro de preconsulta',
    ],
    dialogTitle : '',
    isTerms : true,
  }),
  created() {
    if(process.browser){
      this.getTAPuses();
      this.getPermissions();
    }
  },
  methods: {
    async getPermissions() {
      this.loading = true;
      const response = await this.$axios.$get("/permissions", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      // console.log(response);
      this.permissions = response.data;
    },
    async getTAPuses() {

      const response = await this.$axios.$get("/TAPuses", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      // console.log(response);
      this.TAPuses = response.data;
    },
    openDialog( isTerm, title, item ){
      this.isTerms = isTerm;
      this.dialogTitle = title;
      this.$refs.editorTextDialog.openDialog( item );
    }
  }
};
</script>

<style>
</style>
