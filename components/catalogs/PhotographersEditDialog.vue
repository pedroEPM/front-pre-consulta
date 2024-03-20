<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card>
      <v-toolbar elevation="0">
        <v-card-title>Editar fotógrafo</v-card-title>

        <v-spacer /><v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">

          <v-text-field
            label="Nombre"
            v-model="photographerName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-text-field
            label="Apellido"
            v-model="photographerLName"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-select
            label="Estado"
            item-text="name"
            item-value="value"
            :items="photographerStatus"
            v-model="photographerState"
            :disabled="loading"
            :rules="photographerState != false ? validations.fieldRules : validations.noRules"
          ></v-select>

          <v-text-field
           label="Correo"
           v-model="photographerEmail"
           :disabled="loading || enabledItems"
           :rules="enabledItems == true ? validations.noRules : validations.fieldRules"
           type="email"
          ></v-text-field>

          <v-text-field
            label="Teléfono"
            v-model="photographerPhone"
            :disabled="loading || enabledItems"
            :rules="enabledItems == true ? validations.noRules : validations.fieldRules"
            type="tel"
          ></v-text-field>

        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer />
        <v-btn color="primary" @click="validate()"> Agregar</v-btn>
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
      enabledItems : false,
      id : null,
      photographerName: null,
      photographerLName: null,
      photographerEmail: null,
      photographerPhone: null,
      photographerState : null,
      photographerStatus : [
        { name: 'Activo', value: true},
        { name: 'Inactivo', value: false}
      ],
      validations: {
        fieldRules : [(v) => !!v || "Campo requerido"],
        noRules : []
      },
    }
  },
  watch : {
    photographerState( newValue, oldValue){
      if(newValue != true){
        this.enabledItems = true;
        this.photographerEmail = 'N/A';
        this.photographerPhone = 'N/A';
      }else{
        this.enabledItems = false;
        this.photographerEmail = this.photographerEmail !== 'N/A' && this.photographerEmail !== null ? photographerEmail : null;
        this.photographerPhone = this.photographerPhone !== 'N/A' && this.photographerPhone !== null ? photographerPhone : null;
      }
    }
  },
  methods : {
    openDialog( item ){
      this.dialog = true;
      this.photographerName = item.name;
      this.photographerLName = item.lname;
      this.photographerEmail = item.email;
      this.photographerPhone = item.phone;
      this.photographerState = item.status;
      this.id = item._id;
    },
    async updatePhotographer() {
      this.loading = true;
      let formData = new FormData();
      const body = {
        name : this.photographerName,
        lname : this.photographerLName,
        status : this.photographerState,
        email : this.photographerEmail,
        phone : this.photographerPhone,
        _id : this.id
      }
      formData.append('body', JSON.stringify(body));
      try {
        const response = await this.$axios.$put('/Photographer', formData, {
          headers : { Authorization :  'Bearer ' + localStorage.token }
        });
        if(response){
          this.$parent.$parent.getPhotographers();
          this.$store.commit(
            'openSnack',
            'El fotógrafo ha sido actualizado exitosamente'
          );
        }
        this.cleanAndCode();
      } catch (error) {
        console.log(error)
        this.loading = false;
        this.$store.commit(
          'openSnack',
          'Ha ocurrido un error, por favor intente de nuevo'
        );
        return;
      }
      this.loading = false;
    },
    cleanAndCode(){
      this.photographerName = '';
      this.photographerLName = '';
      this.photographerEmail = '';
      this.photographerPhone = '';
      this.photographerState = '';

      this.dialog = false;
    },
    validate(){
      if(this.$refs.form.validate()) {
        this.updatePhotographer();
      }
    },
  }
}
</script>

<style>

</style>
