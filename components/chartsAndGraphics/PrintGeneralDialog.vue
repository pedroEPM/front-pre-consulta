<template>
  <v-container>
    <v-dialog v-model="confirm1" max-width="300" persistent>
      <v-card >
        <v-card-title>Mensaje</v-card-title>

        <v-card-text>
          <h3>¿Quieres generar el reporte de consultas"?</h3>
          <!-- <h3>¿Quieres generar el reporte de "{{ titulo }}"?</h3> -->
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn outlined @click="confirm1 = false">Cancelar</v-btn>
          <v-btn color="primary" @click="generateReport()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <!----encerrar en un dialogo a ver---->
    <v-dialog v-model="renderimp" max-width="300">
       <v-card :loading="loading1">
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <center> Mensaje</center>
            </v-col>
              <v-col>
                <a v-if="generate" @click="cerrar()">X</a>
            </v-col>
            </v-row>

        </v-card-title>
        <v-card-text  v-if="loading1"> Cargando archivo... </v-card-text>
        <v-card-text>
         <v-card-text v-if="generate">
          <h3>PDF Generado.</h3>
        </v-card-text>
         </v-card-text>
      </v-card>
      <div>
      <client-only>
        <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="false"
          :preview-modal="true"
          :paginate-elements-by-height="1400"
          :filename="titulodoc"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          pdf-orientation="portrait"
          pdf-content-width="800px"

          @hasStartedGeneration="hasStartedGeneration()"
          @hasGenerated="hasGenerated($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content">
            <div>
              <v-row>
                <v-col cols="9">
                <center>
                <h3>{{ titulo }}</h3>
                <h4>{{ ifecha }}</h4>
              </center>
                </v-col>
                <v-col>
                <img
              src="https://megateca.megamedia.com.mx/pre-consulta/pre-consulta/logo_mega.png"
              width="120"
              style="padding-right:20px"
             />
                </v-col>
              </v-row>

            </div>
            <br />
            <div style="padding-left: 20px; padding-top: 20px">
              <h4>Datos del usuario</h4>
              <div>
                <v-row>
                  <v-col cols="6">
                    <div style="padding: 1px">
                      <center>
                        <h5 style="color: grey">Expedido por:</h5>
                        <p
                          style="font-size: 16px; font-weight: 500; color: gray"
                        >
                          {{ usuario }}
                        </p>
                      </center>
                    </div>
                  </v-col>
                  <v-col>
                    <div style="padding: 1px">
                      <center>
                        <h5 style="color: grey">Fecha de expedición:</h5>
                        <p
                          style="font-size: 16px; font-weight: 500; color: gray"
                        >
                          {{ fechaexpedido }}
                        </p>
                      </center>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <br>
              <hr style="color: grey; width:90%"/>
              <br/>
            </div>
            <div v-if="imgchart != 'nocanva'"  style="padding-left: 20px;">
              <h3>{{titlereport}}</h3>
              <div style="padding-left: 20px">
                <v-row >
                  <v-col cols="6">
                    <center>
                      <img :src="imgchart" width="800" alt="img" />
                    </center>
                  </v-col>
                  <v-col>
                    <div style="padding-top:30px; padding-right:10px">
                    <div>
                      <v-card class="colordiv">
                        <div style="padding: 5px">
                          <center>
                            <h5>{{ dataLabel[0] }}</h5>
                            <p style="font-size: 20px; font-weight: 500">
                              {{ dataInfo[0] }}
                            </p>
                          </center>
                        </div>
                      </v-card>
                    </div>
                    <div>
                      <v-card v-if="ifgeneral" class="colordiv" >
                        <div style="padding: 5px">
                          <center>
                            <h5>{{ dataLabel[1] }}</h5>
                            <p style="font-size: 20px; font-weight: 500">
                              {{ dataInfo[1] }}
                            </p>
                          </center>
                        </div>
                      </v-card>
                    </div>
                    <div>
                      <v-card v-if="ifgeneral" class="colordiv">
                        <div style="padding: 5px">
                          <center>
                            <h5>{{ dataLabel[2] }}</h5>
                            <p style="font-size: 20px; font-weight: 500">
                              {{ dataInfo[2] }}
                            </p>
                          </center>
                        </div>
                      </v-card>
                    </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div>
              <h3>Historial de consultas</h3>
              <div>
                <v-data-table
                  :headers="infocharthead"
                  :items="infochartpdf"
                  hide-default-footer
                  class="elevation-1"
                ></v-data-table>
              </div>
            </div>

          </section>
        </vue-html2pdf>
      </client-only>
      </div>
    </v-dialog>

    </div>
  </v-container>
