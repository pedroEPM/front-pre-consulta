<template>
  <v-dialog
  fullscreen
  hide-overlay
  transition="dialog-bottom-transition"
  scrollable
  v-model="dialog"
  >
    <v-card>

      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-icon> mdi-file-document-edit-outline </v-icon>
          <v-spacer />
          <v-toolbar-title>Agregar solicitud</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-card outlined class="pa-5">
                <label>Datos de la persona</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="userForm">

                  <v-text-field
                   :rules="validations.fieldRules"
                    outlined
                    dense
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    append-icon="mdi-account"
                    class="custom-field"
                    v-model="name"
                  ></v-text-field>

                     <!-- <v-select
                    :items="positions"
                    label="Puesto"
                    placeholder="Seleccione el puesto"
                    item-text="position"
                    item-value="_id"
                    outlined
                    dense
                    class="custom-field"
                    v-model="position"
                    :rules="validations.fieldRules"
                  ></v-select> -->
                  
                  <v-text-field
                    outlined
                    dense
                    label="Puesto"
                    placeholder="Ingrese el puesto"
                    class="custom-field"
                    v-model="position"

                  ></v-text-field>
                  
                  <v-combobox
                    :items="select1"
                    label="Tipo de archivo solicitado"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    :rules="validations.fieldRules"
                    class="custom-field"
                    v-model="fileType"
                  ></v-combobox>
                  <v-combobox
                    :items="departments"
                    label="Departamento"
                    placeholder="Seleccione un departamento"
                    outlined
                    dense
                    class="custom-field"
                    v-model="address"
                  ></v-combobox>
                  <v-text-field
                    outlined
                    dense
                    label="Número de teléfono o extensión"
                    placeholder="Ingrese su número"
                    append-icon="mdi-phone"
                    class="custom-field"
                    type="tel"
                    v-model="telephone"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Correo electrónico"
                    placeholder="Ingrese su correo electrónico"
                    append-icon="mdi-email"
                    class="custom-field"
                    v-model="email"
                    :rules="validations.fieldRules"
                  ></v-text-field>

                  <v-combobox
                    :items="fileUses"
                    label="Uso que se le dará a los Archivos solicitados"
                    placeholder="Seleccione el uso"
                    outlined
                    dense
                    class="custom-field mb-4"
                    hide-details
                    v-model="fileUse"
                  ></v-combobox>
                  <!--Falta en cuanto tiempo-->
                  <v-combobox
                     :items="tiempoestimadoitem"
                    outlined
                    dense
                    label="Tiempo estimado para recibir la información"
                    placeholder="Ingresa en cuanto tiempo lo necesitas"
                    append-icon="clipboard-text-clock-outline"
                    class="custom-field"
                    v-model="tiempoestimado"
                  ></v-combobox>
                  <v-combobox
                    :items="tipoUsuario"
                    label="Tipo usuario"
                    placeholder="Seleccione el puesto"
                    outlined
                    dense
                    class="custom-field"
                    v-model="kinduser"
                  ></v-combobox>

                </v-form>
              </v-card>
            </v-flex>
            <v-flex xs12 md6>
              <v-card outlined class="pa-5">
                <label>Material a Solicitar</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="dataForm">
                    <v-text-field
                    outlined
                    dense
                    label="Clave de archivo"
                    placeholder="Ingrese la clave"
                    append-icon="mdi-numeric"
                    class="custom-field mb-4"
                    hide-details
                    v-model="id"
                  ></v-text-field>
                   <!---- <v-text-field
                    outlined
                    dense
                    label="Evento"
                    placeholder="Ingrese nombre de la publicación"
                    class="custom-field mb-4"
                    hide-details
                    v-model="evento"
                  ></v-text-field> --->

                   <v-combobox
                    :items="select2"
                    label="Otros recursos informativos"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    class="custom-field mb-4"
                    v-model="use"
                    hide-details
                  ></v-combobox>

                   <v-text-field
                    outlined
                    dense
                    label="Publicación"
                    placeholder="Ingrese nombre de la publicación"
                    class="custom-field mb-4"
                    hide-details
                    v-model="publication"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    dense
                    label="Tema solicitado"
                    placeholder="Ingrese el tema"
                    append-icon="mdi-forum"
                    class="custom-field"
                    v-model="topic"
                    :rules="validations.fieldRules"
                  ></v-text-field>
              <v-combobox
            v-model="dates"
            multiple
            chips
            hide-details
            hide-selected
            label="Fechas y múltiples fechas de publicación"
            placeholder="escribe la fecha y dale enter para agruparlas"
            append-icon="mdi-calendar-range"
            outlined
            class="custom-field mb-4"
          >
        <template v-slot:no-data>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Escribe la fecha y dale <kbd>enter</kbd> para agruparlas <v-chip>ej. 14 de abril 2001</v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
          </v-combobox>

                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datesolicitud"
                        label="Fecha de solicitud"
                        placeholder="Elija la fecha de solicitud"
                        append-icon="mdi-calendar"
                        dense
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field"
                        :rules="validations.fieldRules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="datesolicitud"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="dateMininum"
                      class="custom-field"
                      locale="es-MX"
                    ></v-date-picker>
                  </v-menu>
                  <!--:rules="validations.fieldRules"-->

                  <!--:rules="validations.fieldRules"-->


                  <!-- <v-select
                    :items="publications"
                    label="Publicación"
                    placeholder="Seleccione una opción"
                    item-text="publicationName"
                    item-value="_id"
                    outlined
                    dense
                    v-model="publication"
                    class="custom-field"
                  ></v-select> -->

                  <v-text-field
                    outlined
                    dense
                    label="Cantidad"
                    placeholder="Ingrese la cantidad"
                    append-icon="mdi-numeric-1-box"
                    class="custom-field"
                    v-model="amount"
                  ></v-text-field>

                  <v-textarea
                    outlined
                    name="input-7-4"
                    label="Descripción del material solicitado"
                    class="custom-field"
                    height="150"
                    v-model="description"
                  ></v-textarea>
                   <v-textarea
                    outlined
                    name="input-7-4"
                    label="Comentarios"
                    class="custom-field mb-2"
                    height="50"
                    v-model="comentarios"
                    hide-details
                  ></v-textarea>

                </v-form>
                <v-card-actions class="mt-1">
                  <v-spacer />
                  <v-btn color="primary" @click="validate()"> Aceptar </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>
    <v-dialog v-model="confirm" max-width="300">
      <v-card :loading="loading">
        <v-card-title> Aviso </v-card-title>

        <v-card-text v-if="!loading">¿Agregar solicitud?</v-card-text>
        <v-card-text v-if="loading">Cargando solicitud</v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn outlined @click="confirm = false"
          > Cancelar </v-btn>
          <v-btn outlined color="primary" @click="addRequest()"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    data(){
      return {
        loading: false,
        dialog: false,
        confirm: false,
        tiempoestimado : null,
        evento:null,
        name: null,
        telephone: null,
        address: null,
        email: null,
        position : null,
        fileUse : null,
         dates: [],
        datesolicitud: null,
         menu2 : false,
         comentarios : null,

        id: null,
        fileType: null,
        use: null,
        publication : null,
        topic: null,
        date: null,
        amount: null,
        description: null,

        userData : null,

        validations: {
          fieldRules: [(v) => !!v || "Campo requerido"]
        },
        tags : [
          { icon : "mdi-text-box", value : "Texto" },
          { icon : "mdi-image", value : "Imagen" },
          { icon : "mdi-file", value : "PDF" },
        ],
        select1 : ["Foto","Página", "Gráfica", "Información","Todos los archivos"],
        select2 : ["Páginas", "Fotos", "Textos", "Todos"],
        departments : [
          'Central 9',
          'Dirección Comercial',
          'Dirección Editorial',
          'Edición Web',
          'Mercadotecnia',
          'Sección espectáculos',
          'Sección Imagen',
          'Sección Local',
          'Sección Yucatán',
          'Ventas Mostrador'
        ],
        tipoUsuario:[
          'Interno',
          'Externo',
          'Otro (puede especificarlo al escribirlo)'
        ],
        fileUses : [
          'Campaña mercadotecnia' ,
          'Exposición fotográfica',
          'Fotogalería',
          'Nota',
          'Otros',
          'Reportaje especial',
          'Testigo',
          'Venta' ,
          'Vídeo',
        ],
        instruction : ['escribe la fecha y dale enter para agruparlas'],
         tiempoestimadoitem:['Urgente','No urgente','Escriba la fecha limite*'],
        publications : [],
        positions : [],
        date : null,
        kinduser: null,
        menu : false,
        notebook : null,
        dateMininum : "1864-01-01",
      }
    },
    watch: {
      menu( val ){
        val && setTimeout( () => (this.$refs.picker.activePicker = "YEAR" ))
      },
      notebook( val ){
        this.getYears();
      },

    },
    methods : {
      async openDialog(){
        this.dialog = true;
        this.getPositions();
        await this.getUser();
        this.getPublications();
      },
      async getPublications(){
        const response = await this.$axios.$get('/Publications',{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.publications = response.data.publicaciones;
        this.publications.push({ publicationName : 'Totas las publicaciones', _id: null});
      },
      closeAll(){
        this.$refs.userForm.reset();
        this.$refs.dataForm.reset();
        this.confirm = false;
        this.dialog = false;
        this.loading = false;
      },

     validate(){
      if(this.$refs.dataForm.validate() && this.$refs.userForm.validate()){

           this.confirm = true;
      }
    },
      async addRequest(){
        this.loading = true;
        let body = {

          idcustomer: localStorage.user_id,

          nombre : this.name,
          telefono : this.telephone,
          direccion : this.address,
          email : this.email,
          position : this.position,
          useFile : this.fileUse,
          tiempo_estimado: this.tiempoestimado,
          kind_user : this.kinduser,

          clave : this.id,
          tipoArchivo : this.fileType,
          uso :this.use,
          publication : this.publication,
          tema : this.topic,
          cantidad : this.amount,
          fecha_peticion : this.dates,
          fecha_creacion_solicitud : this.datesolicitud,
           comentarios : this.comentarios,
          descripcion : this.description,

          spendTime : '00:00',
          employee : this.userData,
          state : 'Comenzar',
        }
        try {
          const response = await this.$axios.$post('/requestdocuments', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          console.log(response.data);
          this.$parent.$parent.getRequests();
          this.closeAll()
        } catch (error) {
          console.log(error.response);
          this.loading = false;
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, intente de nuevo'
          );
        }
      },
      getYears(){
        if( this.notebook == null){
          this.dateMininum = "1864-01-01";
        }
        else{
          const temp = this.publications.find( (el) => el._id == this.notebook );
          this.dateMininum = new Date(temp.minDate)
            .toISOString()
            .substring(0,10)
        }
      },
      async getUser(){
        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.userData = {
          email : response.data.email,
          group : response.data.group,
          isExtern: response.data.isExtern,
          job : response.data.job,
          name : response.data.name,
          phone : response.data.phone,
          role : response.data.role,
          _id : response.data._id
        };
      },
      async getPositions(){
        try {
          const response = await this.$axios.$get('/position', {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          this.positions = response.data;
        } catch (error) {

        }
      }
    }
  }
</script>

<style>

</style>
