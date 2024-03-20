<template>
  <v-card>
    <v-card-title> Reporte general de descargas </v-card-title>
    <v-card-text>
         <v-layout row wrap>
                <v-flex>
          <v-btn block large @click="mode = null, showInformation = false, fileId = null"
              :color="selected[0].color"
            ><v-icon left>mdi-chart-pie</v-icon>General</v-btn
          >
        </v-flex>
        <v-flex v-if="false">
          <v-btn block large @click="mode = 'Usuarios', showInformation = false, fileId = null"
              :color="selected[1].color"
            ><v-icon left>mdi-account</v-icon>Usuarios</v-btn
          >
        </v-flex>

        <v-flex>
          <v-btn block large @click="mode = 'Imagenes', showInformation = false, fileId = null"
              :depressed="selected[2].pressed"
              :color="selected[2].color"
            ><v-icon left>mdi-image</v-icon>
            Imagenes
          </v-btn>
        </v-flex>

        <v-flex>
          <v-btn block large @click="mode = 'Notas', showInformation = false, fileId = null"
              :color="selected[3].color"
            ><v-icon left>mdi-newspaper-variant-outline</v-icon>Notas</v-btn
          >
        </v-flex>

        <v-flex>
          <v-btn block large @click="mode = 'PDF', showInformation = false, fileId = null"
            :color="selected[4].color"
            ><v-icon left>mdi-file</v-icon>Páginas</v-btn
          >
        </v-flex>

    <!---    <v-flex>
          <v-btn block large
            :color="selected[5].color"
            ><v-icon left>mdi-video-box</v-icon>Multimedia</v-btn
          >
        </v-flex> --->

     <!---   <v-flex>
          <v-btn block large
            :color="selected[6].color"
            ><v-icon left>mdi-chart-line</v-icon>Graficas</v-btn
          >
        </v-flex>  ---->
      </v-layout>
    </v-card-text>
    <v-card-text v-if="!chooseType">
      <v-layout row wrap>

        <v-flex xs12 md4>

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
                label="Elija fecha Inicial"
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
        <v-flex xs12 md4>
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
                label="Elija fecha Final"
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
          <!-- <v-btn block color="secondary" @click="irprintnew()" id="screen" :disabled="enablePB"
            ><v-icon left>mdi-printer</v-icon> Imprmir</v-btn
          > -->
        </v-flex>
        <v-flex xs12 md2>
          <v-btn block color="primary" @click="findCharts()"
            ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
          >
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="dataShow" >
        <v-flex xs12 v-if="modeindiv == 'general'" md4 id="chartsD">
          <PieChart
            v-if="loading.loadingD"
            :labelsData="dataLabel"
            :valuesData="dataInfo"
            :title="'Entradas'"
            :color="piecolor"
          />
        </v-flex>
        <v-flex xs12  :md8="modeindiv == 'general'"
        :md11="modeindiv != 'general'">
      <v-card outlined>
    <v-card-title>
      Descargas
      <v-spacer></v-spacer>
      <v-text-field
      v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details>
      </v-text-field>
    </v-card-title>
        <v-data-table
            dense
            :headers="userTableHeaders"
            :items="userTable"
            :items-per-page="15"
            :search="search"
          >
             <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon @click="$refs.DownloadHistorialDialog.openDialog(item.userId, item.totalI, item.totalN, item.totalP, dateF, dateV, newdata, modeindiv )">
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </template>
          </v-data-table>
             </v-card>
          <v-layout row>
            <v-flex><label>{{dataLabel[0]}}: {{dataInfo[0]}}</label></v-flex>
            <v-flex><label>{{dataLabel[1]}}: {{dataInfo[1]}}</label></v-flex>
            <v-flex><label>{{dataLabel[2]}}: {{dataInfo[2]}}</label></v-flex>
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
          <v-btn color="primary" @click="printpiechart()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>

    <LoaderCard v-show="!dataShow" />
    <DownloadHistorialDialog ref="DownloadHistorialDialog" />
    <PrintGeneralDialog ref="PrintGeneralDialog" />
  </v-card>