</template>

<script>
import PieChart from "~/components/charts/pieChart";
export default {
  components: {
    PieChart,
  },
  data() {
    return {
      htmlToPdfOptions: {
        margin: 2,
      },
      titulodoc: "pruebatest",
      confirm1: null,
      loading1: null,
      titulo: null,
      ifecha: null,
      usuario: null,
      ifgeneral : null,
      dataLabel: [],
      dataInfo: [],
      infochartpdf: [],
      infocharthead: [],
      imgchart: null,
      fechaexpedido: null,
      titlereport : null,
      renderimp : false,
      generate: false,


    };
  },
  methods: {
    // :html-to-pdf-options="htmlToPdfOptions"

    async openDialog(
      dataLabel,
      dataInfo,
      userTableHeaders,
      userTable,
      rutachartimg,
      titulo,
      iffecha,
      fechaexpedido,
      modeindiv,
      entorno
    ) {
      await this.limpieza();
       this.renderimp = false;
      this.loading1 = null;
       this.generate = false;
      const response = await this.$axios.$get(
        "/adminsById/" + localStorage.user_id,
        {
          headers: { Authorization: "Bearer " + localStorage.token },
        }
      );

      this.usuario = response.data.email;
      this.dataLabel = dataLabel;
      this.dataInfo = dataInfo;

      this.infochartpdf = userTable;
      this.infocharthead = userTableHeaders;

      console.log('individula ',modeindiv);
       if(entorno == 'consulta'){
        if(modeindiv != 'general'){
      this.infocharthead[2] = { text: "" };
      this.ifgeneral = false;
      this.titlereport = 'Gráfica de reporte de consultas general'
      }
      else{
      this.infocharthead[4] = { text: "" };
       this.ifgeneral = true;
        this.titlereport = 'Gráfica de reporte de consultas ' + modeindiv;
      }
      }else{
          //descarga entorno
        if(modeindiv != 'general'){
      this.infocharthead[2] = { text: "" };
      this.ifgeneral = false;
      this.titlereport = 'Gráfica de reporte de descargar general'
      }
      else{
      this.infocharthead[4] = { text: "" };
       this.ifgeneral = true;
        this.titlereport = 'Gráfica de reporte de descargar ' + modeindiv;
        }

      }

      this.imgchart = rutachartimg;
      this.titulo = titulo;
      this.ifecha = iffecha;
      this.fechaexpedido = fechaexpedido;
      this.titulodoc = titulo + "-" + fechaexpedido;
      this.confirm1 = true;

    },
    async generateReport() {
       this.confirm1 = false;
      this.renderimp = true;
      this.loading1 = true;
      setTimeout(() => {
        this.$refs.html2Pdf.generatePdf();
        this.loading1 = false;
        this.generate = true;
      }, 3000);

    },
    async limpieza() {
      this.usuario = null;
      this.dataLabel = [];
      this.dataInfo = [];
      this.infochartpdf = [];
      this.infocharthead = [];
      this.imgchart = null;
      this.titulo = null;
      this.ifecha = null;
      this.fechaexpedido = null;
    },
    cerrar(){
       this.renderimp = false;
    }
  },
};
</script>
<style scoped>
.colordiv{
  background-color:white !important;
}
</style>


