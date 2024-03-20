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
          <!-- <v-icon>mdi-help</v-icon> -->
          <v-spacer />
          <v-toolbar-title>Historial de Consultas de usuario </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="cleanAndClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card
                outlined
                class="pa-5"
                style="overflow-y: auto"
              >
                <label>Datos del usuario</label>
                <v-divider class="mb-1"></v-divider>
                <v-card-text>
                  <v-form>
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-text-field
                          outlined
                          readonly
                          dense
                          label="Nombre"
                          clear-icon="custom-field"
                          hide-details
                          v-model="userData.name"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-text-field
                          outlined
                          readonly
                          dense
                          label="Teléfono"
                          clear-icon="custom-field"
                          hide-details
                          v-model="userData.phone"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-text-field
                          outlined
                          readonly
                          dense
                          label="Correo"
                          clear-icon="custom-field"
                          hide-details
                          v-model="userData.email"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-text-field
                          outlined
                          readonly
                          dense
                          label="Puesto de Trabajo"
                          clear-icon="custom-field"
                          hide-details
                          v-model="userData.job"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-layout row wrap >
                <v-flex xs12 md12>
                  <v-card
                    outlined
                    class="pa-5"
                    style="overflow-y: auto"
                  >
                    <v-layout row wrap v-if="general">
                      <v-flex>
                        <v-btn block large @click="mode = 'Notas', showInformation = false, fileId = null"
                            :color="selected[2].color"
                          ><v-icon left>mdi-newspaper-variant-outline</v-icon>Notas</v-btn
                        >
                      </v-flex>
                      <v-flex>
                        <v-btn block large @click="mode = 'Imagenes', showInformation = false, fileId = null"
                          :depressed="selected[1].pressed"
                            :color="selected[1].color"
                          ><v-icon left>mdi-image</v-icon>
                          Fotos
                        </v-btn>
                      </v-flex>

                      <v-flex>
                        <v-btn block large @click="mode = 'PDF', showInformation = false, fileId = null"
                          :color="selected[4].color"
                          ><v-icon left>mdi-file</v-icon>Páginas</v-btn
                        >
                      </v-flex>
                       <v-flex>
                        <v-btn block large
                          :color="selected[3].color"
                          ><v-icon left>mdi-video-box</v-icon>Multimedia</v-btn
                        >
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 md5>

                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateF"
                              label="Elija fecha inicial"
                              append-icon="mdi-calendar"
                              readonly
                              outlined
                              hide-details
                              dense
                              v-bind="attrs"
                              v-on="on"
                              class="custom-field"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="dateF"
                            @input="menu2 = false"
                            :min="minDate"
                            :max="maxDate2"
                             locale="es-MX"
                          ></v-date-picker>
                        </v-menu>

                      </v-flex>
                   <v-flex xs12 md5>
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateV"
                              label="Elija fecha final"
                              append-icon="mdi-calendar"
                              readonly
                              hide-details
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                              class="custom-field"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="dateV"
                            @input="menu1 = false"
                            :min="minDate"
                            :max="maxDate"
                       locale="es-MX"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12 md2>
                        <v-btn block color="primary" @click="findCharts()"
                          ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                        >
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="dataShow">
                    <v-card-text v-if="dataShow">
                       <v-layout row wrap>
                         <v-row>
                           <v-col cols="6">
                                <center> <h2>Reporte de consultas {{text1}} {{fechaI}} {{text2}} {{fechaT}}</h2></center>
                          <br>
                            <v-row >
                            <v-col  cols="12">
                            <v-card elevation="2" color="blue-grey lighten-5">
                              <div>
                           <v-row>
                        <v-col style="margin-left:15px" cols="4">
                     <!-- <v-btn block color="secondary" @click="msgadvertencia()" id="screen" :disabled="enablePB"
                          ><v-icon left>mdi-printer</v-icon> Imprimir</v-btn -->
                             <!-- > -->
                        </v-col>
                         <v-col>
                         <v-row v-if="general">
                          <v-col class="sin-padding-lat" cols="4">
                            <v-card elevation="2" color="blue-grey lighten-5">
                              <div style="padding:1px">
                                <center>
                                <h5>Imagenes</h5>
                               <p style="font-size:20px; font-weight:500">{{totalI}}</p>
                                </center>
                              </div>
                            </v-card>
                          </v-col>
                                <v-col class="sin-padding-lat" cols="4">
                            <v-card elevation="2" color="blue-grey lighten-5">
                              <div style="padding:1px">
                                <center>
                                <h5>Notas</h5>
                              <p style="font-size:20px; font-weight:500">{{totalN}}</p>
                                </center>
                              </div>
                            </v-card>
                          </v-col>
                          <v-col style="padding-right: 20px !important;" cols="4">
                            <v-card elevation="2" color="blue-grey lighten-5">
                              <div style="padding:1px">
                                <center>
                                <h5>Páginas</h5>
                                <p style="font-size:20px; font-weight:500">{{totalP}}</p>
                                </center>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>

                          <v-row v-if="!general">
                          <v-col class="sin-padding-lat" cols="4">
                            <v-card elevation="2" color="blue-grey lighten-5">
                              <div style="padding:1px">
                                <center>
                                <h5>{{modeindiv}}</h5>
                               <p style="font-size:20px; font-weight:500">{{totalindv}}</p>
                                </center>
                              </div>
                            </v-card>
                          </v-col>
                            <v-col class="sin-padding-lat" cols="4">
                          </v-col>
                          <v-col style="padding-right: 20px !important;" cols="4">
                          </v-col>
                        </v-row>
                            </v-col>
                           </v-row>
                                <v-row>
                                  <v-col id="chartshistorial">
                                   <PieChart
                                     v-if="loading.loadingD"
                                     :labelsData="dataLabel"
                                     :valuesData="dataInfo"
                                     :title="'Entradas'"
                                     :color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"
                                   />
                                  </v-col>
                                </v-row>
                                <br>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>

                           </v-col>
                            <v-col cols="6">
                           <center> <h2>Historial de consulta</h2></center>
                        <v-row>
                          <v-col>
                            <v-flex>
                          <v-data-table
                            :headers="historialLogsHeaders"
                            :items="visitInformation"
                            :items-per-page="5"
                          >
                            <template v-slot:[`item.date`]="{ item }">
                              <span>{{
                                new Date(item.date).toISOString().substring(0, 10)
                              }}</span>
                            </template>
                   <template v-slot:[`item.actions`]="{ item }">
                    <!-- <v-btn icon @click="irviewDialog(item.Datos[0].idMegamedia, item.date, item.Datos[0].date, item.Datos[0].dateCreation , item.Datos[0].title, item.Datos[0].imageSrc, item.Datos[0].description, item.Datos[0].descriptio, mode, item.Datos[0].content)"> -->
                 <v-btn icon @click="irviewDialog(item.Datos[0].isNewId, item.date, item.Datos[0].date, item.Datos[0].dateCreation , item.Datos[0].title, item.Datos[0].imageSrc, item.Datos[0].description, item.Datos[0].descriptio, mode, item.Datos[0].content)">
                   <v-icon>mdi-eye-refresh</v-icon>
                    </v-btn>
                   </template>
                          </v-data-table>
                          <Viewhistorialdialogo ref="Viewhistorialdialogo"/>
                        </v-flex>
                          </v-col>
                        </v-row>
                           </v-col>
                         </v-row>
                         <!---test 2--->

                      </v-layout>
                    </v-card-text>
                    </v-layout>
                  </v-card>
                </v-flex>

              </v-layout>
              <LoaderCard v-show="!dataShow" />
              <PrintindvDialog ref="PrintindvDialog" />
        <v-dialog v-model="confirm1" max-width="300" persistent>
       <v-card :loading="loading1">
        <v-card-title>Mensaje</v-card-title>

        <v-card-text v-if="!loading1">
         <h3>¿Quieres generar el reporte?</h3>
        </v-card-text>

        <v-card-text v-else>
          Cargando archivo...
        </v-card-text>

        <v-card-actions v-if="!loading1">
          <v-spacer />
          <v-btn outlined @click="confirm1 = false">Cancelar</v-btn>
          <v-btn color="primary" @click="modeprint()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
  import PrintindvDialog from '~/components/chartsAndGraphics/PrintIndividualDialog.vue'
  import PieChart from '~/components/charts/pieChart.vue';
  import SearchTableHistorical from '~/components/Configurations/SearchTableHistorical.vue';
  import LoaderCard from "~/components/LoaderCard";
  import Viewhistorialdialogo from "~/components/chartsAndGraphics/Viewhistorialdialgo.vue";
  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  export default {
    components : {
      SearchTableHistorical,
      LoaderCard,
      PieChart,
      Viewhistorialdialogo,
      PrintindvDialog
    },
    data(){
      return {
      modeindiv : null,
      totalindv : null,
      general : true,
      loading1 : false,
      confirm1 : false,
         dataInfo : [],
         dataLabel : [],
         ifdate : false,
         infoimprimir : null,
         infochartpdf: null,
          infocharthead : null,
          DownloadInformationpdf1 :[],
          DownloadInformationpdf2 :[],
           DownloadInformationpdf3 :[],
          enablePB : false,
        consultfecha: false,
        jobname: null,
        text1:'total',
        text2 : null,
        fechaI:null,
        fechaT:null,
        totalN: null,
        totalI: null,
        totalP: null,
        menu1 : false,
        menu2 : false,
        minDate: "1864-01-01",
        maxDate: new Date().toISOString().substring(0,10),
        dateV : new Date().toISOString().substring(0, 10),
        dateD : null,
        dateF : new Date(),
        maxDate2 : new Date(),

        dialog : false,
        dataShow : false,
        _id : null,
        userData : {},
        menu1 : false,
        menu2 : false,
        dataShow : false,
        loading : {
          loadingV : true,
          loadingD : true,
        },
        chooseType : false,
        mode : 'Imagenes',
        fileId: null,
        selected: [
          { pressed: false, text: "black", color: 'primary' },
          { pressed: true, text: "black", color: ''},
          { pressed: false, text: "black", color: 'primary' },
          { pressed: false, text: "black", color: 'primary' },
          { pressed: false, text: "black", color: 'primary' },
        ],
        historialLogsHeaders : [
          { text : 'Fecha', value : 'date', align : 'center', sortable : true, width : '20%'},
          { text : 'Titulo', value : 'Datos[0].description' },
          { text: "Ver", value: "actions", width: '25%', sortable: false },
        ],
        visitInformation : [],
      }
    },
       watch : {
      async mode( newvalue ){
        console.log('EL MODO DE BOTONES: ' + newvalue);
        // this.dataShow = false;
        switch( newvalue ){
          case 'Usuarios':
            this.selected[0].pressed = true;
            this.selected[0].text = 'black';
            this.selected[0].color = '';
            this.selected[1].color = 'primary';
            this.selected[2].color = 'primary';
            this.selected[3].color = 'primary';
            this.selected[4].color = 'primary';
            this.chooseType = true;
          break;
          case 'Imagenes':
            this.selected[1].pressed = true;
            this.selected[1].text = 'black';
            this.selected[1].color = '';
            this.selected[0].color = 'primary';
            this.selected[2].color = 'primary';
            this.selected[3].color = 'primary';
            this.selected[4].color = 'primary';
            this.historialLogsHeaders[1].value = 'Datos[0].description';

          break;
          case 'Notas':
            this.selected[2].pressed = true;
            this.selected[2].text = 'black';
            this.selected[2].color = '';
            this.selected[0].color = 'primary';
            this.selected[1].color = 'primary';
            this.selected[3].color = 'primary';
            this.selected[4].color = 'primary';
            this.historialLogsHeaders[1].value = 'Datos[0].title';
          break;
          case 'Multimedia':
            this.selected[3].pressed = true;
            this.selected[3].text = 'black';
            this.selected[3].color = '';
            this.selected[0].color = 'primary';
            this.selected[1].color = 'primary';
            this.selected[2].color = 'primary';
            this.selected[4].color = 'primary';
          break;
          case 'PDF':
            this.selected[4].pressed = true;
            this.selected[4].text = 'black';
            this.selected[4].color = '';
            this.selected[0].color = 'primary';
            this.selected[1].color = 'primary';
            this.selected[2].color = 'primary';
            this.selected[3].color = 'primary';
            this.historialLogsHeaders[1].value = 'Datos[0].title';

          break;
        }
        await this.getUserHistorialLoagVisit();
        this.dataShow = true;
      },
      dateV(){
        let date2 = new Date(this.dateV);
        let date3 = new Date(this.dateV);
        this.dateF = new Date(date2.setDate(date2.getDate() - 1)).toISOString().substring(0,10)
        this.maxDate2 = new Date(date3.setDate(date3.getDate() - 1)).toISOString().substring(0,10)
      },
    },
    methods : {
      openDialog(id, totalI, totalN, totalP, dateF, dateV, newdata, modeindiv){
       if( modeindiv == 'general'){
       console.log('===modo general=====')
     // this.mode = 'Notas'; //predeterminado
      console.log('modo principal' , this.mode)
      this.modeindiv = modeindiv; //aquí
      console.log('modeindiv', this.modeindiv)
      this.totalI = totalI;
      this.totalN = totalN;
      this.totalP = totalP;

      //llena la grafica
      this.dataLabel.push('Páginas consultadas');
      this.dataInfo.push(totalP);
      this.dataLabel.push('Fotos consultadas');
      this.dataInfo.push(totalI);
      this.dataLabel.push('Notas consultadas');
      this.dataInfo.push(totalN);

        this.infochartpdf = [
              totalP,
              totalI,
              totalN
            ]
            this.infocharthead = [
              'Páginas consultadas',
              'Fotos consultadas',
              'Notas consultadas'
            ]
         this.general = true;

       }
       else{
      console.log('===modo individual=====')
      console.log('modeindiv', modeindiv)
         //renderizar individual
      this.general = false;
      this.dataLabel = [];
      this.dataInfo = [];
      this.modeindiv = modeindiv;
        if(modeindiv == 'Imagenes'){
          this.totalindv = totalI;
        }
        if(modeindiv == 'PDF'){
           this.totalindv = totalP;
        }
        if(modeindiv == 'Notas'){
           this.totalindv = totalN;
        }
      this.dataLabel.push(modeindiv + ' consultadas');
      this.dataInfo.push(this.totalindv);

       this.infochartpdf = [
          this.totalindv
            ]
            this.infocharthead = [
             modeindiv + ' consultadas'
            ]

            this.mode = modeindiv;

       }

        this.resetValues();
        this.dateF = new Date(this.dateF.setDate(this.dateF.getDate() - 1)).toISOString().substring(0,10);
        this.maxDate2 = new Date(this.maxDate2.setDate(this.maxDate2.getDate() - 1)).toISOString().substring(0,10);
        this._id = id;
       if(newdata == false){
        this.text1 = "";
        this.text2 = "";
        this.fechaI = null;
        this.fechaT = null;
      }else{
        this.fechaI = dateF;
        this.fechaT = dateV;
        this.text1 = "del";
        this.text2 = "al";
        this.dateV = dateV;
        this.dateD = dateF;
      }
        this.dataShow = false;
        this.dialog = true;
        this.getUser();
        this.getUserHistorialLoagVisit();


      },
      async getUser(){
        try {
        const response = await this.$axios.$get('/users/' + this._id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
         var idjob =  response.data.job;
        // console.log(idjob);
           const responsejob = await this.$axios.$get('/position/' + idjob, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
         this.userData = {
          name : response.data.name,
          email : response.data.email,
          phone : response.data.phone,
          job : responsejob.data.position
        }

        } catch (error) {
          alert(error);
        }


      },
      async getUserHistorialLoagVisit(){
            console.log('ENTRANDO AL METODO HISTORIAL');
             console.log('ENTRANDO en modo', this.mode);
      this.visitInformation = [];
        try {
          //si entro a inidividual y busca
          if(this.modeindiv != 'general'){
            console.log('entro al if this.modeindiv != general');
            this.mode = this.modeindiv;
          }
          this.dataShow = false;
          const response = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Visit',
              mode : this.mode,
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.visitInformation = response.data;
          console.log('INFORMACIÓN DE VISITAS', this.visitInformation);
         if(this.consultfecha == true){
        this.fechaI = this.dateD;
        this.fechaT = this.dateV;
        this.text1 = "del";
        this.text2 = "al";
          this.dataInfo = [];
          this.dataLabel = [];

        let totalN = 0, totalP = 0, totalI = 0;
        for(let i = 0; i < response.data.length; i++){
        if(response.data[i].mode == 'Notas')
          totalN += 1;

        if(response.data[i].mode == 'PDF')
          totalP += 1;

        if(response.data[i].mode == 'Imagenes')
          totalI += 1;
      }
          //validar si es individual o general
       if(this.modeindiv != 'general'){
      if(this.modeindiv == 'Imagenes'){
          this.totalindv = totalI;
        }
        if(this.modeindiv == 'PDF'){
           this.totalindv = totalP;
        }
        if(this.modeindiv == 'Notas'){
           this.totalindv = totalN;
        }
        this.dataLabel.push(this.modeindiv + ' consultadas');
        this.dataInfo.push(this.totalindv);

           this.infochartpdf = [
            this.totalindv
            ]
            this.infocharthead = [
             this.modeindiv + ' consultadas'
            ]
          }
          else{
            // cuando es general y general individual
           this.dataLabel.push('Páginas Consultas');
           this.dataInfo.push(totalP)
          this.dataLabel.push('Fotos Consultas');
          this.dataInfo.push(totalI)
           this.dataLabel.push('Notas Consultas');
            this.dataInfo.push(totalN)
           this.totalI = totalI;
            this.totalP = totalP;
             this.totalN = totalN;
          //case general individual
        if(this.totalP < 1 ){
          this.totalP = 'ir Pág';
        }
        if(this.totalI < 1){
          this.totalI = 'ir fotos'
        }
        if(this.totalN < 1){
            this.totalN = 'ir nota'
        }

        if(this.ifdate == true){
          this.infoimprimir = this.mode;
             switch (this.mode) {
        case 'Imagenes':
              this.infochartpdf = [
              totalI
            ]
            this.infocharthead = [
              'Fotos descargadas'
            ]
          break;
        case 'Notas':

            this.infochartpdf = [
              totalN
            ]
            this.infocharthead = [
              'Notas descargadas'
            ]
          break;
        case 'PDF':

            this.infochartpdf = [
              totalP
            ]
            this.infocharthead = [
              'Páginas descargadas'
            ]
          break;
        }
        }

          }

          }
         this.dataShow = true;
        } catch (error) {
          console.log(error.resposne)
        }

      },
      msgadvertencia(){
        this.confirm1 = true;
      },
      cleanAndClose(){
        this.dialog = false;
        this._id = null;
        this.userData = {};
        this.dataInfo = [];
        this.dataLabel = [];
        this.fechaI = null;
        this.fechaT = null;
        this.text1 = "";
        this.text2 = "";
      },
      resetValues(){
        this.dateV = new Date().toISOString().substring(0, 10);
        this.dateD = null;
        this.dateF = new Date();
        this.maxDate2 = new Date();
          this.consultfecha = false;
      },
      async findCharts(){
        this.dataShow = false;
        this.dateD = this.dateF;
        this.consultfecha = true;
        this.ifdate = true;
        await this.getUserHistorialLoagVisit();
        this.dataShow = true;
      },
      irviewDialog(idmegamedia, fechaaction ,fechapub, fechapubPDF, titlenota, imagesrc, description, descriptiopdf, mode, descnote){
        var action = 'Consulta';
        this.$refs.Viewhistorialdialogo.abrirdialog(idmegamedia, fechaaction,fechapub, fechapubPDF, titlenota, imagesrc, description, descriptiopdf, mode, descnote, action);
      },

      async modeprint(){
          switch (this.general) {
          case true:
          this.printpiechart();
            break;
            case false:
          this.printpiechartindiv(2);
            break;
        }
      },

      /* async newprintpiechart(){
             //grafica general
         var entorno = 'consulta';
             if(this.ifdate == false){
          var mode = "general"
        window.html2canvas = html2canvas;
        const canvas = await html2canvas(document.getElementById('chartshistorial'), {
          width : 900,
          height: 900
        });
        const img3 = canvas.toDataURL("image/png");
        console.log('RUTA IMG', img3);

        var title ;
        var fechag = null;
           title = 'Reporte de Consultas generales de usuario';
          if(this.fechaI != null){
           var fechag = 'del '+ this.fechaI + ' al ' + this.fechaT;
          }

         var  fechaexpedido = this.dateV;

        this.$refs.PrintindvDialog.openDialog(this.userData, this.infocharthead, this.infochartpdf, img3 , title,
        fechag, fechaexpedido, mode ,entorno);
             }else{

             }

       },*/

      async printpiechart(){
        console.log('ENTRO IMRPIMIR GENERAL');
          this.loading1 = true;
          this.DownloadInformationpdf1 = [];
          this.DownloadInformationpdf2 = [];
          this.DownloadInformationpdf3 = [];
        if(this.ifdate == false){
            setTimeout(async() => {
      this.enablePB = false;
      window.html2canvas = html2canvas;
      var doc = new jsPDF();
                let title = '';
              let descrp = '';
              let fecha = '';
              let bodyuser = [];
              let headinfochart = [];
              let infochart = [];
              let bodytableimg = [];
               let bodytablenotas = [];
                let bodytablepdf = [];
             let headtables = [['fecha de consulta','titulo','descripción']];
              let headtablenota = [['fecha de consulta','titulo']];

          console.log(this.userData);
          let data = [
            this.userData.name,
            this.userData.email,
            this.userData.phone,
            this.userData.job,
          ]
           bodyuser.push(data)
            //llenar tablas
          await this.datostablapdf();
                for( let i = 0; i < this.DownloadInformationpdf1.length; i++){
           var fechaimg = new Date(this.DownloadInformationpdf1[i].date).toISOString().substring(0,10)
            if(this.DownloadInformationpdf1[i].Datos.length > 0){
            var tituloimg = this.DownloadInformationpdf1[i].Datos[0].ImageTitle;
              var descimg = this.DownloadInformationpdf1[i].Datos[0].description;
           }else{
             var tituloimg = 'titulo no registrado';
             var descimg = 'descripción no registrado';
           }
          let dataimg = [
            fechaimg,
            tituloimg,
            descimg
          ]
          bodytableimg.push(dataimg);
          }

          for( let i = 0; i < this.DownloadInformationpdf2.length; i++){
           var fechanotas = new Date(this.DownloadInformationpdf2[i].date).toISOString().substring(0,10)
             if(this.DownloadInformationpdf2[i].Datos.length > 0){
            var tituloN = this.DownloadInformationpdf2[i].Datos[0].title;
           }
           else{
             var tituloN = 'titulo no registrado';
           }

          let datanotas = [
            fechanotas,
            tituloN
          ]
          bodytablenotas.push(datanotas);
        }

         for( let i = 0; i < this.DownloadInformationpdf3.length; i++){
           var fechapdf = new Date(this.DownloadInformationpdf3[i].date).toISOString().substring(0,10)
           if(this.DownloadInformationpdf3[i].Datos.length > 0){
            var titulopdf = this.DownloadInformationpdf3[i].Datos[0].title;
              var descpdf = this.DownloadInformationpdf3[i].Datos[0].descriptio;
           }else{
             var titulopdf = 'titulo no registrado';
             var descpdf = 'descripción no registrado';
           }
          let datapdf = [
            fechapdf,
            titulopdf,
            descpdf
          ]
          bodytablepdf.push(datapdf);
        }
        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        let usuario = response.data.email;

        infochart.push(this.infochartpdf);
        headinfochart.push(this.infocharthead);
          var fechag = '';
          title = 'Reporte de Consultas generales de usuario';
          if(this.fechaI != null){
            fechag = 'del '+ this.fechaI + ' al ' + this.fechaT;
          }
           var  fechaexpedido = this.dateV;
          const canvas = await html2canvas(document.getElementById('chartshistorial'), {
          width : 2280,
          height: 2280
        });

        const img3 = canvas.toDataURL("image/png");
        doc.addImage(img3,'JPEG', 20, 75);

            doc.text(title+ "\n" + fechag, 50, 10);
             doc.setFontSize(14);
              doc.text('Datos del usuario', 16, 30);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 32, bottom : 10 },
          head : [[ 'Reporte expedido por', 'Fecha expedición']],
          body : [[usuario, fechaexpedido]]
        });
           doc.autoTable();
          doc.text('Datos del Usuario reportado', 16, 55);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 60, bottom : 5 },
          head : [[ 'Nombre', 'Email', 'Teléfono','Trabajo']],
          body : bodyuser
        });
           doc.autoTable();
          doc.setFontSize(14);
           doc.text('Datos de la gráfica', 16, 85);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 90, bottom : 5 },
          head : headinfochart,
          body : infochart
        });

           //tablas
           if(bodytableimg.length > 0){
          doc.addPage()
          doc.setFontSize(14);
          doc.text( 'Historial de registro fotos ', 16, 15);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 20, bottom : 20 },
          head :  headtables,
          body : bodytableimg
        });
           }
          if(bodytablenotas.length > 0){
          doc.addPage();
          doc.text( 'Historial de registro de notas ', 16, 15);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 20, bottom : 20 },
          head :  headtablenota,
          body : bodytablenotas
        });
          }
          if(bodytablepdf.length > 0){
          doc.addPage();
          doc.text( 'Historial de registro de Páginas ', 16, 15);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 20, bottom : 20 },
          head :  headtables,
          body : bodytablepdf
        });
          }

          doc.save(title + ' - ' + new Date().toISOString().substring(0,10)+'.pdf');

         }, 500);

          setTimeout(async() => {
          this.enablePB = false;
          this.confirm1 = false;
          this.loading1 = false;
           }, 8000);
          console.log('TERMINO IMRPIMIR');
        }else{
            //impresiones individuales en busqueda general
        await this.printpiechartindiv(1);
        }


    },
       async printpiechartindiv(num){
       setTimeout(async() => {
      this.enablePB = false;
      window.html2canvas = html2canvas;
      var doc = new jsPDF();
              let title = '';
              let descrp = '';
              let fecha = '';
              let bodyuser = [];
              let headinfochart = [];
              let infochart = [];
              let bodytableimg = [];
               let bodytablenotas = [];
                let bodytablepdf = [];
              let headtables = [['fecha','titulo','descripción']];
          console.log(this.userData);
          let data = [
            this.userData.name,
            this.userData.email,
            this.userData.phone,
            this.userData.job,
          ]
          bodyuser.push(data)
          //llenar tablas
              if(num == 1){
                console.log('MODO IMPRIMIR GENEREAL INDV');
                var modo = this.infoimprimir;
                fecha = 'del periodo ' + this.dateD + ' al ' + this.dateV;
              }
              else{
                 console.log('MODO IMPRIMIR INDV');
                var modo = this.mode;
              if(this.fechaI != null){
                 var fechag = 'del '+ this.fechaI + ' al ' + this.fechaT;
                    }
              }

             const response1 = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Visit',
              mode : modo,
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.DownloadInformationpdf1 = response1.data;

          switch (modo) {
            case 'Imagenes':
          for( let i = 0; i < this.DownloadInformationpdf1.length; i++){
           var fechaimg = new Date(this.DownloadInformationpdf1[i].date).toISOString().substring(0,10)
            if(this.DownloadInformationpdf1[i].Datos.length > 0){
            var titulopdf = this.DownloadInformationpdf1[i].Datos[0].ImageTitle;
              var descpdf = this.DownloadInformationpdf1[i].Datos[0].description;
           }else{
             var titulopdf = 'titulo no registrado';
             var descpdf = 'descripción no registrado';
           }
          let dataimg = [
            fechaimg,
            titulopdf,
            descpdf
          ]
          bodytableimg.push(dataimg);
          }
              break;
          case 'Notas' :
               for( let i = 0; i < this.DownloadInformationpdf1.length; i++){
           var fechaimg = new Date(this.DownloadInformationpdf1[i].date).toISOString().substring(0,10)
            if(this.DownloadInformationpdf1[i].Datos.length > 0){
            var titulopdf = this.DownloadInformationpdf1[i].Datos[0].title;
              var descpdf = this.DownloadInformationpdf1[i].Datos[0].description;
           }else{
             var titulopdf = 'titulo no registrado';
             var descpdf = 'descripción no registrado';
           }
          let dataimg = [
            fechaimg,
            titulopdf,
            descpdf
          ]
          bodytableimg.push(dataimg);
          }
          break;
          case 'PDF' :
         for( let i = 0; i < this.DownloadInformationpdf1.length; i++){
           var fechaimg = new Date(this.DownloadInformationpdf1[i].date).toISOString().substring(0,10)
            if(this.DownloadInformationpdf1[i].Datos.length > 0){
            var titulopdf = this.DownloadInformationpdf1[i].Datos[0].title;
              var descpdf = this.DownloadInformationpdf1[i].Datos[0].descriptio;
           }else{
             var titulopdf = 'titulo no registrado';
             var descpdf = 'descripción no registrado';
           }
          let dataimg = [
            fechaimg,
            titulopdf,
            descpdf
          ]
          bodytableimg.push(dataimg);
          }
          }

        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        let usuario = response.data.name;

         infochart.push(this.infochartpdf);
        headinfochart.push(this.infocharthead);

          title = 'Reporte de Consultas de usuario ' + modo;

          var  fechaexpedido = this.dateV;
        const canvas = await html2canvas(document.getElementById('chartshistorial'), {
          width : 2280,
          height: 2280
        });

        const img3 = canvas.toDataURL("image/png");
        doc.addImage(img3,'JPEG', 20, 60);

        doc.text(title+ "\n"+ fecha , 50, 10);
             doc.setFontSize(14);

              doc.text('Datos del usuario', 16, 30);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 32, bottom : 10 },
          head : [[ 'Reporte expedido por', 'Fecha expedición']],
          body : [[usuario, fechaexpedido]]
        });
          doc.autoTable();
          doc.text('Datos del Usuario reportado', 16, 55);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 60, bottom : 5 },
          head : [[ 'Nombre', 'Email', 'Teléfono','Trabajo']],
          body : bodyuser
        });
         doc.autoTable();
          doc.setFontSize(14);
           doc.text('Datos de la gráfica', 16, 85);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 90, bottom : 5 },
          head : headinfochart,
          body : infochart
        });
         //tablas
          doc.addPage()
          doc.setFontSize(14);
          doc.text( 'Historial de consultas ' + modo, 16, 15);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 20, bottom : 20 },
          head :  headtables,
          body : bodytableimg
          });

          doc.save(title + ' - ' + new Date().toISOString().substring(0,10)+'.pdf');


         }, 1000);

          setTimeout(async() => {
          this.enablePB = false;
          this.confirm1 = false;
          this.loading1 = false;
           }, 3000);


    },
       async datostablapdf(){
         console.log('ENTRO PARA BUSCAR DATOS IMPRIMIR  ');
              //img
            const response1 = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Visit',
              mode : 'Imagenes',
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.DownloadInformationpdf1 = response1.data;
            console.log('DATA IMG',  this.DownloadInformationpdf1);
              //notas
             const response2 = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Visit',
              mode : 'Notas',
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.DownloadInformationpdf2 = response2.data;
          console.log('DATA NOTAS',  this.DownloadInformationpdf2);
            //pdf

             const response3 = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Visit',
              mode : 'PDF',
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.DownloadInformationpdf3 = response3.data;
          console.log('DATA PDF',  this.DownloadInformationpdf3);

      }

    }
  }
</script>

<style scoped>
.sin-padding-lat{
  padding-left: 5px;
  padding-right: 5px;
}
</style>

