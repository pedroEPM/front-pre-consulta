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
          <v-icon> mdi-alert-circle </v-icon>
          <v-spacer />
          <v-toolbar-title>Editar reporte</v-toolbar-title>
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

              <v-card outlined class="pa-5 mt-3">
                <label>Datos del usuario</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="requestForm" lazy-validation readonly>
                  <v-text-field
                    outlined
                    dense
                    label="Nombre del usuario"
                    class="custom-field"
                    v-model="userData.name"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Teléfono"
                    class="custom-field"
                    v-model="userData.phone"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Correo"
                    class="custom-field"
                    v-model="userData.email"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    label="Trabajo"
                    class="custom-field"
                    v-model="userData.job"
                  ></v-text-field>

                </v-form>
              </v-card>

              <v-card outlined class="pa-5 mt-3">
                <label>Datos del administrador</label>
                <v-divider></v-divider>
                <v-form  ref="requestForm" lazy-validation readonly>
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
                >
                  <template v-slot:[`item.date`]="{ item }">
                    <span>{{
                      new Date(item.date).toISOString().substring(0, 10)
                    }}</span>
                  </template>
                </v-data-table>
              </v-card>

            </v-flex>
            <v-flex xs12 md6>
              <v-card outlined class="pa-5">
                <v-form class="mt-5" ref="form" readonly>
                  <v-text-field
                    outlined
                    label="Nombre"
                    v-model="name"
                    :rules="validations.fieldRules"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    label="Email"
                    v-model="email"
                    :rules="validations.fieldResults"
                  ></v-text-field>
                  <v-textarea
                    outlined
                    label="Descripción del error"
                    height="150"
                    v-model="description"
                    :rules="validations.fieldRules"
                  ></v-textarea>
                </v-form>
                <v-card-actions class="mt-1">
                  <v-spacer />
                  <v-btn outlined color="seccondary" :disabled="enabled" @click="showView()"> Ver documento </v-btn>
                </v-card-actions>
              </v-card>

              <v-card outlined class="pa-5 mt-3">
                <label>Datos del reporte</label>
                <v-divider class="mb-4"></v-divider>
                <v-form ref="requestForm2" lazy-validation>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
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
                    </v-flex >
                    <v-flex xs12 md6>
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
                    </v-flex>
                    <v-flex xs12 md12>
                      <v-card flat>
                          <v-card-text style="font-size: xx-large" class="text-center">{{tiempoTexto()}}</v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
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
                  <p v-if="reply">El reporte ha sido atendido</p>
                  <v-spacer />
                  <v-btn outlined color="primary" @click="validate()"> Actualizar </v-btn>
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

        <v-card-text v-if="!loading">¿Editar reporte?</v-card-text>
        <v-card-text v-if="loading">Cargando reporte</v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn outlined @click="confirm = false"
          > Cancelar </v-btn>
          <v-btn outlined color="primary" @click="editReport()"
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
        dialog: false,
        confirm : false,
        loading : false,
        name : null,
        email : null,
        userId: null,
        adminId : null,
        _id : null,
        spendTime : null,
        state : null,
        comented:null,
        adminId : null,
        fileId : null,
        mode : null,
        state : null,
        state2: null,
        description : null,
        loadingHistoralLogs : false,
        path : null,
        validations : {
          fieldRules : [ ( v ) => !!v || 'Campo requerido']
        },
        status : [
          { status : 'Comenzar', value : 'Comenzar' },
          { status : 'Proceso', value : 'Proceso' },
          { status : 'Finalizado', value : 'Finalizado' },
        ],
        historyHeaders : [
          { text : 'Nombre', value : 'userId.name', width : '20%'},
          { text : 'Descripción', value : 'description' },
          { text : 'Comentario', value : 'comented' },
          { text : 'Fecha', value : 'date', width : '20%' },
        ],
        historyLogs: [],
        userData : {
          name : null,
          phone : null,
          email : null,
          job : null,
        },
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
        hours : 0,
        minutes : 0,
        lessHours : 0,
        lessMinutes : 0,
        arrMinutes: [],
        arrHours: [],

        reply : false,
        enabled : false,
      }
    },
    watch : {
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
      },
    },
    methods : {
      tiempoTexto(){
        let spendTime = this.spendTime || "00:00"
        return "Tiempo invertido: " + spendTime.substring(0,2)+" horas y  "+spendTime.substring(3,spendTime.length)+" minutos"
      },
      async openDialog( item ){
        this.userId = item.userId
        item.adminId != undefined ? this.adminId = item.adminId._id : this.adminId = localStorage.user_id;
        this._id = item._id;
        this.addMinutes();
        this.addHours();
        this.getReport();
        this.getUser();
        this.getAdmin();
        await this.getHistorialLogs();
        this.dialog = true;
        this.hours = 0;
        this.minutes = 0;
        this.lessHours = 0;
        this.lessMinutes = 0;

      },
      closeAndClose(){
        this.$refs.form.reset();
        this.$refs.requestForm.reset();
        this.$refs.requestForm2.reset();
        this.confirm = false;
        this.dialog = false;
        this.loading = false;
        this.state = null;
        this._id = null;
        this.hours = 0;
        this.minutes = 0;
        this.lessHours = 0;
        this.lessHours = 0;
      },
      async getReport(){
        const response = await this.$axios.$get('/reports/' + this._id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.name = response.data.report[0].name;
        this.email = response.data.report[0].email;
        this.description = response.data.report[0].description;
        this.userId = response.data.report[0].userId;
        this.state = response.data.report[0].state;
        this.state2 = response.data.report[0].state;
        this.fileId = response.data.report[0].fileId;
        this.mode = response.data.report[0].mode;
        this.spendTime = response.data.report[0].spendTime;
       // this.comented = response.data.comented[0] || null
        this.path = response.data.report[0].path;
        if(this.path != undefined){
          this.enabled = false;
        }else{
          this.enabled = true;
        }

      },
      async editReport(){
        this.loading = true;
        await this.getAdminHistorial();
        this.getNewSpendTime();
        this.getNewLessSpendTime();
        this.getNewState();
        const body = {
          name : this.name,
          email : this.email,
          description : this.description,
          userId : this.userId,
          _id : this._id,
          adminId : localStorage.user_id,
          fileId : this.fileId,
          mode : this.mode,
          state : this.state,
          spendTime : this.spendTime,
          comented: this.comented
        }
        try {
          const response = await this.$axios.$put('/reports', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });

          if(response){
            this.closeAndClose();
            this.$parent.$parent.getReports();
            this.$store.commit(
              'openSnack',
              'El reporte ha sido actualizado exitosamente'
            );
          }
        } catch (error) {
          this.loading = false;
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, intente de nuevo'
          )
        }
      },
      validate(){
        if(this.$refs.form.validate()){
          this.confirm = true;
        }
      },
      async getUser(){
        const response = await this.$axios.$get('/users/' + this.userId._id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.userData = {
          email : response.data.email,
          job : response.data.job,
          name : response.data.name,
          phone : response.data.phone,
        };
      },
      async getAdmin(){
       // console.log(this.adminId)
        const response = await this.$axios.$get('/adminsById/' + this.adminId ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.userAdmin = {
          email : response.data.email,
          job : response.data.job,
          name : response.data.name,
          phone : response.data.phone,
        };
      },
      async getAdminHistorial(){
        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.userAdminHistorial = {
          email : response.data.email,
          name : response.data.name,
        };
        this.addHistorialLog( 'Se modificó el reporte por ' + this.userAdminHistorial.name );
      },
      addMinutes(){
        for(let i = 0; i <= 60; i++){
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
          this.addHistorialLog( 'Se aumentó ' + horas + ' horas por ' + this.userAdminHistorial.name );
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
          comented:this.comented,
          description : description,
          fileId : this._id,
          userId : localStorage.user_id,
        };
        try {
          const response = await this.$axios.$post('/addHistoricalLog', body, {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
        } catch (error) {
          console.log(error);
        }
      },
      async getHistorialLogs(){
        this.loadingHistoralLogs = false;
        try {
          const response = await this.$axios.$get('/historicalLog', {
            params : {
              fileId : this._id,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          if (response.data.length>0){
            response.data.sort(function(a, b){
                return new Date(b.date) - new Date(a.date)
            })
          }
          this.historyLogs = response.data;
          if( this.historyLogs.length > 0 ){
            this.reply = true;
          }else{
            this.reply = false;
          }
        } catch (error) {
          console.log(error)
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
        let title = "Reporte " + this._id + ' - ' + new Date().toISOString().substring(0,10);
        let body = [];

        for( let i = 0; i < this.historyLogs.length; i++){
          let data = [
            this.historyLogs[i].userId.name,
            this.historyLogs[i].description,
            this.historyLogs[i].date.substring(0,10)
          ]
          body.push(data)
        }

        doc.text( title, 45, 10);
        doc.setFontSize(12);
        doc.text( 'Datos del usuario:', 10, 18);

        doc.autoTable({
          theme: 'plain',
          margin : { top : 22, bottom : 30 },
          head : [[ 'Nombre', 'Teléfono', 'Trabajo', 'Correo' ]],
          body : [[ this.userData.name, this.userData.phone, this.userData.job, this.email ]]
        });

        doc.setFontSize(12);
        doc.text( 'Datos del reporte:', 10, 47);

        doc.autoTable();
        doc.autoTable({
          theme : 'plain',
          columnStyles : {
            2 : { cellWidth : 40 }
          },
          head : [['Nombre', 'Correo', 'Tiempo invertido', 'Descripción']],
          body : [[ this.name, this.email, this.spendTime + ' Horas', this.description]]
        });
        doc.autoTable();

        doc.setFontSize(12);
        doc.text( 'Historial de modificaciones:', 10, 77);
        doc.autoTable({
          theme : 'striped',
          head: [['Nombre', 'Descripción', 'Fecha']],
          body: body
        });

        doc.save( title );
      },
      showView(){
        //https://megateca.megamedia.com.mx
         window.open('https://megateca.megamedia.com.mx'+this.path);
        // window.open('https://centro-consulta.dev-axon.com/'+this.path);
      }
    }
  }
</script>

<style>

</style>
