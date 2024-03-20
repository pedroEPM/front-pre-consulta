<template>
  <v-card max-height="610">
    <v-card-title> Estadísticas de uso </v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex v-if="false">
          <v-btn block large @click="mode = 'Usuarios', showInformation = false, fileId = null"
              :color="selected[0].color"
            ><v-icon left>mdi-account</v-icon>Usuarios</v-btn
          >
        </v-flex>

        <v-flex>
          <v-btn block large @click="mode = 'Imagenes', showInformation = false, fileId = null"
              :depressed="selected[1].pressed"
              :color="selected[1].color"
            ><v-icon left>mdi-image</v-icon>
            Imagenes
          </v-btn>
        </v-flex>

        <v-flex>
          <v-btn block large @click="mode = 'Notas', showInformation = false, fileId = null"
              :color="selected[2].color"
            ><v-icon left>mdi-newspaper-variant-outline</v-icon>Notas</v-btn
          >
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

        <v-flex>
          <v-btn block large
            :color="selected[5].color"
            ><v-icon left>mdi-chart-line</v-icon>Graficas</v-btn
          >
        </v-flex>

      </v-layout>
    </v-card-text>

    <v-card-text v-if="!chooseType">
      <v-layout row wrap>
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
                label="Elija fecha inicial"
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
                label="Elija fecha final"
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
        <v-flex xs12 md2>
          <!-- <v-btn block color="secondary" @click="msgadvertencia()" id="screen" :disabled="enablePB"
            ><v-icon left>mdi-printer</v-icon> Imprimir</v-btn
          > -->
        </v-flex>
        <v-flex xs12 md2>
          <v-btn block color="primary" @click="findCharts()"
            ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
          >
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="showInformation">
        <v-flex xs12 md12>
          <v-card flat>
            <v-card-title>Título : {{ title }} </v-card-title>
            <v-card-text class="text-right">
              <h3>Total de descargas: {{ totalDownload }}</h3>
              <v-spacer />
              <h3>Total de visitas: {{ totalVisit }}</h3>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="dataShow" id="charttest">
        <v-flex xs12 md6 id="chartstatics1" fill-height>
          <BarChart
            id="directochart"
            v-if="loading.loadingV"
            :labelsData="dataLabelsV"
            :valuesData="dataDataV"
            :title="'Visitas diarías'"
            :color="['#0277BD','#32607A','#02E0BA','#E4523B','#AD1319']"
            :MoreDatasets="undefined"
          />
        </v-flex>
        <!--:color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"-->
        <!--:color=":color="['#a33a16','#227c0f','#49189f','#0277BD','#f87977','#d7d6c3']"-->
        <v-flex xs12 md6 id="Charts2" fill-height>
          <BarChart
            v-if="loading.loadingD"
            :labelsData="dataLabelsD"
            :valuesData="dataDataD"
            :title="'Descargas diarías'"
            :color="['#f87977','#7A3332','#E002D4','#AAE43B','#ADAD13']"
            :MoreDatasets="undefined"
          />
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-card-text v-if="chooseType">
      <CAGUserDialog />
    </v-card-text>
    <LoaderCard v-show="!dataShow" />
    <PrintotherChartsDialog ref="PrintotherChartsDialog" />
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
          <v-btn color="primary" @click="printbarraschart()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>

  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';

  import BarChart from '~/components/charts/barChart';
  import LoaderCard from "~/components/LoaderCard";
  import CAGUserDialog from '~/components/chartsAndGraphics/CAGUserDialog';
   import PrintotherChartsDialog from '~/components/chartsAndGraphics/PrintotherChartsDialog.vue'
