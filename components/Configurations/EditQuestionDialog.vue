<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-card-title
        >Editar Pregunta <v-spacer /><v-btn icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="question"
            label="Pregunta"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-text-field
            v-model="answer"
            label="Respuesta"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="validate()">Actualizar</v-btn>
      </v-card-actions>

      <v-progress-linear
        indeterminate
        color="primary"
        v-if="loading"
      ></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    question: null,
    answer: null,
    loading: false,
    id: null,
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
  }),
  methods: {
    openDialog(item) {
      this.dialog = !this.dialog;
      this.id = item._id;
      this.question = item.question;
      this.answer = item.answer;
    },
    async editQuestion() {
      this.loading = true;

      let body =  {
        _id: this.id,
        question: this.question,
        answer: this.answer,
      };
      try {
        const response = await this.$axios.$post("/modify-question", body, {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        this.$store.commit(
          "openSnack",
          "La pregunta ha sido modificada exitosamente"
        );
        this.$parent.$parent.getQuestions();
        this.cleanAndClose();
      } catch (error) {
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        this.loading = false;
        return;
      }
    },
    cleanAndClose() {
      this.loading = false;
      this.answer = '';
      this.question = '';
      this.id = null;
      this.dialog = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.editQuestion();
      }
    },
  },
};
</script>

<style>
</style>
