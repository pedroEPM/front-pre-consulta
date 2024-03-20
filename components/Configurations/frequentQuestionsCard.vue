<template>
  <v-card>
    <v-card-title>
      Preguntas Frecuentes
      <v-spacer />

      <v-btn color="primary" @click="$refs.addQuestionDialog.openDialog()"><v-icon left>mdi-plus</v-icon>Agregar</v-btn>
    </v-card-title>

    <v-card-text>
      <v-data-table :headers="faqHeaders" :items="faqs" :items-per-page="20">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon @click="$refs.editQuestionDialog.openDialog(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon @click="$refs.delQuestionDialog.openDialog(item._id)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
    <Add-Question-Dialog ref="addQuestionDialog"/>
    <Edit-Question-Dialog ref="editQuestionDialog"/>
    <Delete-Question-Dialog ref="delQuestionDialog"/>
  </v-card>
</template>

<script>
  import AddQuestionDialog from "~/components/Configurations/AddQuestionDialog.vue";
  import EditQuestionDialog from "~/components/Configurations/EditQuestionDialog.vue";
  import DeleteQuestionDialog from "~/components/Configurations/DeleteQuestionDialog.vue";
export default {
  components: {
    AddQuestionDialog,
    EditQuestionDialog,
    DeleteQuestionDialog,
  },
  data(){
    return {
      faqs: [],
      faqHeaders:[
        {
          text: "Pregunta",
          align: "start",
          sortable: false,
          value: "question",
        },
        { text: "Respuesta", value: "answer" },
        { text: "Acciones", value: "actions", aling: 'center', sortable: false },
      ],
    }
  },
  created(){
    if(process.browser){
      this.getQuestions();
    }
  },
  methods : {
    async getQuestions() {
      this.loading = true;
      const response = await this.$axios.$get("/question", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      console.log(response);
      this.faqs = response.data;
    },
  }
}
</script>

<style>

</style>
