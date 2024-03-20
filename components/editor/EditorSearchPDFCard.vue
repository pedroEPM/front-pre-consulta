<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card
        ripple
        :color=" hover ? '#BFCFED' : 'grey lighten-3'"
        class="card-hover"
        style="cursor: pointer"
        @click="editPDF()"
      >
        <v-img max-width="270" max-height="440" :src="image" @error="errorHandler" :lazy-src="image">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-text class="text-center img-label">
          <v-img
            :src="icon"
            :lazy-src="icon"
            height="20"
            contain
            style="margin: auto !important"
            v-if="icon != null"
          ></v-img>
          <span><b>Fecha:</b> {{ date != undefined ? date.substring(8, 10) + '-' + getMonth(date.substring(5, 7)) + '-' + date.substring(0, 4) : date }}</span>
          <div v-if="notebookName != null">
            <span class="img-label"><b>Sección:</b> </span>
            {{ notebookName }}
          </div>
            <div v-if="item.page != null">
            <span class="img-label"><b>Página:</b> </span>
            {{ item.page }}
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
              v-if="seleccionatodo === false || seleccionatodo === true"
            ></v-checkbox>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn rounded v-bind="attrs" v-on="on"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item @click="editPDF()">
                  <v-list-item-title>
                    Editar
                    <v-icon right>mdi-pencil</v-icon>
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="deletePDF()">
                  <v-list-item-title>
                    Eliminar
                    <v-icon right>mdi-delete</v-icon>
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
        <v-card-text>Agregando a los PDFS seleccionados</v-card-text>
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
    title: {
      type: String,
    },
    notebookName: {
      type: String,
    },
    icon: {
      type: String,
    },
    seleccionatodo: {
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
    }
  },
  data: () => ({
    check: false,
    loading : false,
    errImgPath : process.env.errImgPath
  }),
  methods: {
    async deletePDF() {
      this.$parent.$parent.deletePDF(this.id);
    },
    editPDF() {
      console.log('');
      this.$parent.$parent.openEditDialog(this.id);
    },
    selectedImage( item ){
      this.loading = true;
      if( item.selected == true ){
        this.$parent.$parent.selected.push( item );
      }else{
        this.$parent.$parent.selected.forEach( ( x , index ) => {
          if(x._id == item._id){
            this.$parent.$parent.selected.splice( index, 1);
          }
        });
      }
      console.log(this.$parent.$parent.selected)
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

<style>
</style>