</template>

<script>
  import PieChart from '~/components/charts/pieChart';
  import LoaderCard from "~/components/LoaderCard";
  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import DownloadHistorialDialog from '~/components/chartsAndGraphics/DownloadHistorialDialog';
    import PrintGeneralDialog from '~/components/chartsAndGraphics/PrintGeneralDialog.vue'
export default {
  components : {
    PieChart,
    LoaderCard,
    DownloadHistorialDialog,
    PrintGeneralDialog
  },
  data(){
    return {
      modeindiv : 'general',
      search:'',
      loading1 : false,
      confirm1 : false,
      piecolor : ['#f87977','#7A3332','#E002D4','#AAE43B','#ADAD13'],
      newdata : false,
      menu1 : false,
      menu2 : false,
      dataShow : false,
       infochartpdf : [],
      infocharthead : [],
      loading : {
        loadingV : true,
        loadingD : true,
      },
      chooseType : false,
      mode : null,
      fileId: null,
      showInformation : false,
      title : null,
      totalDownload : null,
      totalVisit : null,
      minDate: "1864-01-01",
      maxDate: new Date().toISOString().substring(0,10),
      dateV : new Date().toISOString().substring(0, 10),
      dateD : null,
      dateF : new Date(),
      maxDate2 : new Date(),

      selected: [
       { pressed: true, text: "black", color: ''},
        { pressed: false, text: "black", color: 'primary'},
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
         { pressed: false, text: "black", color: 'primary' },
      ],
      userTableHeaders : [
        { text : 'Usuario', value : 'name' },
        { text : 'Notas Descargadas', value : 'totalN', align: 'center'},
        { text : 'Páginas Descargadas', value : 'totalP', align: 'center'},
        { text : 'Fotos Descargadas', value : 'totalI', align: 'center'},
        { text: "Ver historial", value: "actions", width: '25%', sortable: false },
      ],
      userTable : [],
      dataInfo : [],
      dataLabel : [],

      enablePB : false,

    }
  },
  async created(){
    if(process.browser){
      this.dateF = new Date(this.dateF.setDate(this.dateF.getDate() - 1)).toISOString().substring(0,10)
      this.maxDate2 = new Date(this.maxDate2.setDate(this.maxDate2.getDate() - 1)).toISOString().substring(0,10)
      this.dataShow = false;
      if(this.$route.query.content != undefined ){
        this.fileId = JSON.parse(atob(this.$route.query.content));
        this.mode = this.$route.query.mode;
        this.showInformation = true;
      }else{

        await this.getUserDownload();
      }
      this.dataShow = true;

    }
  },
  watch : {
    dateV(){
      let date2 = new Date(this.dateV);
      let date3 = new Date(this.dateV);
      //this.dateF = new Date(date2.setDate(date2.getDate() - 1)).toISOString().substring(0,10)
      //this.maxDate2 = new Date(date3.setDate(date3.getDate() - 1)).toISOString().substring(0,10)
    },
    async mode( newvalue ){
      this.dataShow = false;
      this.userTableHeaders = [];
      this.userTableHeaders[0] = { text : 'Usuario', value : 'name' };
      switch( newvalue ){
           case null:
          this.selected[0].pressed = true;
          this.selected[0].text = 'black';
          this.selected[0].color = '';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = false;
          this.userTableHeaders[1] =   { text : 'Notas Consultadas', value : 'totalN', align: 'center'};
          this.userTableHeaders[2] =   { text : 'Busqueda de páginas', value : 'totalP', align: 'center'};
          this.userTableHeaders[3] =   { text : 'Fotos Consultadas', value : 'totalI', align: 'center'};
          this.userTableHeaders[4] =  { text: "Ver historial", value: "actions", width: '25%', sortable: false };
          this.modeindiv = 'general';
        break;
        case 'Usuarios':
          this.selected[1].pressed = true;
          this.selected[1].text = 'black';
          this.selected[1].color = '';
          this.selected[0].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = true;
        break;
        case 'Imagenes':
          this.selected[2].pressed = true;
          this.selected[2].text = 'black';
          this.selected[2].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Fotos Consultadas', value : 'totalI', align: 'center', };
          this.userTableHeaders[2] =  { text: "Ver historial", value: "actions", width: '25%', sortable: false };
          this.modeindiv = 'Imagenes';
        break;
        case 'Notas':
          this.selected[3].pressed = true;
          this.selected[3].text = 'black';
          this.selected[3].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Notas consultadas', value : 'totalN', align: 'center' }
          this.userTableHeaders[2] =  { text: "Ver historial", value: "actions", width: '25%', sortable: false };
          this.modeindiv = 'Notas';
        break;
                case 'PDF':
          this.selected[4].pressed = true;
          this.selected[4].text = 'black';
          this.selected[4].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[5].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Busqueda de páginas', value : 'totalP', align: 'center' } ;
          this.userTableHeaders[2] =  { text: "Ver historial", value: "actions", width: '25%', sortable: false };
          this.modeindiv = 'PDF';
        break;
        case 'Multimedia':
          this.selected[5].pressed = true;
          this.selected[5].text = 'black';
          this.selected[5].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
           this.selected[6].color = 'primary';
          this.chooseType = false;
        break;
         case 'Graficas':
          this.selected[6].pressed = true;
          this.selected[6].text = 'black';
          this.selected[6].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
           this.selected[5].color = 'primary';
          this.chooseType = false;
        break;
      }
      await this.getUserDownload();
      this.dataShow = true;
    }
  },
  methods : {
     async getUserDownload(){
      this.enablePB = true;
      this.loading.loadingV = false;
      this.dataInfo = [];
      this.dataLabel = [];
       this.piecolor = [];
      const response = await this.$axios.$get('/chartFiles/download',{
        params : {
          date : this.dateV,
          date2 : this.dateD,
          mode : this.mode,
        },
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.userTable = response.data;

      let totalN = 0, totalP = 0, totalI = 0;
      for(let i = 0; i < response.data.length; i++){

        if(response.data[i].totalN)
          totalN += response.data[i].totalN;

        if(response.data[i].totalP)
          totalP += response.data[i].totalP;

        if(response.data[i].totalI)
          totalI += response.data[i].totalI

      }

      switch (this.mode) {
        case null:
      this.piecolor.push('#f87977','#7A3332','#E002D4','#AAE43B','#ADAD13');
      this.dataLabel.push('Páginas descargadas');
      this.dataInfo.push(totalP)
      this.dataLabel.push('Fotos descargadas');
      this.dataInfo.push(totalI)
      this.dataLabel.push('Notas descargadas');
      this.dataInfo.push(totalN)
            //para imprimir pdf
          this.infochartpdf = [
              totalP,
              totalI,
              totalN
            ]
            this.infocharthead = [
              'Páginas descargadas',
              'Fotos descargadas',
              'Notas descargadas'
            ]
          break;
        case 'Imagenes':
          this.piecolor.push('#f87977');
      this.dataLabel.push('Fotos descargadas');
      this.dataInfo.push(totalI);
                this.infochartpdf = [
              totalI
            ]
            this.infocharthead = [
              'Fotos descargadas'
            ]
          break;
        case 'Notas':
          this.piecolor.push('#262D31');
      this.dataLabel.push('Notas descargadas');
      this.dataInfo.push(totalN)
          this.infochartpdf = [
              totalN
            ]
            this.infocharthead = [
              'Notas descargadas'
            ]
          break;
        case 'PDF':
      this.piecolor.push('#0277BD');
       this.dataLabel.push('Páginas descargadas');
      this.dataInfo.push(totalP)
             this.infochartpdf = [
              totalP
            ]
            this.infocharthead = [
              'Páginas descargadas'
            ]
          break;
      }

      this.loading.loadingV = true;
      this.enablePB = false;

    },

    async findCharts(){
      this.dataShow = false;
      this.dateD = this.dateF;
      this.newdata = true;
      await this.getUserDownload();
      this.dataShow = true;
    },
    msgadvertencia(){
        this.confirm1 = true;
      },
        async irprintnew(){
        //grafica
         var img3 = '';
        var entorno = 'descarga';
            if(this.modeindiv == 'general'){
           window.html2canvas = html2canvas;
        const canvas = await html2canvas(document.getElementById('chartsD'), {
          width : 900,
          height: 900
        });
          img3 = canvas.toDataURL("image/png");
        console.log('RUTA IMG', img3);
            }else{
            img3 = 'nocanva';
             console.log('=====================', img3);
            }


        var title ;
        var fecha;
          if(this.mode){
          title = 'Reporte de Descargas de ' + this.mode;
            }else{
          title = 'Reporte de Descargas generales';
          }
              if(this.newdata == true){
                fecha = 'del periodo ' + this.dateD + ' al ' + this.dateV;
              }

         var  fechaexpedido = this.dateV;
       this.$refs.PrintGeneralDialog.openDialog(this.dataLabel, this.dataInfo, this.userTableHeaders, this.userTable, img3 , title,
        fecha, fechaexpedido, this.modeindiv,entorno);
      },

   async printpiechart(){
      this.loading1 = true;
      setTimeout(async() => {

      this.enablePB = false;
      window.html2canvas = html2canvas;
      var doc = new jsPDF();
             let title = '';
              let descrp = '';
              let fecha = '';
              let body = [];
              let head = [];
              let headinfochart = [];
              let infochart = [];

          for( let i = 0; i < this.userTable.length; i++){
          let data = [
            this.userTable[i].name,
            this.userTable[i].totalN,
            this.userTable[i].totalP,
            this.userTable[i].totalI,
          ]
          body.push(data)
        }

        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        let usuario = response.data.email;

       infochart.push(this.infochartpdf);
        headinfochart.push(this.infocharthead);

                   if(this.mode){
          title = 'Reporte de Descargas de ' + this.mode;
            }else{
          title = 'Reporte de Descargas generales';
          }
              if(this.newdata == true){
                fecha = 'del periodo ' + this.dateD + ' al ' + this.dateV;
              }
             var  fechaexpedido = this.dateV;
          var canvas = document.getElementById('chartsD');
          html2canvas(canvas).then(function(canvas){
            doc.text(title+ "\n"+ fecha, 50, 10);
             doc.setTextColor(100)
            doc.setFontSize(14);
              doc.text('Datos del usuario', 16, 30);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 32, bottom : 10 },
          head : [[ 'Expedido por', 'fecha expedición']],
          body : [[usuario, fechaexpedido]]
           });
          doc.autoTable();
            doc.setFontSize(14);
           doc.text('Datos de la gráfica', 16, 58);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 65, bottom : 5 },
          head : headinfochart,
          body : infochart
        });

          var imgData = canvas.toDataURL('image/png');
           doc.setFontSize(14);
          doc.text('', 16, 88);
          doc.addImage(imgData,'JPEG',35,75);
            //tabla
          doc.addPage()
        doc.setFontSize(14);
        doc.text( 'Datos: '+ title, 16, 10);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 20, bottom : 20 },
          head :  [[ 'Usuario', 'Notas descargadas', 'Páginas descargadas', 'Fotos descargadas' ]],
          body : body
        });
          doc.save(title + ' - ' + new Date().toISOString().substring(0,10)+'.pdf');
        })
         }, 1000);

          setTimeout(async() => {
          this.enablePB = false;
          this.confirm1 = false;
          this.loading1 = false;
           }, 3000);

    },

  }
}
</script>

<style>

</style>
