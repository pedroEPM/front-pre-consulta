<template>
  <v-card>
    <v-card-title> Archivos migrados </v-card-title>
    <v-card-text>
      <v-row
        wrap
        justify="end"
      >
        <v-flex xs12 md2>
          <!-- <v-btn block color="secondary" @click="msgadvertencia()" id="screen" :disabled="enablePB"
            ><v-icon left>mdi-printer</v-icon> Imprimir</v-btn
          > -->
        </v-flex>
      </v-row>
    </v-card-text>
    <v-card-text id="chartMigr">
      <v-layout row wrap v-if="dataShow" >
        <v-flex xs12>
          <PieChart
            v-if="loading.loadingD"
            :labelsData="dataLabel"
            :valuesData="dataInfo"
            :title="'Archivos migrados'"
            :color="['#0277BD','#f87977','#262D31','#64E36D', '#64E3CE', '#A7E364']"
            :MoreDatasets="undefined"
          />
        </v-flex>
      </v-layout>
    </v-card-text>

    <LoaderCard v-show="!dataShow" />
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
          <v-btn color="primary" @click="print()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import PieChart from '~/components/charts/barChart.vue';
  import LoaderCard from "~/components/LoaderCard";

  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';

export default {
  components : {
    PieChart,
    LoaderCard,
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

      selected: [
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary'},
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
        { pressed: false, text: "black", color: 'primary' },
      ],
      userTableHeaders : [
        { text : 'Usuario', value : 'name' },
        { text : 'Notas consultadas', value : 'totalN', align: 'center'},
        { text : 'Busqueda de páginas', value : 'totalP', align: 'center'},
        { text : 'Fotos', value : 'totalI', align: 'center'}
      ],
      userTable : [],
      dataInfo : [],
      dataLabel : [],

      enablePB : false,

      moreDatasets : [
        {
          label : 'Páginas',
          minBarLength: 2,
          backgroundColor: '#0277BD',
        },
        {
          label : 'Fotos',
          backgroundColor: '#f87977',
        },
        {
          label : 'Notas',
          backgroundColor: '#262D31',
        },
        {
          label : 'Páginas migradas',
          backgroundColor: '#64E36D',
        },
        {
          label : 'Fotos migradas',
          backgroundColor: '#64E3CE',
        },
        {
          label : 'Notas migradas',
          backgroundColor: '#A7E364',
        },
      ]

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
        await this.getUserActivity();
      }
      this.dataShow = true;

    }
  },
  watch : {
    dateV(){
      let date2 = new Date(this.dateV);
      let date3 = new Date(this.dateV);
      this.dateF = new Date(date2.setDate(date2.getDate() - 1)).toISOString().substring(0,10)
      this.maxDate2 = new Date(date3.setDate(date3.getDate() - 1)).toISOString().substring(0,10)
    },
    async mode( newvalue ){
      this.dataShow = false;
      this.userTableHeaders = [];
      this.userTableHeaders[0] = { text : 'Usuario', value : 'name' };
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
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Fotos', value : 'totalI', align: 'center', };
        break;
        case 'Notas':
          this.selected[2].pressed = true;
          this.selected[2].text = 'black';
          this.selected[2].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[3].color = 'primary';
          this.selected[4].color = 'primary';
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Notas consultadas', value : 'totalN', align: 'center' }
        break;
        case 'Multimedia':
          this.selected[3].pressed = true;
          this.selected[3].text = 'black';
          this.selected[3].color = '';
          this.selected[0].color = 'primary';
          this.selected[1].color = 'primary';
          this.selected[2].color = 'primary';
          this.selected[4].color = 'primary';
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
          this.chooseType = false;
          this.userTableHeaders[1] = { text : 'Busqueda de páginas', value : 'totalP', align: 'center' } ;
        break;
      }
      await this.getUserActivity();
      this.dataShow = true;
    }
  },
  methods : {
     async getUserActivity(){

      this.loading.loadingV = false;
      this.dataInfo = [];
      this.dataLabel = [];
      const response = await this.$axios.$get('/chartsCount',{
        // params : {
        //   date : this.dateV,
        //   date2 : this.dateD,
        //   mode : this.mode,
        // },
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });
      this.dataLabel.push('Páginas');
      this.dataInfo.push(response.data.pdfs)
      this.dataLabel.push('Fotos');
      this.dataInfo.push(response.data.images)
      this.dataLabel.push('Notas');
      this.dataInfo.push(response.data.notes)

      this.dataLabel.push('Páginas migradas');
      this.dataInfo.push(967661);
      this.dataLabel.push('Fotos migradas');
      this.dataInfo.push(1108922);
      this.dataLabel.push('Notas migradas');
      this.dataInfo.push(1914371);


      // console.log(this.dataInfo)
      // console.log(this.dataLabel)

      this.loading.loadingV = true;
    },

    async findCharts(){
      this.dataShow = false;
      this.dateD = this.dateF;
      await this.getUserActivity();
      this.dataShow = true;
    },
      msgadvertencia(){
        this.confirm1 = true;
      },
    async print(){
      //this.goToPagetop();
      this.loading1 = true;
      setTimeout(async() => {
        this.enablePB = true;
        const doc = new jsPDF('landscape');
        let title = '';
        let headmigrate = [];
        let datamigrate = [];

      headmigrate.push(this.dataLabel);
      datamigrate.push(this.dataInfo);

          const response = await this.$axios.$get('/adminsById/' + localStorage.user_id ,{
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        let usuario = response.data.email;

        title = 'Reporte de Archivos migrados';
         var  fechaexpedido = this.dateV;
        const canvas = await html2canvas(document.getElementById('chartMigr'), {
          width : 2280,
          height: 2280
        });

        const img3 = canvas.toDataURL("image/png");

        doc.addImage(img3,'JPEG', 5, -135, 410, 350);
        doc.text(title, 80, 10);
          doc.setFontSize(14);
              doc.text('Datos del usuario', 16, 25);
          doc.autoTable({
          theme: 'plain',
          margin : { top : 30, bottom : 10 },
          head : [[ 'Reporte expedido por', 'Fecha expedición']],
          body : [[usuario, fechaexpedido]]
        });
          doc.autoTable();
          doc.setFontSize(14);
          doc.text( 'Datos de la gráfica de archivos migrados', 16, 60);
           doc.autoTable();
          doc.autoTable({
          theme: 'striped',
          margin : { top : 90, bottom : 20 },
          head :  headmigrate,
          body : datamigrate
        });

        this.enablePB = false;
        doc.save(title + ' - ' + new Date().toISOString().substring(0,10));
      }, 1000);

        setTimeout(async() => {
          this.enablePB = false;
          this.confirm1 = false;
          this.loading1 = false;
           }, 4000);
    },

  }
}
</script>

<style>

</style>
