<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-toolbar-title>Editar Publicación</v-toolbar-title>

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
            :rules="
              publicationState != false
                ? validations.fieldRules
                : validations.noRules
            "
          ></v-select>
          <!--
          <v-text-field label="XML" disabled></v-text-field> -->

          <v-select
            label="Orden"
            :items="orderlist"
            v-model="order"
            :disabled="loading"
            :rules="validations.fieldRules"
            hint="esta es la posición del orden, como se mostrará en el centro de consulta"
            persistent-hint
          ></v-select>

          <v-select
            label="Estado"
            item-text="name"
            item-value="id"
            :items="publicationsGroup"
            v-model="group"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-select>

          <v-file-input
            label="Ícono"
            v-model="icon"
            :disabled="loading"
            :rules="
              icon !== null
                ? dialog !== false
                  ? validations.imageRules
                  : validations.noRules
                : validations.noRules
            "
          ></v-file-input>
        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
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
export default {
  data: () => ({
    imgPath: process.env.imgPath,
    defaultImg: process.env.defaultImg,
    dialog: false,
    loading: false,
    id: null,
    publicationName: null,
    icon: null,
    iconB64: null,
    iconB642: null,
    iconSRC: null,
    publicationID: null,
    publications: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      imageRules: [
        (v) =>
          (!!v && v.type == "image/png") ||
          (!!v && v.type == "image/jpeg") ||
          "El ícono solo puede ser png, jpeg o jpg",
      ],
      noRules: [],
    },
    publicationsStatus: [
      { name: "Vigente", value: true },
      { name: "No vigente", value: false },
    ],
    publicationsGroup: [
      { name: "Medios tradicionales", id: 1 },
      { name: "Medios ligeros", id: 2 },
      { name: "Factoría", id: 3 },
      { name: "Otros periódicos", id: 4 },
    ],
    publicationState: null,
    orderlist: [],
    order: null,

    idk: "",
    group: null,
  }),
  watch: {
    icon(newValue) {
      if (newValue != undefined || newValue != null) {
        this.imageToBase64(newValue);
        // alert("it's ok")
      } else {
        this.iconB64 = null;
      }
    },
    publicationState(newValue) {
      console.log("value", newValue);
      if (newValue != null) {
        let count = 0;
        console.log("recorre esto", this.$parent.publications);
        this.$parent.publications.forEach((x) => {
          if (
            x.status == this.publicationState ||
            x.status != this.publicationState
          ) {
            count++;
          }
        });

        this.generateOder(count);
      }
    },
  },
  methods: {
    openDialog(item) {
      // this.iconSRC = item.icon;
      // this.getOriginalImgB64();
      this.publicationState = true;
      this.dialog = true;
      // this.getPublications();
      this.id = item._id;
      this.publicationName = item.publicationName;
      this.publicationState = item.status != undefined ? item.status : null;
      this.order = item.order != undefined ? item.order : null;
      this.group = item.group ?? 4;
    },
    async updatePublication() {
      this.loading = true;
      let iconB64 = this.iconB64;
      let formData = new FormData();
      let body = {
        _id: this.id,
        publicationName: this.publicationName,
        XML: "",
        state: this.publicationState,
        Image64: null,
        order: this.order,
        name: this.icon ? this.icon.name : null,
        group: this.group,
      };
      // console.log(URL.createObjectURL(this.icon));
      formData.append("body", JSON.stringify(body));
      if (this.icon) {
        formData.append("Imagen", this.icon);
        let x = iconB64.length;
        let y = 100000;
        x = Math.round((x / y) + 1);
        for (let i = 0; i < x; i++) {
          // body['Image64_' + i ] = iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
          formData.append(
            "Image64_" + i,
            iconB64.substring(i * y, y * (i + 1))
          );
        }
        formData.append("x", x);
        this.iconB642 = this.iconB64;
      }

      try {
        const response = await this.$axios.$put("/Publications", formData, {
          headers: { Authorization: "Bearer " + localStorage.token },
          maxContentLength: 100000000,
          maxBodyLength: 1000000000,
        });
        // console.log(response);
        if (response) {
          this.$parent.getPublications();
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
    // async getPublications() {
    //   const response = await this.$axios.$get("/Publications", {
    //     headers: { Authorization: "Bearer " + localStorage.token },
    //   });
    //   this.publications = response.data.publicaciones;
    //   // console.log(response);
    // },
    cleanAndClose() {
      this.publicationName = "";
      this.publicationID = "";
      this.publicationState = null;
      this.loading = false;
      this.dialog = false;
      setTimeout(() => {
        this.icon = null;
      }, 1000);
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.updatePublication();
      }
    },
    imageToBase64(file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.iconB64 = reader.result;
        // console.log(this.iconB64)
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },
    async getOriginalImgB64() {
      try {
        this.iconSRC = this.iconSRC.replaceAll(" ", "%20");
        console.log(this.imgPath + this.iconSRC);
        const response = await this.$axios.$get(this.imgPath + this.iconSRC, {
          responseType: "blob",
        });
        // console.log(response)
        this.icon = response;
        // alert('Entré y creé una imagen')
      } catch (error) {
        // alert('No entré y creé una imagen por dafult')
        // alert('Weeeeeeeeeeeeeeeeeeeeeeeeeeey')
        const response = await this.$axios.$get(
          window.location.origin + this.defaultImg,
          {
            responseType: "blob",
          }
        );
        this.icon = response;
        console.log(error);
      }
    },
    generateOder(total) {
      console.log("total", total);
      this.orderlist = [];
      for (let i = 1; i <= total + 1; i++) {
        this.orderlist.push(i);
      }
      console.log("lista", this.orderlist);
    },
  },
};
</script>

<style>
</style>
