<template>
  <v-dialog max-width="400" v-model="dialog">
      <v-card>
          <v-toolbar elevation="0">
              <v-toolbar-title>Agregar permiso</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="dialog = true">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar>
          <v-card-text>
              <v-form ref="form">
                  <v-text-field
                    label="Permiso"
                    v-model="name"
                    :disabled="loading"
                    :rules="validations.fieldRules"
                  ></v-text-field>
              </v-form>
          </v-card-text>
          <v-card-actions v-if="!loading">
              <v-spacer />
              <v-btn color="primary" @click="validate()">Agregar</v-btn>
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
        data(){
            return {
                dialog : false,
                loading : false,
                name : null,
                validations : {
                    fieldRules : [ v => !!v || 'Campo requerido']
                }
            }
        },
        methods : {
            openDialog(){
                this.dialog = true;
            },
            validate(){
                if( this.$refs.form.validate()){
                    this.addPermission();
                }
            },
            async addPermission(){
                try {
                    this.loading = true;
                    const body = {
                        name : this.name
                    }
                    const response = await this.$axios.$post('/permissions', body,{
                        headers : { Authorization : 'Bearer ' + localStorage.token }
                    });

                    if( response ){
                        this.reset();
                        this.$store.commit(
                            'openSnack',
                            'El permiso se ha agregado correctamente'
                        )
                    }
                } catch (error) {
                    console.log(error.response);
                    this.loading = false;
                    this.$store.commit(
                        'openSnack',
                        'Ha ocurrido un error, vuelva a intentarlo'
                    )
                }
            },
            reset(){
                this.$refs.form.reset();
                this.dialog = false;
                this.loading = false;
                this.$parent.$parent.getPermissions();
            }
        }
    }
</script>

<style>

</style>