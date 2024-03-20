<template>
  <v-dialog
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
    style="overflow-y: visible"
    v-model="dialog"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <!-- <v-icon> mdi-help </v-icon> -->
          <v-spacer />
          <v-toolbar-title> Visualizador de {{ titulo }} </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <!-- <v-card-text> -->
      <v-card-text>
        <v-container grid-list-xl v-if="show">
          <v-layout row wrap>
            <v-flex v-if="publications">
              <v-select
                label="Publicación"
                placeholder="Seleccione una opción"
                outlined
                dense
                item-text="publicationName"
                item-value="_id"
                :items="publicationsData"
                hide-details
                v-model="publicationRef"
              ></v-select>
            </v-flex>
            <v-flex v-if="type">
              <v-select
                label="Tipo"
                placeholder="Seleccione una opción"
                outlined
                dense
                item-text="text"
                item-value="value"
                :items="types"
                hide-details
                v-model="typeData"
              ></v-select>
            </v-flex>

            <v-flex v-if="state">
              <v-select
                label="Estado"
                placeholder="Seleccione una opción"
                outlined
                dense
                item-text="text"
                item-value="value"
                :items="states"
                hide-details
                v-model="stateData"
              ></v-select>
            </v-flex>
            <v-flex xs12 md2>
              <v-btn
                block
                color="primary"
                @click="search()"
                :disabled="disabled"
              >Filtrar</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <v-data-table
                :headers="headers"
                :items="allItems2.length > 0 ? allItems2 : allItems"
                :items-per-page="99999"
              >
                <template v-if="icon" v-slot:[`item.icon`]="{ item }">
                  <v-img
                    :src="imgPath + item.icon"
                    :lazy-src="imgPath + item.icon"
                    height="50"
                    width="100"
                    contain
                  ></v-img>
                </template>
                <template v-if="state" v-slot:[`item.status`]="{ item }">
                  <label v-if="item.status == undefined "> Desconocido </label>
                  <label v-if="item.status == true ">Activo</label>
                  <label v-if="item.status == false ">Inactivo </label>
                </template>
                <template v-if="state" v-slot:[`item.type`]="{ item }">
                  <label v-if="item.type == undefined "> Desconocido </label>
                  <label v-else>{{ item.type }}</label>

                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>
    <v-dialog v-model="dialog2" max-width="400">
      <v-card>
        <v-card-title>Advertencia</v-card-title>
        <v-card-text>No se encontraron datos con los filtros</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog2 = false" class="primary">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    data(){
      return {
        imgPath: process.env.imgPath,
        show : false,
        dialog : false,
        publicationsData : [],
        types : [
          { text : 'Desconocido', value : undefined},
          { text : 'Sección', value : 'Sección'},
          { text : 'Suplemento', value : 'Suplemento'}
        ],
        states : [
          { text : 'Desconocido', value : undefined },
          { text : 'Activo', value : true },
          { text : 'Inactivo', value : false },
        ],

        publicationRef : null,
        typeData : null,
        stateData : null,

        disabled : true,
        allItems2 : [],
        dialog2 : false,
      }
    },
    watch : {
      publicationRef( newvalue ){
        if( newvalue != null){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
      },
      stateData( newvalue ){
        if( newvalue != null){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
      },
      typeData( newvalue ){
        if( newvalue != null){
          this.disabled = false;
        }else{
          this.disabled = true;
        }
      },

    },
    methods : {
      openDialog(){
        if(this.publications == false && this.type == false && this.state == false){
          this.show = false;
        }else{
          this.show = true;
        }
        this.allItems2 = [];
        this.publicationRef = null;
        this.typeData = undefined;
        this.stateData = undefined;
        this.getPublications();
        this.dialog = true;
      },
      async getPublications(){
        const response = await this.$axios.$get('/Publications', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.publicationsData = response.data.publicaciones;
      },
      search(){
        this.allItems2 = [];
        this.disabled = true;
        this.allItems.forEach( x => {
          // console.log(x)
          // console.log( x.status + ' ' + this.stateData)
          if( this.stateData != null && this.typeData == null && this.publicationRef == null){
            if( x.status == undefined && this.stateData == 'Desconocido'){
              this.allItems2.push(x);
            }
            if( x.status == this.stateData ){
              this.allItems2.push(x);
            }
          }
          if( this.stateData == null && this.typeData != null && this.publicationRef == null){
            if( x.type == undefined && this.typeData == 'Desconocido'){
              this.allItems2.push(x);
            }
            if( x.type == this.typeData ){
              this.allItems2.push(x);
            }
          }
          if( this.stateData == null && this.typeData == null && this.publicationRef != null){
            if( x.PublicationReference ){
              if( x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
            }
          }

          if( this.stateData != null && this.typeData != null && this.publicationRef == null){
            if( x.status == undefined && this.stateData == 'Desconocido' && x.type == undefined && this.typeData == 'Desconocido'){
              this.allItems2.push(x);
            }
            if( x.status == this.stateData && x.type == this.typeData ){
              this.allItems2.push(x);
            }
            if( x.status == undefined && this.stateData == 'Desconocido' && x.type == this.typeData ){
              this.allItems2.push(x);
            }
            if( x.status == this.stateData && x.type == undefined  && this.typeData == 'Desconocido' ){
              this.allItems2.push(x);
            }
          }

          if( this.stateData != null && this.typeData != null && this.publicationRef != null){
            if( x.PublicationReference ){
              if( x.status == undefined && this.stateData == 'Desconocido' && x.type == undefined && this.typeData == 'Desconocido' && x.PublicationReference._id == this.publicationRef){
                this.allItems2.push(x);
              }
              if( x.status == this.stateData && x.type == this.typeData && x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
              if( x.status == undefined && this.stateData == 'Desconocido' && x.type == this.typeData && x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
              if( x.status == this.stateData && x.type == undefined  && this.typeData == 'Desconocido' && x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
            }
          }

          if( this.stateData != null && this.typeData == null && this.publicationRef != null){
            if( x.PublicationReference ){
              if( x.status == undefined && this.stateData == 'Desconocido' && x.PublicationReference._id == this.publicationRef){
                this.allItems2.push(x);
              }
              if( x.status == this.stateData && x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
            }
          }

          if( this.stateData == null && this.typeData != null && this.publicationRef != null){
            if( x.PublicationReference ){
              if( x.type == undefined && this.typeData == 'Desconocido' && x.PublicationReference._id == this.publicationRef){
                this.allItems2.push(x);
              }
              if( x.type == this.typeData && x.PublicationReference._id == this.publicationRef ){
                this.allItems2.push(x);
              }
            }
          }

        });
        this.allItems2.length == 0 ? this.dialog2 = true : this.dialog2 = false;
        this.disabled = false;
      }
    },
    props : {
      headers : {
        required : true,
      },
      allItems : {
        required : true,
      },
      titulo : {
        type : String,
        required : true
      },
      icon : {
        type : Boolean,
        default : false,
      },
      publications : {
        type : Boolean,
        default : false
      },
      type : {
        type : Boolean,
        default : false,
      },
      state : {
        type : Boolean,
        default : false,
      },
    },
  }
</script>

<style scoped>

</style>
