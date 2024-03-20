<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-card-title
        >{{ isAdmin ? 'Editar administrador' : 'Editar Usuario' }} <v-spacer /><v-btn icon @click="dialog = !dialog"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <v-form ref="form" autocomplete="off">
          <v-text-field
            v-model="email"
            label="Correo electronico"
            :rules="validations.emailRules"
            :disabled="loading"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Contraseña"
            :disabled="loading"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showPass = !showPass)"
            :type="!showPass ? 'password' : 'text'"
          ></v-text-field>

          <v-text-field
            v-if=" password != null && password.trim() != ''"
            v-model="confirmPassword"
            label="Confirmar contraseña"
            :disabled="loading"
            :rules="[(confirmPassword === password) || 'La contraseña no coincide']"
            :append-icon="showConfirmPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showConfirmPass = !showConfirmPass)"
            :type="!showConfirmPass ? 'password' : 'text'"
          ></v-text-field>

          <v-text-field
            v-model="name"
            label="Nombre completo"
            :rules="validations.nameRules"
            :disabled="isAdmin"
          ></v-text-field>

          <v-text-field
            v-model="phone"
            label="Télefono"
            type="number"
            :disabled="loading"
          ></v-text-field>

          <v-select
            label="Puesto"
            v-model="job"
            :items="jobs"
            item-value="_id"
            item-text="position"
            :disabled="loading"
          ></v-select>

          <v-select
            v-model="group"
            label="Departamento"
            :items="groups"
            item-text="name"
            item-value="_id"
            :disabled="loading"
          ></v-select>

          <v-select
            v-model="isActive"
            label="Estado del usuario"
            :items="status"
            item-text="name"
            item-value="value"
            :disabled="loading"
          ></v-select>

          <v-checkbox
            v-if="!isAdmin"
            v-model="isExtern"
            label="¿Es un usuario externo?"
            :disabled="loading"
          ></v-checkbox>

        </v-form>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="validate()">Actualizar</v-btn>
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
  data: () => ({
    dialog: false,
    loading: false,
    groups: [],
    isExtern: false,
    email: null,
    name: null,
    phone: null,
    job: null,
    group: null,
    password: null,
    confirmPassword : null,
    id: null,
    img : null,
    adminAllInf : {},
    jobs: [],
    status: [
      { name : 'Activo', value : true },
      { name : 'Inactivo', value : false },
    ],
    isActive : false,
    validations: {
      nameRules: [
        (v) => !!v || "Campo requerido",
        (v) => (v && v.length <= 30) || "No puede ser mayor de 30 caracteres",
      ],
      emailRules: [
        (v) => !!v || "Campo requerido",
        (v) => /.+@.+\..+/.test(v) || "Ingrese un email válido",
      ],
      fieldRules: [(v) => !!v || "Campo requerido"],
    },
    showPass : false,
    showConfirmPass : false,
  }),
  props : {
    isAdmin : {
      type : Boolean,
      default : false,
    }
  },
  methods: {
    openDialog(item) {
      this.dialog = !this.dialog;
      this.getGroups();
      this.getPositions();

      if( this.isAdmin ){
        this.id = item._id;
        this.getAdmin();
      }else{
        this.email = item.email;
        this.img = item.img;
        this.name = item.name;
        this.phone = item.phone;
        this.job = item.job;
        this.group = item.group;
        this.id = item._id;
        this.isExtern = item.isExtern;
        this.isActive = item.activate;
      }
    },
    async getAdmin(){
      try {

        const response = await this.$axios.$get('/adminsById/' + this.id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        console.log(response.data);

        this.adminAllInf = response.data;

        this.email = response.data.email;
        this.name = response.data.name;
        this.phone = response.data.phone;
        this.job = response.data.role;
        this.group = response.data.group;
        // this.isExtern = item.isExtern;
        this.isActive = response.data.activate;
        this.img = response.data.img;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async getGroups() {
      const response = await this.$axios.$get("/groups", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      console.log(response);
      this.groups = response.data;
    },
    async updateUser() {
      this.loading = true;
      const endPoint = this.isAdmin ? '/admin/' : '/users/'
      try {
        const response = await this.$axios.$put(endPoint + this.id, {
          email: this.adminAllInf.email,
          name: this.isAdmin ? this.adminAllInf.name : this.name,
          job: this.job,
          phone: this.phone,
          group: this.group,
          password: this.password != null && this.password.trim() != '' ? this.password : null,
          confirmPassword :  this.password != null && this.password.trim() != '' ? this.confirmPassword : null,
          isExtern: this.isExtern,
          isActive : this.isActive,
          img : this.img,

          permissions : this.adminAllInf.permissions != undefined ? this.adminAllInf.permissions : [],
          role : this.job,
          activat : this.isActive,
        },
        {
          headers : { Authorization : 'Berarer ' + localStorage.token }
        });

        if( response ){
          this.reset();
          this.$parent.getUsers();
          this.$store.commit(
            'openSnack',
            'Se ha actualizado correctamente'
          );
        }

      } catch (error) {
        console.log(error.response)
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        this.loading = false
        return;
      }
    },
    reset(){
      this.$refs.form.reset();
      this.id = null;
      this.dialog = false;
      this.loading = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.updateUser();
      }
    },
    async getPositions(){
      const response = await this.$axios.$get('/position', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });

      this.jobs = response.data;
    }
  },
};
</script>

<style>
</style>
