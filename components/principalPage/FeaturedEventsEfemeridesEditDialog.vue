
<template>
  <div>
    <v-dialog v-model="dialog" max-width="600">
      <v-card
        outlined
        class="scroll"
        style="overflow-y:auto"
      >
        <v-toolbar elevation="0">
          <v-toolbar-title>Editar acontecimiento destacado</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" :disabled= "loading">

            <v-row wrap>
              <v-file-input
                label="Ingrese la imagen"
                v-model="file"
                :rules="file != null ? dialog != false ? validations.imageRules : validations.noRules : validations.noRules"
              ></v-file-input>
              <ImageSizeDialog class="mt-2" :text="'1280 x 1280 pixels'"/>

            </v-row>

            <v-img @click="$refs.contentZoomDialog.openDialog(imgSRC)" style="cursor : pointer" max-height="250" v-if="file != null" :src="imgSRC" contain imgPreview></v-img>
            <v-img @click="$refs.contentZoomDialog.openDialog(imgPath + imgSrc)" style="cursor : pointer" max-height="250" v-if="file == null" :src="imgPath + imgSrc" contain imgPreview></v-img>

            <v-text-field
              v-model="title"
              label="Título del tema"
              :rules="validations.fieldRules"
            ></v-text-field>

            <v-textarea
              label="Descripción del evento"
              height="8rem"
              v-model="description"
              :rules="validations.fieldRules"
              class="mb-1"
            ></v-textarea>

            <v-select
              dense
              label="Estado"
              item-text="state"
              item-value="value"
              :items="states"
              v-model="state"
              :disabled="loading"
              :rules="state == false ? validations.noRules : validations.fieldRules"
              class="mb-5"
            ></v-select>

            <v-select
              dense
              label="Evento principal"
              item-text="state"
              item-value="value"
              :items="states"
              v-model="mainEvent"
              :disabled="loading"
              :rules="mainEvent == false ? validations.noRules : validations.fieldRules"
              class="mb-5"
            ></v-select>

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
                  hide-details
                  dense
                  v-bind="attrs"
                  v-on="on"
                  :rules="validations.fieldRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="dateMenu = false"
                :max="new Date().toISOString()"
                locale="es-MX"
              ></v-date-picker>
            </v-menu>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="validate()">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog max-width="300" v-model="confirm">
        <v-card :loading="loading">
          <v-card-title>Actualizar</v-card-title>
          <v-card-text v-if="!loading">
            ¿Esta seguro de querer actualizar este acontecimiento destacado?
          </v-card-text>
          <v-card-text v-if="loading">Actualizando acontecimiento destacado</v-card-text>
          <v-card-actions v-if="!loading">
            <v-spacer />
            <v-btn text color="" @click="confirm = false">Cancelar</v-btn>
            <v-btn text color="red" @click="editFeaturedEvent()">Actualizar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
    <ContentZoomDialog ref="contentZoomDialog" />
  </div>
</template>

<script>
  import ContentZoomDialog from '~/components/editor/contentZoomDialog.vue';
  import ImageSizeDialog from '~/components/principalPage/ImageSizeDialog.vue';

  export default {
    components : {
      ContentZoomDialog,
      ImageSizeDialog
    },
    data(){
      return {
        imgPath: process.env.imgPath,
        dialog : false,
        loading : false,
        confirm : false,
        file : null,
        iconB64 : null,
        title : null,
        description : null,
        dateMenu : false,
        date : null,
        id : null,
        state : null,
        mainEvent : null,
        imgSrc : null,
        validations : {
          fieldRules : [
            ( v ) => !!v || 'Campo requerido'
          ],
          imageRules: [
            ( v ) => (!!v && v.type == 'image/png' || !!v && v.type == 'image/jpeg') || 'El ícono solo puede ser png, jpg, jpeg',
          ],
          noRules: []
        },
        states : [
          { state : 'Activo', value : true },
          { state : 'Inactivo', value : false }
        ],
        imgSRC : null,
      }
    },
    watch : {
      file( newValue ){
        if( newValue != undefined || newValue != null){
          this.imgSrc = null,
          this.imgSRC = this.getImagePreview(newValue);
          this.imageToBase64(newValue);
        }else{
          this.iconB64 = null;
        }

      }
    },
    methods : {
      openDialog( id ){
        this.dialog = true;
        this.id = id;
        this.getFeaturedEvent();
      },
      getImagePreview( file ){
        return URL.createObjectURL( file );
      },
      async getFeaturedEvent(){
        try {
          this.loading = true;

          const response = await this.$axios.$get('/featureEvents/' + this.id, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.title = response.data.titleEvent;
          this.imgSrc = response.data.imageSrc;
          this.description = response.data.Description;
          this.state = response.data.active;
          this.mainEvent = response.data.mainEvent;

          this.date = new Date(response.data.date.substring(0,10)).toISOString().substring(0,10);
          await this.getOriginalImgB64();
          this.loading = false;
        } catch (error) {
          console.log(error)
        }
      },
      async editFeaturedEvent(){
        this.loading = true;
        let formData = new FormData();
        const body = {
          date : this.date,
          titleEvent : this.title,
          Description : this.description,
          active : this.state,
          id : this.id,
          // Image64 : this.iconB64,
          Image64 : null,
          mainEvent : this.mainEvent,
          imageName: this.file !== null ? this.file.name : null,
        };

        if( this.file !== null ){
          let x = this.iconB64.length;
          let y = 100000;
          x = Math.round(( x / y ) + 1);
          for( let i = 0; i < x; i++){
            // body['Image64_' + i ] = this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) );
            formData.append('Image64_' + i, this.iconB64.substring( ( i * y ), ( y * ( i + 1) ) ));
          }
          formData.append('x', x);
          body.quantityOfX = x;

          // formData.append('Imagen', this.file);
        }
        formData.append('body', JSON.stringify(body));
        //mainEvent
        try {

          const response = await this.$axios.$put('/featuredEvents', formData, {
            headers : { Authorization : 'Bearer ' + localStorage.token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
          });

          this.cleanAndClose();

        } catch (error) {
          this.loading = false;
          this.confirm = false;
          console.log(error.response);
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, inténtelo de nuevo'
          );
        }

      },
      cleanAndClose(){
        this.$refs.form.reset();
        let pag = this.$parent.$parent.$parent.page;
        let month = this.$parent.$parent.$parent.month;
        this.$parent.$parent.$parent.getEvents(month);
        this.$parent.$parent.$parent.getArrayImage(pag);
        this.loading = false;
        this.confirm = false;
        this.file = null;
        this.dialog = false;
        this.iconB64 = null;
      },
      validate(){
        if( this.$refs.form.validate()){
          this.confirm = true;
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
          const response = await this.$axios.$get(this.imgPath + this.imgSrc, {
              responseType: "blob"
          });
          await this.imageToBase64(response)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>

<style>

</style>
