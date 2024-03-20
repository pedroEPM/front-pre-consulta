<template>
  <v-dialog max-width="400" v-model="dialog">
    <v-card>
      <v-card-title
        >{{ isAdmin ? 'Agregar Admin' : 'Agregar Usuario'}} <v-spacer /><v-btn icon @click="dialog = false"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-card-text>
        <v-form ref="form"  autocomplete="off">
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
            v-model="repeatPassword"
            label="Confirmar contraseña"
            :disabled="loading"
            :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (showPass2 = !showPass2)"
            :type="!showPass2 ? 'password' : 'text'"
            :rules="[(repeatPassword === password) || 'La contraseña no coincide']"
          ></v-text-field>

          <v-text-field
            v-model="name"
            label="Nombre completo"
            :rules="validations.nameRules"
            :disabled="loading"
          ></v-text-field>

          <v-text-field
            v-model="phone"
            label="Télefono"
            type="number"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-text-field>

          <v-select
            label="Puesto"
            v-model="job"
            :items="jobs"
            item-value="_id"
            item-text="position"
            :disabled="loading"
            :rules="validations.fieldRules"
          ></v-select>

          <v-select
            v-if="!isAdmin"
            v-model="group"
            label="Departamento"
            :items="groups"
            item-text="name"
            item-value="_id"
            :disabled="loading"
            :rules="validations.fieldRules"
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
  data: () => ({
    loading: false,
    dialog: false,
    groups: [],
    isExtern: false,
    email: null,
    name: null,
    phone: null,
    job: null,
    group: null,
    password: null,
    repeatPassword: null,
    jobs: [],
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
    showPass2 : false,
  }),
  props : {
    isAdmin : {
      type : Boolean,
      default : false
    }
  },
  methods: {
    openDialog() {
      this.dialog = !this.dialog;
      this.getPositions();
      this.getGroups();
    },
    async getGroups() {
      const response = await this.$axios.$get("/groups", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      console.log(response);
      this.groups = response.data;
    },
    async addUser() {
      this.loading = true;
      const endPoint = this.isAdmin ? '/admins' : "/admins/users";
      try {
        const response = await this.$axios.$post(
          endPoint,
          {
            email: this.email,
            name: this.name,
            job: this.job,
            role: this.job,
            phone: this.phone,
            group: this.group,
            password: this.password,
            isExtern: this.isExtern,
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        console.log('This is the response of useradd')
        console.log(response);
        if(response && !this.isAdmin ){
          let id = response.message._id;
          console.log('/admins/users/'+ id +'/activate')
          try{
            const response2 = await this.$axios.$patch('/admins/users/'+ id +'/activate',{},{
              headers : { Authorization : 'Bearer ' + localStorage.token }
            });
            const response3 = await this.$axios.patch("/users/" + id + "/permissions",
              {
                permissions: [
                      "60d47ee00f82f40014419ae5",
                      "60d47eec0f82f40014419ae6",
                      "60d47ef70f82f40014419ae7",
                      "60d47f290f82f40014419ae8",
                      "60d47f460f82f40014419ae9",
                      "60d483fe0f82f40014419aeb",
                      "60d48ee60f82f40014419aec"
                  ]
              },
              {
                headers: { Authorization: "Bearer " + localStorage.token },
              }
            )
            this.actualizartabla();
            this.cleanAndclose();
          }catch(e){
            console.log('no pudo activar')
          }
        }
        if (response  && this.isAdmin) {
          this.$store.commit(
            "openSnack",
            "El usuario se ha registrado exitosamente, se enviará un correo con los datos de acceso"
          );
          this.$parent.getUsers();
          this.loading = false;
          this.cleanAndclose();
        } else {
          this.loading = false;
          this.$store.commit(
          "openSnack",
          "El usuario se ha registrado exitosamente, favor de verificar los permisos del usuario"
          );
        }
        this.actualizartabla();
        this.cleanAndclose();
      } catch (error) {
        console.log(error)
        console.log('error al registrar')
       //this.$store.commit(
       //  "openSnack",
       //  "Ha ocurrido un error, por favor intente de nuevo"
       //);
        this.loading = false;
        return;
      }
    },
    actualizartabla(){
      console.log('debe actualizar')
      this.$emit('actualizartabla')
    },
    cleanAndclose() {
      this.isExtern = false;
      this.email = null;
      this.name = null;
      this.phone = null;
      this.job = null;
      this.group = null;
      this.password = null;

      this.dialog = false;
      this.loading = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.addUser();
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