export default {
  components : {
    BarChart,
    LoaderCard,
    CAGUserDialog,
    PrintotherChartsDialog
  },
  data(){
    return {
      loading1 : false,
      confirm1 : false,
      menu1 : false,
      menu2 : false,
      dataShow : false,
      newdata : false,
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
      dataLabelsV: [],
      dataDataV: [],
      dataLabelsD: [],
      dataDataD: [],

      selected: [
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary'},
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
      ],
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
        this.getData();
        this.showInformation = true;
      }else{
        await this.getVisitForDay();
        await this.getDownloadForDay();
      }
      this.dataShow = true;

    }
  },
  watch : {
    dateV(){
      let date2 = new Date(this.dateV);
      let date3 = new Date(this.dateV);
      //this.dateF =
      //this.dateF = new Date(date2.setDate(date2.getDate() - 1)).toISOString().substring(0,10)
      //this.maxDate2 = new Date(date3.setDate(date3.getDate() - 1)).toISOString().substring(0,10)
    },
    async mode( newvalue ){
      this.dataShow = false;
      switch( newvalue ){
        case 'Usuarios':
          this.selected[0].pressed = true;
          this.selected[0].text = 'black';
          this.selected[0].color = '';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
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
          this.selected[5].color = 'primary';
          this.chooseType = false;
        break;
        case 'Notas':
          this.selected[2].pressed = true;
          this.selected[2].text = 'black';
          this.selected[2].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
          this.chooseType = false;
        break;
        case 'Multimedia':
          this.selected[3].pressed = true;
          this.selected[3].text = 'black';
          this.selected[3].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[4].color = 'primary';
          this.selected[5].color = 'primary';
          this.chooseType = false;
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
          this.chooseType = false;
        break;
        case 'Graficas':
          this.selected[5].pressed = true;
          this.selected[5].text = 'black';
          this.selected[5].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.chooseType = false;
        break;
      }
      await this.getVisitForDay();
      await this.getDownloadForDay();
      this.dataShow = true;
    }
  },
  methods : {
     async getVisitForDay(){
      this.enablePB = true;

      this.loading.loadingV = false;
      this.dataLabelsV = [];
      this.dataDataV = [];
      const response = await this.$axios.$get('/chartFiles',{
        params : {
          date : this.dateV,
          date2 : this.dateD,
          fileType: 'Visit',
          mode : this.mode,
          fileId : this.fileId
        },
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });

      for(let i = 0; i < response.data.length; i++){
        this.dataLabelsV.push(response.data[i].fecha);
        this.dataDataV.push(response.data[i].value)
      }


      this.loading.loadingV = true;
      this.enablePB = false;

    },
    async getDownloadForDay(){
      this.enablePB = true;

      this.dataLabelsD = [];
      this.dataDataD = [];
      this.loading.loadingD = false;
      const response = await this.$axios.$get('/chartFiles',{
        params : {
          date : this.dateV,
          date2 : this.dateD,
          fileType : 'Download',
          mode : this.mode,
          fileId : this.fileId

        },
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });

      for(let i = 0; i < response.data.length; i++){
        this.dataLabelsD.push(response.data[i].fecha);
        this.dataDataD.push(response.data[i].value)
      }

      this.loading.loadingD = true;
      this.enablePB = false;

    },
    async getPDF(){
      const response = await this.$axios.$get("/pdfs/" + this.fileId, {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.title = response.data.title.substring(0,50);
    },
    async getNote(){
      const response = await this.$axios.$get('/notes/'+ this.fileId, {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.title = response.data.note.title;
    },
    async getImage() {
      const response = await this.$axios.$get("/images/" + this.fileId, {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.title = response.data.ImageTitle;
    },
    getData(){
      switch(this.mode){
        case 'Notas':
          this.getNote();
        break;
        case 'Imagenes':
          this.getImage();
        break;
        case 'PDF':
          this.getPDF();
        break;
      }
      this.getTotalDownloadById();
      this.getTotalVisitById();
    },
    async getTotalDownloadById(){
      const response  = await this.$axios.$get('/chartFile/', {
        params : {
          fileId : this.fileId,
          fileType : 'Download',
        },
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.totalDownload = response.data.length;
    },
    async getTotalVisitById(){
      const response  = await this.$axios.$get('/chartFile/', {
        params : {
          fileId : this.fileId,
          fileType : 'Visit',
        },
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      console.log(response.data.length)
      this.totalVisit = response.data.length;
    },
    async findCharts(){
      this.dataShow = false;
      this.dateD = this.dateF;
      this.newdata = true;
      await this.getVisitForDay();
      await this.getDownloadForDay();
      this.dataShow = true;
    },
    msgadvertencia(){
        this.confirm1 = true;
      },
       /* async irprintnewother(){
        //grafica
      window.html2canvas = html2canvas;
        const canvas = await html2canvas(document.getElementById('chartstatics1'), {
          width : 900,
          height: 900
        });
        const img3 = canvas.toDataURL("image/png");

         window.html2canvas = html2canvas;
        const canvasw = await html2canvas(document.getElementById('Charts2'), {
          width : 900,
          height: 900
        });
        const img4 = canvasw.toDataURL("image/png");

        var title = '';
        var fecha = '';

          if(this.mode){
          title = 'Estadísitcas de uso de ' + this.mode;
        }else{
          title = 'Estadísticas de uso general';
        }
           if(this.newdata == true){
                fecha = 'del ' + this.dateD + ' al ' + this.dateV;
        }

          var  fechaexpedido = this.dateV;
          console.log('SOLICITUD PARA IMPRIMIR', title, fecha, fechaexpedido)
       this.$refs.PrintotherChartsDialog.openDialog(title, fecha, img3, img4, fechaexpedido);
      },*/
      //codigo anterior print
    async printbarraschart(){
      this.loading1 = true;
      this.enablePB = true;
      setTimeout(async() => {
        const doc = new jsPDF('landscape');
        let title = '';
        let fecha = '';
        let headdateV = []
        let datavisitV = [];
        let headdateD = []
        let datavisitD = [];

        headdateV.push(this.dataLabelsV);
        datavisitV.push(this.dataDataV);

        headdateD.push(this.dataLabelsD);
        datavisitD.push(this.dataDataD);
        const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        let usuario = response.data.email;
        if(this.mode){
          title = 'Estadísitcas de uso de ' + this.mode;
        }else{
          title = 'Estadísticas de uso general';
        }
           if(this.newdata == true){
                fecha = 'del ' + this.dateD + ' al ' + this.dateV;
              }
         var  fechaexpedido = this.dateV;
        const canvas = await html2canvas(document.getElementById('charttest'), {
          width : 2280,
          height: 2280
        });

        const img3 = canvas.toDataURL("image/png");

        doc.addImage(img3,'JPEG', 5, -60, 410, 350);

        doc.text(title +"\n" + fecha , 80, 10);
            doc.setFontSize(14);
          doc.text('Datos del usuario', 16, 30);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 40, bottom : 10 },
          head : [[ 'Reporte expedido por', 'Fecha expedición']],
          body : [[usuario, fechaexpedido]]
        });
        /*doc.autoTable();
          doc.setFontSize(14);
          doc.text('Gráfica de ' + title, 16, 70);*/
          doc.autoTable();
          doc.setFontSize(14);
          doc.text( 'datos de la gráfica visitas', 16, 65);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 96, bottom : 20 },
          head :  headdateV,
          body : datavisitV
        });
        doc.autoTable();
         doc.setFontSize(14);
          doc.text( 'datos de la gráfica descargas', 16, 95);
          doc.autoTable({
          theme: 'striped',
          margin : { top : 105, bottom : 20 },
          head :  headdateD,
          body : datavisitD
        });
        this.enablePB = false;
        doc.save(title + ' - ' + new Date().toISOString().substring(0,10));
      }, 1000);

          setTimeout(async() => {
          this.enablePB = false;
          this.confirm1 = false;
          this.loading1 = false;
           }, 5500);
    },

  }
}
</script>

<style>

</style>
