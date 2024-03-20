<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-icon> mdi-pencil </v-icon>
          <v-spacer />
          <v-toolbar-title>Editar {{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card
                outlined
                class="scroll"
                style="overflow-y:auto"
              >
                <v-card-text>
                  <v-form ref="form">
                    <editor
                      v-if="showEditor"
                      :api-key="'zlsfl8mrv98mfeg0jmyckhx3pwagf392svpd77b0n999imuh'"
                      :init="{
                        height: 600,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link anchor fullscreen insertdatetime paste code table wordcount',
                        ],
                        toolbar:
                          'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | link | code | fullscreen | table tabledelete | \
                          tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | \
                          tableinsertcolbefore tableinsertcolafter tabledeletecol',
                      }"
                      v-model="content"
                    />
                  </v-form>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-row wrap justify="end">
          <v-btn @click="askDialog = true" color="primary">Guardar</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="loading" max-width="300" persistent>
      <v-card>
        <v-card-title>Cargando...</v-card-title>
        <v-card-text>Estamos actualizando {{ title }}</v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="askDialog" max-width="500">
      <v-card>
        <v-card-title>¿Actualizar {{ title }}?</v-card-title>
        <v-card-text>¿Esta seguro de actualizar {{ title }}?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="askDialog = false">Cancelar</v-btn>
          <v-btn class="primary" @click="editTAPuse()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'

  export default {
    components:{
      Editor
    },
    data(){
      return {
        dialog : false,
        loading : false,
        askDialog : false,
        content : null,
        showEditor : false,

        id : null,
      }
    },
    props : {
      title : {
        type : String,
        required: true
      },
      isTerms : {
        type : Boolean,
        default: false
      }
    },
    watch : {
      dialog( newValue ){
        if( !newValue ){
          this.showEditor = false;
        }
      }
    },
    methods : {
      openDialog( item ){
        this.dialog = true;
        this.id = item._id;
        this.content = item.content;
        setTimeout(() => {
          this.showEditor = true;
        }, 1);
      },
      async editTAPuse(){
        try {
          this.askDialog = false;
          this.loading = true;
          const body = {
            title : this.title,
            content : this.content,
            _id : this.id
          }
          const response = await this.$axios.$put('/TAPuses', body, {
            headers : {Authorization: 'Berar ' + localStorage.token }
          });

          if( response ){
            await this.$parent.getTAPuses();
            this.loading = false;
            this.dialog = false;
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    }
  }
</script>

<style>

</style>
