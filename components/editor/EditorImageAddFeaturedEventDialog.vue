<template>
  <v-dialog
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-spacer />
          <v-toolbar-title>Creación de acontecimiento destacado</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 md7>
              <v-card
                outlined
                height="87vh"
                class="scroll"
                style="overflow-y: auto"
              >
                <v-card-text>
                  <v-form ref="form2">

                    <v-text-field
                      outlined
                      v-model="title"
                      label="Título del tema"
                      :rules="validations.fieldRules"
                    ></v-text-field>

                    <!-- <v-file-input
                      :rules="dialog != false ? validations.imageRules : validations.noRules"
                      v-model="file"
                      outlined
                      label="Ingrese la imagen"
                      counter=""
                    >
                      <template v-slot:selection="{ text }">
                        <v-chip small>
                          {{ text }}
                        </v-chip>
                      </template>
                    </v-file-input> -->

                  </v-form>
                </v-card-text>
                <v-card-text>
                  <v-layout row wrap justify-center>
                    <v-flex xs12 md6>
                      <v-card
                        style="cursor : pointer"
                        @click="$refs.contentZoomDialog.openDialog(imgPath + imgSrc)"
                      >
                        <v-img :src="imgPath + imgSrc" contain></v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 md5>
              <v-card
                outlined
              >
                <v-card-title>Información</v-card-title>
                <v-card-text>
                  <v-form ref="form">

                    <v-textarea
                      outlined
                      label="Descripción del evento"
                      height="8rem"
                      v-model="description"
                      :rules="validations.fieldRules"
                    ></v-textarea>

                    <v-menu
                      v-model="dateMenu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Fecha de publicación"
                          append-icon="mdi-calendar"
                          readonly
                          outlined
                          hide-details
                          dense
                          v-bind="attrs"
                          v-on="on"
                          :rules="validations.fieldRules"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        locale="es-MX"
                        @input="dateMenu = false"
                        :max="new Date().toISOString()"
                      ></v-date-picker>
                    </v-menu>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pl-5 pr-5">
                  <v-layout row wrap class="pa-5">
                    <v-btn block color="primary" class="mb-2" @click="validate()">Guardar</v-btn>
                    <v-btn block color="secondary" class="mb-2" @click="reset()" >Limpiar campos</v-btn>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>
    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>
        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder con la carga del acontecimiento destacado?
        </v-card-text>
        <v-card-text v-else>
          Cargando el acontecimiento destacado
        </v-card-text>
        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="addFeaturedEvent()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ContentZoomDialog ref="contentZoomDialog" />
  </v-dialog>
</template>

<script>
  import ContentZoomDialog from '~/components/editor/contentZoomDialog.vue';
  export default {
    components : {
      ContentZoomDialog
    },
    data(){
      return {
        dialog : false,
        loading : false,
        confirm : false,
        file : null,
        title : null,
        description : null,
        dateMenu : false,
        date : null,
        validations : {
          fieldRules : [
            ( v ) => !!v || 'Campo requerido'
          ],
          imageRules: [
            ( v ) => (!!v && v.type == 'image/png' ) || 'La imagen solo puede ser png',
          ],
          noRules: []
        },
        imgPath: process.env.imgPath,
      }
    },
    props : {
      imgSrc : {
        type : String,
        // required : true,
      }
    },
    watch : {
      file(newVa){
        console.log(newVa)
      }
    },
    methods : {
      openDialog(){
        this.dialog = true;
      },
      getImagePreview( file ){
        return URL.createObjectURL(file);
      },
      validate(){
        if(this.$refs.form.validate() && this.$refs.form2.validate()){
          this.confirm = true;
        }
      },
      reset(){
        this.$refs.form.reset();
        this.$refs.form2.reset();
      },
      async addFeaturedEvent(){
        this.loading = true;
        let body = {
          titleEvent : this.title,
          date : this.date,
          Description : this.description,
          imageSrc : this.imgSrc,
        }
        try {
          const response = await this.$axios.$post('/featureEvents', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });


          this.cleanAndClose();
          this.$store.commit(
            'openSnack',
            'El acontecimiento destacado ha sido agregado exitosamente'
          );

        } catch (error) {
          this.loading = false;
          this.confirm = false;
          console.log(error.response)

          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo')
        }
      },
      cleanAndClose(){
        this.reset();
        this.loading = false;
        this.confirm = false;
        this.dialog = false;
      },
    }
  }
</script>

<style>

</style>
