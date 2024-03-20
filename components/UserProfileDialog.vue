<template>
  <v-dialog v-model="dialog" :max-width=" msgDialog ? 300 : mode ? 400 : 500">
    <v-expand-x-transition v-if="!msgDialog">
      <v-card class="rounded-xl">
        <v-card-title class="justify-center">
          Información del usuario
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="justify-center">

          <v-container fill-height fluid>
            <v-layout row wrap align="center" justify="center">
              <v-flex >
                <v-row justify="center">
                  <v-avatar
                    class="justify-center mr-3"
                    color="#272727"
                    size="170"
                    ico
                  >
                    <v-img
                      v-if="imgB64 != undefined && imgB64 != null && blobFile != null && blobFile != undefined "
                      :src="blobFile"
                    ></v-img>
                    <v-icon v-else color="white" size="150">mdi-account</v-icon>
                  </v-avatar>
                </v-row>

              </v-flex>

              <v-flex v-if="!mode">
                <v-card flat>
                  <v-card-text>

                    <v-list dense>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title style="font-size: 20px; font-weight: 400;" class="font-weight-medium"
                            > {{ name }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title style="font-size: 16px; font-weight: 400;" class="font-weight-light"
                            > {{ email }}</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title style="font-size: 16px; font-weight: 400;"
                            ><label class="font-weight-regular">Función:</label > <label class="font-italic textoColor"> {{ job }} </label></v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title style="font-size: 16px; font-weight: 400;"
                            ><label class="font-weight-regular">Teléfono:</label > <label class="font-italic textoColor"> {{ phone }} </label></v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title style="font-size: 16px; font-weight: 400;"
                            ><label class="font-weight-regular">Trabajador:</label > <label class="font-italic textoColor"> {{ isExtern ? 'Externo' : 'Interno' }} </label></v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item class="list" style="min-height: 25px">
                        <v-list-item-content style="padding: 2px 0">
                          <v-list-item-title>
                            <v-spacer/><v-btn class="primary mt-2" @click="mode = true">Editar</v-btn>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                    </v-list>
                  </v-card-text>
                </v-card>
              </v-flex>

            </v-layout>
          </v-container>

          <v-form ref="form" v-if="mode">
            <v-text-field
              label="Nombre"
              outlined
              dense
              v-model="name"
              :rules="validations.fieldRules"
              hide-details
              :disabled="true"
              class="mb-4 mt-4"
            ></v-text-field>

            <v-text-field
              label="Teléfono"
              outlined
              dense
              v-model="phone"
              :rules="validations.fieldRules"
              hide-details
              class="mb-4"
            ></v-text-field>

            <v-text-field
              label="Correo"
              disabled
              outlined
              dense
              v-model="email"
              :rules="validations.fieldRules"
              hide-details
              class="mb-4"
            ></v-text-field>

            <v-text-field
              label="Función"
              disabled
              outlined
              dense
              v-model="job2"
              :rules="validations.fieldRules"
              hide-details
              class="mb-4"
            ></v-text-field>

            <v-text-field
              label="Trabajador"
              v-model="isExtern2"
              :rules="validations.fieldRules"
              disabled
              outlined
              dense
              hide-details
              class="mb-4"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              hide-details
              class="mb-4"
              v-model="password"
              label="Contraseña"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (showPass = !showPass)"
              :type="!showPass ? 'password' : 'text'"
            ></v-text-field>

            <v-text-field
              outlined
              dense
              hide-details
              class="mb-4"
              v-if=" password != null && password.trim() != ''"
              v-model="confirmPassword"
              label="Confirmar contraseña"
              :rules="[(confirmPassword === password) || 'La contraseña no coincide']"
              :append-icon="showConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="() => (showConfirmPass = !showConfirmPass)"
              :type="!showConfirmPass ? 'password' : 'text'"
            ></v-text-field>

            <v-file-input
              :rules="file == null || file == undefined ? validations.notRules : validations.imageRules"
              v-model="file"
              outlined
              label="Ingrese una imagen"
            >
            </v-file-input>
          </v-form>

        </v-card-text>

        <v-card-actions v-if="mode">
          <v-spacer />
          <v-btn
            color="secondary"
            @click="mode = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            class="mr-4"
            color="primary"
            @click="validated()"
          >
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
     </v-expand-x-transition>

     <v-expand-transition v-if="msgDialog">
       <v-card>
         <v-card-text class="text-center">
          <v-icon size="80" class="mb-2 pt-2"
            >mdi-timer-sand</v-icon
          >
          <h1 class="mb-5">Cargando</h1>
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-card-text>
       </v-card>
     </v-expand-transition>
  </v-dialog>
</template>

<script>
  import { mapState, mapMutations } from "vuex";

  export default {
    data(){
      return {
        dialog : false,
        msgDialog : false,
        loading : false,
        mode : false,

        email : null,
        // email2 : null,

        isExtern : null,
        // isExtern2 : null,

        job : null,
        // job2 : null,

        name : null,
        // name2 : null,
        phone : null,
        file : null,
        blobFile : null,
        imgB64 : null,
        showPass: false,
        password: null,
        confirmPassword: null,
        
        allAdminInf : {},

        validations : {
          fieldRules : [ v => ( !!v || 'Campo requerido' ) ],
          imageRules: [
            ( v ) => (!!v && v.type == 'image/png' || !!v && v.type == 'image/jpeg' ) || 'El ícono solo puede ser png, jpg o jpeg',
          ],
          notRules : []
        }

      }
    },
    watch : {
      file( newValue ){
        if(( newValue != null || newValue != undefined ) && newValue.type.search('image') != -1 ){
          this.blobFile = this.getImagePreview(newValue);
          this.imageToBase64( newValue );
        }else{
          this.blobFile = null;
        }
      },
      dialog( newValue ){
        if( !newValue ){
          this.reset();
        }
      }
    },
    computed: mapState(["logged", "snackText", "snackBar", "username", 'img' ]),
    methods : {
      openDialog(){
        this.getUserInfo();
        this.dialog = true;
      },
      getImagePreview( file ){
        return URL.createObjectURL(file);
      },
      async getUserInfo(){
        try {
          //this.loading = true;
          this.msgDialog = true;

          const response = await this.$axios.$get('/adminsById/' + localStorage.user_id, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          console.log(response.data);
          this.allAdminInf = response.data;
          this.email = response.data.email;
          this.email2 = response.data.email;

          this.isExtern = response.data.isExtern;
          this.isExtern2 = response.data.isExtern ? 'Externo' : 'Interno';

          this.job = response.data.job;
          this.job2 = response.data.job;

          this.name = response.data.name;
          this.name2 = response.data.name;
          this.phone = response.data.phone;
          this.blobFile = response.data.img != undefined || response.data.img != null
          ? response.data.img
          : '';
          this.imgB64 = this.blobFile;
          localStorage.setItem("username", this.name);
          localStorage.setItem("img", this.blobFile);
          this.msgDialog = false;
        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      },
      async editUserProfile(){
        try {
          //this.loading = true;
          this.msgDialog = true;

          const body = {
            img : this.imgB64,
            name: this.allAdminInf.name != undefined ? this.allAdminInf.name : null,
            phone : this.phone,
            role : this.allAdminInf.role != undefined ? this.allAdminInf.role : null,
            isActive : true,
            permissions : this.userPermits != undefined ? this.userPermits : [],
            password: this.password,
            confirmPassword: this.confirmPassword
          }
          const response = await this.$axios.$put('/admin/' + localStorage.user_id, body,{
            headers : { Authorization : 'Bearer ' + localStorage.token },

          });

          if( response ){
            this.$store.commit("setUsername", this.name);
            this.$store.commit("setUserimg", this.imgB64);
            this.$store.commit(
              'openSnack',
              'Se ha actualizado los datos exitosamente'
            )
            this.reset();
            this.getUserInfo();
          }

          this.loading = false;
        } catch (error) {
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, vuelva a intentarlo'
          );
          this.loading = false;
          console.log(error)
          console.log(error.response)
        }
      },
      validated(){
        if( this.$refs.form.validate() ){
          this.editUserProfile();
        }
      },
      reset(){
        //this.$refs.form.reset();
        this.imgB64 = null;
        this.file = null;
        this.mode = false;
        this.showPass = false;
      },
      imageToBase64 (file) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.imgB64 = reader.result;
        }
        reader.onerror = function (error) {
          console.log('Error: ', error)
        }
      }
    },
  }
</script>

<style scoped>
  .textoColor{
    color: grey !important;
    cursor: text;
  }
</style>
