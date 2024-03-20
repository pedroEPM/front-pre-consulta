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
                <v-icon>mdi-file</v-icon>
                <v-spacer />
                <v-toolbar-title>
                    <h5>{{ pdfTitle.substring(0, 25) }}...</h5>
                </v-toolbar-title>
                <v-spacer />
                <v-btn
                    icon
                    dark
                    @click="dialog = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card-title>
        <v-card-text v-if="isError">
          <v-img class="  mt-5" :src="errImgPath" :lazy-src="errImgPath"></v-img>
        </v-card-text>
        <v-card-text v-if="!isError">
            <client-only>
                <vue-pdf-app :pdf="showPDFSrc" :config="config" ></vue-pdf-app>
            </client-only>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
        data(){
            return {
                imgPath: process.env.imgPath,
                errImgPath : process.env.errorImagePath,
                isError : false,
                dialog : false,
                showPDFSrc : null,
                 config: {
                    toolbar: {
                    toolbarViewerLeft: {
                        previous: false
                    }
                    }
                },

                // disable whole page navigation panel
                config2: {
                    toolbar: {
                    toolbarViewerLeft: false
                    }
                },

                // disable whole panel
                config3: {
                    toolbar: false
                }
            }
        },
        watch : {
            dialog( newValue ){
                if( newValue == false ){
                    this.showPDFSrc = null;
                }
            }
        },
        props : {
            pdfSrc : {
                type : String,
                require : true,
            },
            pdfTitle : {
                type : String,
            },
            mode : {
                type : Boolean,
                default : true,
            }
        },
        methods : {
            openDialog(){
                console.log(this.pdfSrc);
                try {
                  if(this.mode){
                    this.showPDFSrc = this.imgPath + this.pdfSrc.substring(0, this.pdfSrc.length - 3) + 'pdf';
                    console.log(this.showPDFSrc);
                  }else{
                    //console.log(this.pdfSrc);
                    this.showPDFSrc = this.pdfSrc;
                  }
                  this.dialog = true;
                } catch (error) {
                  this.dialog = true;
                  this.isError = true;
                }
            },
            openHandler(pdfApp) {
            window._pdfApp = pdfApp;
            },
        }
    }
</script>

<style scoped>

</style>
