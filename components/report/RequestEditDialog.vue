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
          <v-toolbar-title>Editar solicitud</v-toolbar-title>
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
                <label>Solicitud de Archivo</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="userForm" lazy-validation readonly>
                  <v-text-field
                    outlined
                    dense
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    append-icon="mdi-account"
                    class="custom-field"
                    v-model="name"

                  ></v-text-field>
        <!--falta agregar su end point--->
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
                  ></v-select> -->


                  <v-text-field
                    outlined
                    dense
                    label="Puesto"
                    placeholder="Ingrese el puesto"
                    class="custom-field"
                    v-model="position"

                  ></v-text-field>

                  <!-- <v-select
                    :items="select1"
                    label="Tipo de archivo"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    class="custom-field"
                    v-model="fileType"

                  ></v-select> -->

                  <v-text-field
                    outlined
                    dense
                    label="Tipo de archivo"
                    placeholder="Ingrese el Tipo de archivo"
                    class="custom-field"
                    v-model="fileType"

                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Departamento"
                    placeholder="Ingrese su departamento"
                    append-icon="mdi-map-marker"
                    class="custom-field"
                    v-model="address"

                  ></v-text-field>

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

                  ></v-text-field>

                  <v-text-field
                    label="Uso que se le dará a los Archivos solicitados"
                    placeholder="Seleccione el uso"
                    outlined
                    dense
                    class="custom-field"
                    v-model="fileUse"

                  ></v-text-field>
                     <v-text-field
                    label="Tiempo estimado para recibir la información"
                    outlined
                    dense
                    class="custom-field"
                    v-model="tiempoestimado"

                  ></v-text-field>
                   <v-text-field
                    label="Tipo usuario"
                    outlined
                    dense
                    class="custom-field"
                    v-model="kinduser"

                  ></v-text-field>
                </v-form>
              </v-card>

              <v-card outlined class="pa-5 mt-3">
                <label>Datos del administrador</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="requestForm" lazy-validation readonly>
                  <v-text-field
                    outlined
                    dense
                    label="Nombre del administrador"
                    class="custom-field"
                    v-model="userAdmin.name"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Teléfono"
                    class="custom-field"
                    v-model="userAdmin.phone"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Correo"
                    class="custom-field"
                    v-model="userAdmin.email"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Trabajo"
                    class="custom-field"
                    v-model="userAdmin.job"
                  ></v-text-field>

                </v-form>
              </v-card>

              <v-card outlined class="pa-5 mt-3" v-if="loadingHistoralLogs">
                <label>Historial de modificaciones</label>
                <v-divider></v-divider>
                <v-data-table
                  :headers="historyHeaders"
                  :items="historyLogs"
                  :items-per-page="5"
                  class="mi-dataTable"

                >
                  <template v-slot:[`item.date`]="{ item }">
                    <span >{{
                      new Date(item.date).toISOString().substring(0, 10)
                    }}</span>
                  </template>
                  <!--template #item.comentario="{ value }"-->
                  <template v-slot:[`item.comented`]="{ item }">
	                  <div v-html="makingURLS(item.comented)" style="width:100%; padding:0, magin:0"></div>
                  </template>
                </v-data-table>
              </v-card>

            </v-flex>
            <v-flex xs12 md6>
              <v-card outlined class="pa-5">
                <label>Material a Solicitar</label>
                <v-divider class="mb-4"></v-divider>

                <v-form ref="dataForm" lazy-validation readonly>

                  <v-text-field
                    outlined
                    dense
                    label="Clave de archivo"
                    placeholder="Ingrese la clave"
                    append-icon="mdi-numeric"
                    class="custom-field"
                    v-model="id"

                  ></v-text-field>
                  <v-select
                    :items="select2"
                    label="Otros recursos informativos"
                    placeholder="Seleccione una opción"
                    outlined
                    dense
                    class="custom-field"
                    v-model="use"

                  ></v-select>
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

    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
         min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="dates"
            multiple
            chips
            hide-details
            label="Fechas y múltiples fechas de publicación"
            placeholder="Elija la fecha(s) de publicación"
            append-icon="mdi-calendar-range"
            outlined
            class="custom-field mb-4"
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="dates"
          multiple
          scrollable
          :max="new Date().toISOString().substr(0, 10)"
          locale="es-MX"
        >
          <v-spacer></v-spacer>
          <v-btn
      class="mx-2"
      fab
      outlined
      small
      color="primary"
       @click="menu = false"
    >
      <v-icon dark>
        mdi-minus
      </v-icon>
    </v-btn>
     <v-btn
      class="mx-2"
      fab
      outlined
      small
      color="primary"
      @click=" dates = []
      $refs.menu.save(dates)
      menu = false"
    >
      <v-icon dark>
        mdi-broom
      </v-icon>
    </v-btn>
          <v-btn
           color="info"
            @click="$refs.menu.save(dates)"
          >
            confirmar
          </v-btn>
        </v-date-picker>
      </v-menu>

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
                        v-model="dateview"
                        label="Fecha de solicitud"
                        placeholder="Elija una fecha"
                        append-icon="mdi-calendar"
                        dense
                        outlined
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        class="custom-field"

                      ></v-text-field>
                    </template>
                    <v-date-picker
                      ref="picker"
                      v-model="dateview"
                      :max="new Date().toISOString().substr(0, 10)"
                      :min="dateMininum"
                      class="custom-field"
                      locale="es-MX"
                    ></v-date-picker>
                  </v-menu>



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
                    :rules="validations.fieldRules"
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
              </v-card>

              <v-card outlined class="pa-5 mt-3">
                <label>Registro de Actividades</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="requestForm" lazy-validation>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-card  outlined>
                        <v-card-text>
                        <v-container>

                      <v-flex xs12 md6>
                        <label>Aumentar horas</label>
                      </v-flex>
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <v-select
                            outlined
                            hide-details
                            dense
                            label="Horas"
                            class="custom-field"
                            v-model="hours"
                            :items="arrHours"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-select
                            outlined
                            hide-details
                            dense
                            label="Minutos"
                            class="custom-field"
                            v-model="minutes"
                            :items="arrMinutes"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                        </v-container>
                        </v-card-text>
                      </v-card>
                    </v-flex >
                    <v-flex xs12 md6>
                      <v-card outlined>
                        <v-card-text>
                          <v-container>

                      <v-flex xs12 md6>
                        <label>Disminuir horas</label>
                      </v-flex>
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <v-select
                            outlined
                            hide-details
                            dense
                            label="Horas"
                            class="custom-field"
                            v-model="lessHours"
                            :items="arrHours"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-select
                            outlined
                            hide-details
                            dense
                            label="Minutos"
                            class="custom-field"
                            v-model="lessMinutes"
                            :items="arrMinutes"
                          ></v-select>
                        </v-flex>
                      </v-layout>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-card flat>
                          <v-card-text style="font-size: xx-large" class="text-center">{{tiempoTexto()}}</v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                  <!------------------------<v-flex xs12 md4>--------------------//-->
                  <v-layout row wrap>

                  <v-flex style="padding:0px 0px 0px 20px" xs12>
                      <p>Aumentar o disminuir la cantidad</p>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field
                        outlined
                        dense
                        label="Cantidad Notas"
                        :placeholder="totalNotesAux"
                        append-icon="mdi-numeric-1-box"
                        class="custom-field mb-4"
                        v-model="totalNotes"
                        type="number"
                        :min="mintotalNotesAux"
                        hide-details
                      ></v-text-field>
                      <div>
                        <center>
                          <p class="cantidades">Cantidad Notas: {{totalNotesAux}}</p>
                        </center>
                      </div>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field
                        outlined
                        dense
                        label="Cantidad Imagenes"
                        :placeholder="totalImagesAux"
                        append-icon="mdi-numeric-1-box"
                        class="custom-field mb-4"
                        v-model="totalImages"
                        type="number"
                        :min="mintotalImagesAux"
                        hide-details
                      ></v-text-field>
                        <div>
                        <center>
                          <p class="cantidades">Cantidad Imagenes: {{totalImagesAux}}</p>
                        </center>
                      </div>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field
                        outlined
                        dense
                        label="Cantidad Pdfs"
                        :placeholder="totalPdfsAux"
                        append-icon="mdi-numeric-1-box"
                        class="custom-field mb-4"
                        v-model="totalPdfs"
                        type="number"
                        :min="mintotalPdfsAux"
                        hide-details
                      ></v-text-field>
                         <div>
                        <center>
                          <p class="cantidades">Cantidad Pdfs: {{totalPdfsAux}}</p>
                        </center>
                      </div>
                    </v-flex>

                  </v-layout>

                  <!--------------------------------------------//-->
                  <v-select
                    :items="status"
                    label="Estado"
                    placeholder="Seleccione una opción"
                    item-text="status"
                    item-value="value"
                    outlined
                    dense
                    v-model="state"
                    class="custom-field"
                  ></v-select>

                  <v-textarea
                    outlined
                    name="input-7-4"
                    label="Agrega un comentario"
                    class="custom-field"
                    height="100"
                    v-model="comented"
                  ></v-textarea>
                </v-form>
                <v-card-actions class="mt-1">
                  <v-spacer />
                  <v-btn color="primary" @click="confirm = true"> Actualizar </v-btn>
                  <v-btn outlined color="seccondary" @click="createPDF()"> Descargar </v-btn>
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

        <v-card-text v-if="!loading">¿Actualizar solicitud?</v-card-text>
        <v-card-text v-if="loading">Cargando solicitud</v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn outlined @click="confirm = false"
          > Cancelar </v-btn>
          <v-btn color="primary" @click="editRequest()"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>

  import jsPDF from 'jspdf';
  import 'jspdf-autotable';

  export default {
    data(){
      return {
        loading: false,
        loadingHistoralLogs : false,
        dialog: false,
        confirm: false,

        name: null,
        telephone: null,
        address: null,
        email: null,
        position : null,
        fileUse : null,
        totalNotesAux: 0,
        totalImagesAux: 0,
        totalPdfsAux: 0,
        tiempoestimado: null,
        kinduser : null,

        mintotalPdfsAux: null,
        mintotalImagesAux: null,
        mintotalNotesAux: null,
        totalNotes: null,
        totalImages: null,
        totalPdfs: null,
        id: null,
        fileType: null,
        use: null,
        publication : null,
        topic: null,
        date: null,
        dateview : null,
        amount: null,
        description: null,
        comentarios:null,

        idR: null,
        userData : null,
        adminId : null,
        userAdmin : {
          name : null,
          phone : null,
          email : null,
          job : null,
        },
        userAdminHistorial : {
          name : null,
          email : null,
        },
        state : null,
        state2 : null,
        spendTime : null,
        hours : 0,
        minutes : 0,
        lessHours : 0,
        lessMinutes : 0,
        validations: {
          fieldRules: [(v) => !!v || "Campo requerido"]
        },
        comented:null,
        tags : [
          { icon : "mdi-text-box", value : "Texto" },
          { icon : "mdi-image", value : "Imagen" },
          { icon : "mdi-file", value : "PDF" },
        ],
        status : [
          { status : 'Comenzar', value : 'Comenzar' },
          { status : 'Proceso', value : 'Proceso' },
          { status : 'Finalizado', value : 'Finalizado' },
        ],
        historyHeaders : [
          { text : 'Nombre', value : 'userId.name', width : '20%' },
          { text : 'Comentario', value : 'comented', width: '20%', sortable: false},
          { text : 'Fecha', value : 'date', width : '20%' },
          { text : 'Descripción', value : 'description' },
        ],
        historyLogs: [],
        arrMinutes: [],
        arrHours: [],
        select1 : ["Foto", "Página", "Gráfica", "Información", "Todos los archivos"],
        select2 : ["Páginas", "Fotos", "Textos", "Todos"],
        fileUses : [
          'Campaña' ,
          'Exposición fotográfica',
          'Fotogalería',
          'Nota',
          'Reportaje especial',
          'Varios',
          'Venta' ,
          'Vídeo',
        ],
        publications : [],
        positions : [],
        date : null,
        dates : [],
        menu : false,
        menu2: false,
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
      hours( newValue ){
        if( newValue ){
          this.lessHours = 0;
          this.lessMinutes = 0;
        }
      },
      minutes( newValue ){
        if( newValue ){
          this.lessHours = 0;
          this.lessMinutes = 0;
        }
      },
      lessMinutes( newValue ){
        if( newValue ){
          this.hours = 0;
          this.minutes = 0;
        }
      },
      lessHours( newValue ){
        if( newValue ){
          this.hours = 0;
          this.minutes = 0;
        }
      }
    },
    methods : {
      makingURLS(texto){
          let texto2 = (texto) ? texto:""
          const regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
          try{
            let urls = texto2.match(regexp)
            //urls.forEach(url =>{
              console.log(urls)
              //for (let i = 0;i<=urls.length;i++){
                let url =  urls[0]
                //console.log(i)
                //console.log(url)
                let newurl = '<a target="_blank" href="'+url+'">'+url.substring(0,12)+'....'+'</a>'
                console.log(newurl)
                texto2 = texto2.replace(url,newurl)
                console.log(texto2)
              //}
                //texto2 = texto2.replace(url.substring(0,12)+"...."+'</a>',"")
            //})
            return texto2
          }catch(e){console.log("not tiene urls")}
          console.log(texto2)
          return texto2
      },
      tiempoTexto(){
        let spendTime = this.spendTime || "00:00"
        return "Tiempo invertido: " + spendTime.substring(0,2)+" horas y  "+spendTime.substring(3,spendTime.length)+" minutos"
      },
      async openDialog( item ){
        this.idR = item._id;
        item.adminId != undefined ? this.adminId = item.adminId : this.adminId = localStorage.user_id;
        console.log(1)
        this.getPostiions();
        console.log(2)
        await this.getRequest();
        console.log(3)
        this.getPublications();
        console.log(4)
        this.getAdmin();
        console.log(5)
        this.addMinutes();
        console.log(6)
        this.addHours();
        console.log(7)
        await this.getHistorialLogs();
        console.log(8)
        this.dialog = true;
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
        this.comented = null;
        this.dateview = null;
        this.hours = 0;
        this.minutes = 0;
        this.lessHours = 0;
        this.lessMinutes = 0;
        this.totalNotes = null;
        this.totalImages = null;
      this.totalPdfs = null;
      },
      async editRequest(){
        console.log('====CANTIDADES====');
              console.log(this.totalNotes)
          console.log(this.totalImages)
        console.log(this.totalPdfs)

        this.loading = true;
        await this.getAdminHistorial();
        this.getNewSpendTime();
        this.getNewLessSpendTime();
        this.getNewState();
        let body = {
          nombre : this.name,
          telefono : this.telephone,
          direccion : this.address,
          email : this.email,
          clave : this.id,
          idcustomer: localStorage.user_id,
          tipoArchivo : this.fileType,
          useFile : this.fileUse,
          kind_user : this.kinduser,

          uso :this.use,
          tema : this.topic,
          fecha_peticion : this.dates,
          fecha_creacion_solicitud : this.date,
          cantidad : this.amount,
          descripcion : this.description,
          comentarios : this.comentarios,
          _id: this.idR,
          state : this.state,
          spendTime : this.spendTime,
          employee : this.userData,
          area : this.userData.job,
          proyect : null,
          adminId : this.adminId,

          totalNotes: this.totalNotes,
          totalImages: this.totalImages,
          totalPdfs: this.totalPdfs,
          comented:this.comented
        }
        console.log('enviar my body', body);
        try {
          const response = await this.$axios.$put('/requestdocuments', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          console.log('DATA ACTUALIZAR RESPUESTA',response);
          this.$parent.$parent.getRequests();
          this.closeAll()

          this.$store.commit(
            'openSnack',
            'La solicitud ha sido actualizada exitosamente!'
          )
        } catch (error) {
          console.log('error', error);
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
          email : response.data.email != null && response.data.email != undefined ? response.data.email : '',
          group : response.data.group != null && response.data.group != undefined ? response.data.group : '',
          isExtern: response.data.isExtern != null && response.data.isExtern != undefined ? response.data.isExtern : false ,
          job : response.data.job != null && response.data.job != undefined ? response.data.job : '',
          name : response.data.name != null && response.data.name != undefined ? response.data.name : '',
          phone : response.data.phone != null && response.data.phone != undefined ? response.data.phone : '',
          role : response.data.role != null && response.data.role != undefined ? response.data.role : '',
          _id : response.data._id != null && response.data._id != undefined ? response.data._id : ''
        };
      },
      async getRequest(){
        this.loading = true;

        const response = await this.$axios.$get('/requestdocuments/' + this.idR, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        const data = response.data.newRequest_DocumentsObj;
       console.log('DATA LLENAR CAMPOS', data);
        this.amount = data.cantidad != undefined && data.cantidad != null ? data.cantidad : '';
        this.id = data.clave != undefined && data.clave != null ? data.clave : '';

        this.description = data.descripcion != null && data.descripcion != undefined ? data.descripcion : '';
          this.comentarios = data.comentarios != null && data.comentarios != undefined ? data.comentarios : '';
        this.address = data.direccion != undefined && data.direccion != null ? data.direccion : '';
        this.email= data.email != undefined && data.email != null ? data.email : '';
         this.dates = data.fecha_peticion != undefined && data.fecha_peticion != null ? data.fecha_peticion : '';
        this.date = data.fecha_creacion_solicitud != null && data.fecha_creacion_solicitud != undefined
        ? new Date(data.fecha_creacion_solicitud)
                    .toISOString()
                    .substring(0,10)
        :'' ;
        this.dateview = new Date(data.fecha_creacion_solicitud).toISOString().substring(8, 10) + '-' + this.getMonth(new Date(data.fecha_creacion_solicitud).toISOString().substring(5, 7)) + '-' + new Date(data.fecha_creacion_solicitud).toISOString().substring(0, 4);
        this.name = data.nombre != undefined && data.nombre != null ? data.nombre : '';
        this.telephone = data.telefono != undefined && data.telefono != null ? data.telefono : '';
        this.topic = data.tema != undefined && data.tema != null ? data.tema : '';
        this.fileType = data.tipoArchivo != undefined && data.tipoArchivo != null ? data.tipoArchivo : '';
         this.tiempoestimado = data.tiempo_estimado != undefined && data.tiempo_estimado != null ? data.tiempo_estimado : '';
        this.use = data.uso != undefined && data.uso != null ? data.uso : '';
        this.spendTime = data.spendTime != undefined && data.spendTime != null ? data.spendTime : '';
        this.state = data.state != undefined && data.state != null ? data.state : '' ;
        this.state2 = data.state != undefined && data.state != null ? data.state : '' ;
        // come back
        data.employee == null ? await this.getUser() : this.userData = data.employee;

        this.publication = data.publication != undefined && data.publication != null ? data.publication : '';
        this.position = data.position != undefined && data.position != null ? data.position : '';
        this.fileUse = data.useFile != undefined && data.useFile != null ? data.useFile : '';
        this.kinduser = data.kind_user != undefined && data.kind_user != null ? data.kind_user : '';

        this.totalNotesAux = data.totalNotes || 0
        this.totalImagesAux = data.totalImages || 0
        this.totalPdfsAux = data.totalPdfs || 0
        this.comented = data.comented || null
        //validate negativos
        this.mintotalPdfsAux = (this.totalPdfsAux * (-1));
          this.mintotalImagesAux = (this.totalImagesAux * (-1));
            this.mintotalNotesAux = (this.totalNotesAux * (-1));

        this.loading = false;
      },
       getMonth( month ){

        let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[ parseInt(month -1) ];
      },
       async getAdmin(){
        const response = await this.$axios.$get('/adminsById/' + this.adminId ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.userAdmin = {
          email : response.data.email != undefined && response.data.email != null ? response.data.email : '',
          job : response.data.job != undefined && response.data.job != null ? response.data.job : '',
          name : response.data.name != undefined && response.data.name != null ? response.data.name : '',
          phone : response.data.phone != undefined && response.data.phone != null ? response.data.phone : '',
        };
      },
      async getAdminHistorial(){
        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.userAdminHistorial = {
          email : response.data.email != null && response.data.email != undefined ? response.data.email : '',
          name : response.data.name != null && response.data.name != undefined ? response.data.name : '',
        };
        this.addHistorialLog( 'Se modificó la solicitud por ' + this.userAdminHistorial.name + ', correo : ' +  this.userAdminHistorial.email );
      },
      addMinutes(){
        for(let i = 0; i < 60; i++){
          this.arrMinutes.push(i);
        }
      },
      addHours(){
        for(let i = 0; i <= 24; i++){
          this.arrHours.push(i);
        }
      },
      getNewSpendTime(){
        let oldSpendTime = this.spendTime;
        let horasExtra = 0;
        let minutos = Number(this.spendTime.substring((this.spendTime.length-2)));
        let hora2 = Number(this.spendTime.substring( 0, (this.spendTime.length-3)));

        let newMinutos = minutos + this.minutes;

        if(newMinutos >= 60){
          horasExtra = Math.trunc(newMinutos / 60);
          newMinutos = newMinutos % 60;
        }
        let newHour = hora2 + horasExtra + this.hours;
        if(newMinutos < 10){
          this.spendTime = newHour + ':0' + newMinutos;
        }else{
          this.spendTime = newHour + ':' + newMinutos;
        }
        if(this.minutes > 0 || this.hours > 0){
          let horas = this.hours + ':' + ( this.minutes < 10 ? ( '0' + this.minutes ) : this.minutes )
          this.addHistorialLog( 'Se aumentó ' + horas + ' horas por ' + this.userAdminHistorial.name + ', correo : ' +  this.userAdminHistorial.email );
        }
      },
      getNewLessSpendTime(){
        let oldSpendTime = this.spendTime;
        let horasExtra = 0;
        let minutos = Number(this.spendTime.substring((this.spendTime.length-2)));
        let hora2 = Number(this.spendTime.substring( 0, (this.spendTime.length-3)));

        let newMinutos = minutos - this.lessMinutes;

        if(newMinutos <= 0){
          horasExtra = 1;
          newMinutos = - newMinutos - 60;
        }
        if(newMinutos > 0){
          newMinutos = -newMinutos;
        }

        let newHour = hora2 - horasExtra - this.lessHours;
        if(newHour < 0 ){
          this.spendTime = '00:00';
        }else{
          if(newMinutos > -10){

            this.spendTime = newHour + ':0' + (- newMinutos);
          }else{
            this.spendTime = newHour + ':' + (- newMinutos);
          }
        }
        if(this.lessHours > 0 || this.lessMinutes > 0){
          let horas = this.lessHours + ':' + ( this.lessMinutes < 10 ? ( '0' + this.lessMinutes ) : this.lessMinutes )
          this.addHistorialLog( 'Se disminuyó ' + horas + ' horas por ' + this.userAdminHistorial.name );
        }
      },
      getNewState(){
        if( this.state != this.state2 ){
          this.addHistorialLog('Se modificó el estado de "'+ this.state2 + '" a "' + this.state + '" por ' + this.userAdminHistorial.name );
        }
      },
      async addHistorialLog( description ){
        let body = {
          comented: this.comented,
          description : description,
          fileId : this.idR,
          userId : localStorage.user_id,
        };
        try {
          const response = await this.$axios.$post('/addHistoricalLog', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
        } catch (error) {
        }
      },
      async getHistorialLogs(){
        this.historyLogs = [];
        this.loadingHistoralLogs = false;
        try {
          const response = await this.$axios.$get('/historicalLog', {
            params : {
              fileId : this.idR
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.historyLogs = response.data;
        } catch (error) {
        }
        this.loadingHistoralLogs = true;
      },
      async createPDF(){

        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        let description = response.data.name + ' ha descargado el archivo.'
        await this.addHistorialLog( description );
        await this.getHistorialLogs();

        const doc = new jsPDF();
        let title = "Solicitud " + this.id + ' - ' + this.dateview;
        let body = [];

        for( let i = 0; i < this.historyLogs.length; i++){
          let data = [
            this.historyLogs[i].userId.name,
            this.historyLogs[i].description,
            this.historyLogs[i].date.substring(0,10)
          ]
          body.push(data)
        }

        doc.text( title, 60, 10);
        doc.setFontSize(14);
        doc.text( 'Datos del usuario:', 10, 18);

        doc.autoTable({
          theme: 'plain',
          margin : { top : 22, bottom : 30 },
          head : [[ 'Nombre', 'Teléfono', 'Departamento', 'Correo' ]],
          body : [[ this.name, this.telephone, this.address, this.email ]]
        });

        doc.setFontSize(14);
        doc.text( 'Datos de la solicitud:', 10, 47);

        doc.autoTable();
        doc.autoTable({
          theme : 'plain',
          head : [['Clave del archivo', 'Tipo de archivo', 'Tema solicitadó', 'Tiempo invertido', 'Cantidad de datos', 'Descripción']],
          body : [[ this.id, this.fileType, this.topic, this.spendTime + ' Horas', this.amount, this.description]]
        });
        doc.autoTable();
        doc.setFontSize(14);
        doc.text( 'Cantidades encontradas:', 10, 85);
        doc.autoTable({
          theme : 'plain',
          head : [['Total de notas', 'Total de páginas', 'Total de fotos']],
          body : [[ this.totalNotesAux, this.totalPdfsAux, this.totalImagesAux]]
        });
        doc.autoTable();

        doc.setFontSize(14);
        doc.text( 'Historial de modificaciones:', 10, 115);
        doc.autoTable({
          theme : 'striped',
          head: [['Nombre', 'Descripción', 'Fecha']],
          body: body
        });

        doc.save( title );
      },
      async getPostiions(){
        const response = await this.$axios.$get('/position', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.positions = response.data;
      }
    }
  }
</script>

<style>
.mi-dataTable{
     table-layout: fixed !important;
      white-space: normal;
}
.class-on-data-table table {
    table-layout: fixed;
  }
.cantidades{
  font-size: 20px;
  color: gray;
}
</style>
