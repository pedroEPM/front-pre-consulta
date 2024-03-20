<template>
  <div >
    <v-hover v-slot="{ hover }">
      <v-card @click="editImage()" :color=" hover ? '#BFCFED' : 'grey lighten-3'" class="card-hover">
        <v-img :src="image" @error="errorHandler" v-ripple style="cursor: pointer">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-card-text class="text-center img-label LineText">
          <div v-if="imageTitle" class="justifyText mb-1">
            <span class="img-title textSpacing">{{ imageTitle.substring(0,190) }}...</span><span v-if="imageTitle.length > 190">...</span> <br />

          </div>
          <v-img
            :src="icon"
            :lazy-src="icon"
            height="20"
            contain
            style="margin: auto !important"
          ></v-img>
          <span v-if="date != undefined "><b>Fecha:</b> {{ date != undefined ? date.substring(8, 10) + '-' + getMonth(date.substring(5, 7)) + '-' + date.substring(0, 4) : date }}</span>
          <span ><b>Página:</b> {{ item.page != null && item.page != undefined ? item.page : 'Desconocido' }}</span>
          <div v-if="notebookName != null">
            <span class="img-label"><b>Sección:</b> </span>
            {{ notebookName }}
          </div>
        </v-card-text>
        <v-card-text class="pt-0 pb-5">
          <v-row>
            <v-checkbox
              class="mt-0 ml-1"
              v-model="item.selected"
              hide-details
              style="padding-top: 0.5rem"
              @click="selectedImage( item )"
              v-if="selectedall === false || selectedall === true"
            ></v-checkbox>
            <v-spacer></v-spacer>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn rounded v-bind="attrs" v-on="on"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item @click="editImage()">
                  <v-list-item-title>
                    Editar
                    <v-icon right>mdi-pencil</v-icon>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="deleteImage()">
                  <v-list-item-title>
                    Eliminar
                    <v-icon right>mdi-delete</v-icon>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="openFeaturedAddDialog()">
                  <v-list-item-title>
                    Enviar a destacados
                    <v-icon right>mdi-star-circle</v-icon>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>
        </v-card-text>
      </v-card>
    </v-hover>
    <v-dialog v-model="loading" persistent max-width="300">
      <v-card>
        <v-card-title>Advertencía</v-card-title>
        <v-card-text>Agregando a las fotos seleccionadas</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
    },
    imageTitle: {
      type: String,
    },
    publicationName: {
      type: String,
    },
    notebookName: {
      type: String,
    },
    icon: {
      type: String,
    },
    selectedall: {
      type: String,
    },
    date: {
      type: String,
    },
    id: {
      type: String,
    },
    item : {
      type : Object
    },
    imgSrc : {
      type : String,
    }
  },
  data: () => ({
    check: false,
    loading : false,
    errImgPath : process.env.errImgPath
  }),
  methods: {
    async deleteImage() {
      this.$parent.$parent.deleteImage(this.id);
    },
    editImage(){
      this.$parent.$parent.openEditDialog(this.id);
    },
    openFeaturedAddDialog(){
      this.$parent.$parent.imgSrc = this.imgSrc;
      this.$parent.$parent.openEditFeaturedEventDialog();
    },
    selectedImage( item ){
      this.loading = true;
      if( item.selected == true ){
        this.$parent.$parent.selected.push(item);

      }else{
        this.$parent.$parent.selected.forEach( ( x, index ) => {
          if( x._id == item._id ){
            this.$parent.$parent.selected.splice( index, 1 );
          }
        });

      }

      this.loading = false;


    },
    errorHandler(){
      console.log(this.errImgPath);
      this.image = this.errImgPath;
      this.$forceUpdate()
    },
    getMonth( month ){

      let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months[ parseInt(month -1) ];
    }
  },
};
</script>

<style scoped>
  .v-card__subtitle, .v-card__text{
    line-height: 1rem !important;
  }
  .img-label{
    line-height: 1rem;
    font-size : 12px !important;
    color: rgba(0, 0, 0, 0.75) !important;
  }
  .justifyText {
    text-align: left !important;
    hyphens: auto !important;
  }
</style>
