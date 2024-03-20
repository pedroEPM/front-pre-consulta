<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Agregar publicación</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Nombre"
            v-model="publicationName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="publicationsStatus"
            v-model="publicationState"
            :disabled="loading"
            :rules="publicationState != false ? validations.fieldRules : validations.noRules"
          ></v-select>

          <v-text-field label="XML" disabled></v-text-field>

          <v-select
            label="Orden"
            :items="orderlist"
            v-model="order"
            :disabled="loading"
            :rules="validations.fieldRules"
            hint="esta es la posición del orden, como se mostrará en el centro de consulta"
            persistent-hint
          ></v-select>

          <v-file-input
            label="Ícono"
            v-model="icon"
            :disabled="loading"
            :rules="dialog !== false ? validations.imageRules : validations.noRules"
          ></v-file-input>
        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn color="primary" @click="validate()">Agregar</v-btn>
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
    imgPath: process.env.imgPath,
    defaultImg : process.env.defaultImg,
    dialog: false,
    loading: false,
    publicationName: null,
    icon: null,
    iconB64 : null,
    xml: null,
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      imageRules: [
        ( v ) => (!!v && v.type == 'image/png' || !!v && v.type == 'image/jpeg' ) || 'El ícono solo puede ser png, jpeg o jpg',
      ],
      noRules: []
    },
    publicationsStatus : [
      { name: 'Vigente', value: true },
      { name: 'No vigente', value: false }
    ],
    publicationState : null,
    orderlist : [],
    order : null
  }),
  watch : {
    icon( newValue ){
      if( newValue != undefined || newValue != null){
        this.imageToBase64(newValue);
      }else{
        this.iconB64 = null;
      }
    },
    publicationState( newValue ){
      if( newValue != null){
        let count = 0;
        this.$parent.publications.forEach( x => {
          if( x.status == this.publicationState || x.status != this.publicationState ){
            count++;
          }
        });
        this.generateOder( count );
      }
    }
  },
  methods: {
    openDialog() {
      // this.getOriginalImgB64();
      this.publicationState = true;
      this.dialog = true;
    },
    async addPublication() {
      this.loading = true;
      let formData = new FormData();
      let body = {
        name: this.publicationName,
        XML: this.xml,
        state : this.publicationState,
        Image64 : null,
        order : this.order,
        name: this.icon.name,
      };
      console.log(body);
      // formData.append("Imagen", this.icon);
      formData.append("body", JSON.stringify(body));

      let x = this.iconB64.length;
      let y = 100000;
      x = Math.round(( x / y ) + 1);
      for( let i = 0; i < x; i++){
        // body['Image64_' + i ] = this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
        formData.append('Image64_' + i, this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) ));
      }
      formData.append('x', x);

      try {
        const response = await this.$axios.$post("/addPublication", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000
        });
        if (response) {
          this.$parent.getPublications();
          this.$store.commit(
            "openSnack",
            "La publicación ha sido registrada exitosamente"
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
    cleanAndClose() {
      this.notebookName = "";
      this.publicationID = "";
      this.icon = null;
      this.publicationState = null;
      this.loading = false;
      this.dialog = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.addPublication();
      }
    },
    imageToBase64 (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.iconB64 = reader.result;
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
    async getOriginalImgB64(){
      try {
        const response = await this.$axios.$get(this.imgPath + this.defaultImg, {
            responseType: "blob"
        });
        await this.imageToBase64(response)
      } catch (error) {
        console.log(error)
      }
    },
    generateOder( total ){
      this.orderlist = [];
      for( let i = 1; i <= total + 1; i++){
        this.orderlist.push(i);
      }
    },
  },
};

</script>

<style>
</style>
