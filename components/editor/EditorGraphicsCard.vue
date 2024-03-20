<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title> Gráficas </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 class="pa-5">
            <v-layout row wrap v-if="dataShow">

              <v-flex xs12 md6>
                <v-layout row wrap>
                  <v-flex xs12 md8 class="pa-1"
                    :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                  >
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
                          label="Elija una fecha"
                          append-icon="mdi-calendar"
                          readonly
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

                  <v-flex xs12 md3 class="pa-1">
                    <v-btn block color="primary" @click="getVisitForDay()"
                      ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                    >
                  </v-flex>
                </v-layout>

                <BarChart
                  v-if="loading.loadingV"
                  :labelsData="dataLabelsV"
                  :valuesData="dataDataV"
                  :title="'Visitas diarías'"
                  :color="'#0277BD'"
                />

                <PieChart
                  v-if="loading.loadingV"
                  :labelsData="dataLabelsV"
                  :valuesData="dataDataV"
                  :title="'Visitas diarías'"
                  :color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"
                />

                <LineChart
                  v-if="loading.loadingV"
                  :labelsData="dataLabelsV"
                  :valuesData="dataDataV"
                  :title="'Visitas diarías'"
                  :color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"
                />

              </v-flex>

              <v-flex xs12 md6>
                <v-layout row wrap>
                  <v-flex xs12 md8 class="pa-1"
                    :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
                  >
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateD"
                          label="Elija una fecha"
                          append-icon="mdi-calendar"
                          readonly
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                          class="custom-field"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="dateD"
                        @input="menu2 = false"
                        :min="minDate"
                        :max="maxDate"
                        locale="es-MX"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12 md3 class="pa-1">
                    <v-btn block color="primary" @click="getDownloadForDay()"
                      ><v-icon left>mdi-magnify</v-icon> Buscar</v-btn
                    >
                  </v-flex>
                </v-layout>
                <BarChart
                  v-if="loading.loadingD"
                  :labelsData="dataLabelsD"
                  :valuesData="dataDataD"
                  :title="'Descargas diarías'"
                  :color="'#014F7E'"
                />

                <PieChart
                  v-if="loading.loadingD"
                  :labelsData="dataLabelsD"
                  :valuesData="dataDataD"
                  :title="'Descargas diarías'"
                  :color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"
                />

                <LineChart
                  v-if="loading.loadingD"
                  :labelsData="dataLabelsD"
                  :valuesData="dataDataD"
                  :title="'Descargas diarías'"
                  :color="['#0277BD','#f87977','#262D31','#0277BD','#f87977']"
                />

              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <LoaderCard v-show="!dataShow" />
  </v-card>
</template>

<script>

  import BarChart from '~/components/charts/barChart';
  import PieChart from '~/components/charts/pieChart';
  import LineChart from '~/components/charts/linesChart';
  import LoaderCard from "~/components/LoaderCard";

  export default {
    components : {
      LoaderCard,
      BarChart,
      PieChart,
      LineChart,
    },
    data(){
      return {
        menu1 : false,
        menu2 : false,
        dataShow : false,
        loading : {
          loadingV : true,
          loadingD : true,
        },
        minDate: "1864-01-01",
        maxDate: new Date().getFullYear() + "-12-31",
        dateV : new Date().toISOString().substring(0, 10),
        dateD : new Date().toISOString().substring(0, 10),
        dataLabelsV: [],
        dataDataV: [],
        dataLabelsD: [],
        dataDataD: [],
      }
    },
    async created(){
      if(process.browser){
        await this.getVisitForDay();
        await this.getDownloadForDay();
        this.dataShow = true;
      }
    },
    methods : {
      async getVisitForDay(){
        this.loading.loadingV = false;
        this.dataLabelsV = [];
        this.dataDataV = [];
        const response = await this.$axios.$get('/chartFiles',{
          params : {
            date : this.dateV,
            fileType: 'Visit',
            mode : null
          },
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        for(let i = 0; i < response.data.length; i++){
          this.dataLabelsV.push(response.data[i].fecha);
          this.dataDataV.push(response.data[i].value)
        }
        this.loading.loadingV = true;
      },
      async getDownloadForDay(){
        this.dataLabelsD = [];
        this.dataDataD = [];
        this.loading.loadingD = false;
        const response = await this.$axios.$get('/chartFiles',{
          params : {
            date : this.dateD,
            fileType : 'Download',
            // mode : 'Notas'

          },
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        for(let i = 0; i < response.data.length; i++){
          this.dataLabelsD.push(response.data[i].fecha);
          this.dataDataD.push(response.data[i].value)
        }
        this.loading.loadingD = true;
      }
    }
  }
</script>

<style>

</style>
