<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Editar Cuaderno</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Nombre"
            v-model="notebookName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-select
            label="Publicación"
            item-text="publicationName"
            item-value="_id"
            :items="publications"
            v-model="publicationID"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-select>

          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="notebooksStatus"
            v-model="notebookState"
            :disabled="loading"
            :rules="notebookState != false ? validations.fieldRules : validations.noRules"
          ></v-select>

          <v-select
            label="Orden"
            :items="orderlist"
            v-model="order"
            :disabled="loading"

          ></v-select>

          <v-select
            label="Tipo"
            item-text="notebookType"
            item-value="type"
            :items="notebookTypes"
            v-model="notebookType"
            :disabled="loading"

          ></v-select>

          <!-- <v-file-input
            label="Ícono"
            v-model="icon"
            :disabled="loading"
            :rules="dialog != false ? validations.imageRules : validations.noRules"
          ></v-file-input> -->
        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn color="primary" @click="validate()">Editar</v-btn>
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
export default {
  data: () => ({
    dialog: false,
    loading: false,
    id: null,
    notebookName: null,
    icon: null,
    publicationID: null,
    publications: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      imageRules: [
        ( v ) => (!!v && v.type == 'image/png') || 'El ícono solo puede ser png',
      ],
      noRules: []
    },
    notebooksStatus : [
      { name: 'Vigente', value: true },
      { name: 'No vigente', value: false }
    ],
    notebookTypes : [
      { notebookType : 'Suplemento', type : 'Suplemento'},
      { notebookType : 'Sección', type : 'Sección'}
    ],
    notebookType : null,
    notebookState : null,
    orderlist : [],
    order : null
  }),
  watch : {
    notebookState( newValue ){
      if( newValue != null){
        let count = 0;
        this.$parent.$parent.notebooks.forEach( x => {
          if( x.status == this.notebookState ){
            count++;
          }
        });
        this.generateOder( count );
      }
    }
  },
  methods: {
    openDialog(item) {
      this.id = item._id;
      this.dialog = true;
      this.getPublications();
      this.notebookName = item.NoteBookName;
      this.notebookState = item.status != undefined ? item.status : false;
      this.publicationID = item.PublicationReference != undefined ? item.PublicationReference._id : null;
      this.notebookType = item.type != undefined ? item.type : null;
      this.order = item.order != undefined ? item.order : null;
      // console.log(this.notebookState + ' ' + this.publicationID)
    },
    async updateNotebook() {
      this.loading = true;
      let formData = new FormData();
      let body = {
        _id: this.id,
        NoteBookName: this.notebookName,
        PublicationReference: this.publicationID,
        state : this.notebookState,
        type : this.notebookType,
        order : this.order
      };
      // formData.append("Imagen", this.icon);
      formData.append("body", JSON.stringify(body));

      try {
        const response = await this.$axios.$put("/NoteBooks", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
        });
        console.log(response);
        if (response) {
          this.$parent.$parent.getNotebooks();
          this.$store.commit(
            "openSnack",
            "El cuaderno ha sido actualizado exitosamente"
          );
          this.cleanAndClose();
        }
      } catch (error) {
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    async getPublications() {
      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.publications = response.data.publicaciones;
    },
    cleanAndClose() {
      this.notebookName = "";
      this.publicationID = "";
      this.icon = null;
      this.notebookType = null;
      this.dialog = false;
      this.order = null;
      this.notebookState = null;
      this.loading = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.updateNotebook();
      }
    },
    generateOder( total ){
      this.orderlist = [];
      for( let i = 1; i <= total + 1; i++){
        this.orderlist.push(i);
      }
    }
  },
};
</script>

<style>
</style>
