<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card color="#F5F5F5">
      <v-card-title class="pa-0">
        <v-toolbar dark color="secondary">

          <v-icon>
            mdi-newspaper-variant-outline
          </v-icon>

          <v-spacer class="hidden-md-and-up" />

          <v-spacer class="hidden-sm-and-down" />

          <v-spacer class="hidden-md-and-up" />

          <v-btn icon dark @click="dialog = false" :class="$vuetify.breakpoint.mdAndUp ? 'ml-15' : ''">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center>
            <v-flex xs12 md4 v-if="false">
              <v-card flat style="margin-top: 15rem">
                <v-card-text class="text-center">
                  <v-icon size="80" class="mb-2">mdi-newspaper-variant-outline</v-icon>
                  <h1 class="mb-5">Cargando</h1>
                  <v-progress-linear
                    color="primary"
                    indeterminate
                    rounded
                    height="6"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 md8 v-if="true">
              <v-card outlined>
                <v-card-title>{{ title }}</v-card-title>
                <div class="subtitle-2 ml-5"> {{ subTitle }} </div>

                <v-card-text :style="'max-height: 82vh; overflow-y: scroll; font-size:' + fontSize + 'px'" v-html="content"></v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs12 md4 v-if="true">
              <v-card outlined>
                <v-card-text>
                  <div class="mr-5 ml-5">
                    <v-img :src="imgPath + icon " :lazy-src="imgPath + icon" contain height="80"/>
                  </div>

                  <v-divider class="ma-3"></v-divider>
                  <label>Información</label><br />

                  <ContentCardList
                    type="notes"
                    :id="idMegamedia != undefined ? idMegamedia : id"
                    :date="publishDate != undefined ? new Date(publishDate).toISOString().substring(0,10) : ''"
                    :section="section != undefined ? section : ''"
                    :taked="taked != undefined ? taked : ''"
                    :agency="agency != undefined ? agency : ''"
                    :page="page != undefined ? page : ''"
                    :material="material != undefined ? material : ''"
                    :published="published != undefined ? published == true ? 'Sí' : 'No' : ''"
                    :selleable="selleable != undefined ? selleable == true ? 'Sí' : 'No' : ''"
                  />

                  <v-divider class="ma-3"></v-divider>

                  <label>Observaciones</label><br />
                  <v-card-text>
                    <span v-if="observations == null">Sin observaciones</span>
                    <span v-else>{{ observations }}</span>
                  </v-card-text>

                  <v-divider class="ma-3"></v-divider>
                  <label>PDFs relacionados</label><br />

                  <v-container grid-list-xl>
                    <v-layout row wrap>
                      <v-flex
                        xs6
                        v-for="(item, index) in relatedPDFs"
                        v-bind:key="index"
                      >
                        <v-card ripple @click="$refs.pdfDialog.openDialog(item)">
                          <v-img :src="imgPath + item.imageSrc"></v-img>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>

            <!-- <PDF-Related-Dialog ref="pdfDialog"/> -->
          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>


  </v-dialog>
</template>

<script>
  import ContentCardList from '~/components/editor/ContentCardList';
export default {
  components : {
    ContentCardList
  },
  data: () => ({
    imgPath: process.env.imgPath,
    dialog: false,
    loading: false,


    // id: null,
    // _Id: null,
    // title: null,
    // content: null,
    // publishDate: null,
    // section: null,
    // taked: null,
    // agency: null,
    // page: null,
    // material: null,
    // published: "Sí",
    // selleable: "No",
    // icon: null,
    // subTitleN : null,



  }),
  methods: {
    async openDialog(note, mode, index, searchType) {
      // this._Id = note._id;
      this.dialog = true;
    },


    getPlainText( text ){

      let plainText = text.split(/(\s+)/)
      let diccionario = [/\\n/g, "<",">","<b>", "@", "�", /■/gi, "[", "]", "^", /-/gi, /—/gi, "±", "«", "..", "*", "|", /™/gi, /_/gi]

      for(let i = 0; i < plainText.length; i++){
        for( let j = 0; j < diccionario.length; j++){
          plainText[i] = plainText[i].replace(diccionario[j], "");
          if(plainText[i].trim() == '' && plainText[i].length > 1){
            plainText.splice(i, 1);
          }
        }
      }
      // this.content = tempContent;
      return plainText.join("");
    }
  },
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    id: {
      type: String
    },
    idMegamedia: {
      
    },
    publishDate: {
      type: String
    },
    section: {
      type: String
    },
    taked: {
      type: String
    },
    agency: {
      type: String
    },
    page: {
      type: Number
    },
    material: {
      type: String
    },
    published: {
      type: Boolean
    },
    selleable: {
      type: Boolean
    },
    relatedPDFs: {
      type: Array
    },
    icon: {
      type: String
    },

    fontSize: {
      type: String
    },
    subTitle : {
      type : String
    },
    observations : {
      type : String
    }
  },
};
</script>

<style scope>
  .v-card__title {
    line-height: 1.5rem !important;
    word-break: inherit !important;
  }
</style>

