<template>
  <div class="imgimprimir" >
    <v-dialog width="700px" v-model="dialogimprimir">
      <v-card>
        <div id="imchart">
        <v-card-tittle style="padding-top:15px">
           <center><h3>{{tittle}}</h3></center>
        </v-card-tittle>
          <v-card-text>
            <v-container>
                 <v-row>
          <v-col>
           <div class="fecha">{{fecha}}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <h3>Grafica en test</h3>
              <h4>{{descrp}}</h4>
            </div>
            <div id="charts4">
          <PieChart
            v-if="loading.loadingD"
            :labelsData="dataLabel"
            :valuesData="dataInfo"
            :title="'Entradas'"
            :color="piecolor"
          />
            </div>
          </v-col>
        </v-row>
         <v-row>
          <v-col>
             <v-data-table
            dense
            :headers="userTableHeaders"
            :items="userTable"
            :items-per-page="15"
          >
          </v-data-table>
          </v-col>
        </v-row>
            </v-container>
          </v-card-text>
        </div>
          <v-card-actions>
           <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogimprimir = false"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="primary"
            @click="imprimir()"
          >
            Imprimir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import PieChart from '~/components/charts/pieChart.vue';
export default {
    components : {
    PieChart,
  },
  data(){
    return{
      dialogimprimir: false,
      tittle:null,
      fecha: null,
      descrp: null,
      userTableHeaders: [],
      userTable:[],
      dataInfo: null,
      dataLabel: null,
      piecolor: null,
       loading : {
        loadingV : true,
        loadingD : true,
      },

    }
  },
  methods:{
    abrirdialog(tittle,fecha,descrp,userTableHeaders, userTable,  dataInfo, dataLabel,  piecolor){
        this.tittle = tittle;
      this.fecha = fecha;
      this.descrp = descrp;
       this.userTableHeaders  = userTableHeaders;
      this.userTable = userTable;
      this.dataInfo = dataInfo;
      console.log(this.dataInfo);
      this.dataLabel = dataLabel;
      console.log(this.dataLabel);
      this.piecolor = piecolor;
       console.log(this.piecolor);
       this.dialogimprimir = true;
    },
    imprimir(){
         window.html2canvas = html2canvas;
      var doc = new jsPDF();
       var title = this.tittle;
          var canvas = document.getElementById('imchart');
          html2canvas(canvas).then(function(canvas){
          var imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData,'PNG',10,10);
          doc.save(title + ' - ' + new Date().toISOString().substring(0,10)+'.pdf');
        })
  }
  }
}
</script>
<style scoped>
.imgimprimir{
  margin-top: 10px;
}
.fecha{
  font-size: 15px;
}
</style>
