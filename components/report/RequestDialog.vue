<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title> Selecciona un rango de fechas </v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="$refs.requestAddDialog.openDialog()">
        Crear solicitud
      </v-btn>
    </v-toolbar>
    <v-card-text v-if="!loading">
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 class="pa-5">
            <v-layout row wrap>
              <v-flex xs12 md4 class="pa-1"
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
              >
                <v-menu
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date2"
                      label="Fecha de inicio"
                      append-icon="mdi-calendar"
                      hide-details
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                      class="custom-field"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date2"
                    :min="minDate"
                    :max="maxDate"
                    locale="es-MX"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 md4 class="pa-1"
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
              >
                <v-menu
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date1"
                      label="Fecha final"
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
                    v-model="date1"
                    :min="minDate"
                    :max="maxDate"
                    locale="es-MX"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 md4 class="pa-1"
                :class="$vuetify.breakpoint.mdAndUp ? 'pr-2' : ''"
              >

              <!-- <v-btn outlined color="primary" @click="limpiarFechas()">
                Limpiar filtos
              </v-btn> -->
                <!--v-select
                  :items="select"
                  label="Por Filtro"
                  placeholder="Seleccione una opción"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  hide-details

                  class="custom-field"
                ></v-select-->
              </v-flex>

            </v-layout>
            <v-layout row wrap>

              <v-flex xs12 md2 class="pa-1">
                <v-btn
                  :color="selected[0].color"
                  :style="'color:' + selected[1].text"
                  block
                  @click="kind != 'inner' ? kind = 'inner' : kind = null"
                >
                  Interno
                </v-btn>
              </v-flex>

              <v-flex xs12 md2 class="pa-1">
                <v-btn
                  :color="selected[1].color"
                  :style="'color:' + selected[1].text"
                  block
                  @click="kind != 'outter' ? kind = 'outter' : kind = null"
                >
                  Externo
                </v-btn>
              </v-flex>

              <v-flex xs12 md2 class="pa-1">
                <v-btn
                  :color="selected2[0].color"
                  :style="'color:' + selected2[0].text"
                  block
                  @click="state != 'Comenzar' ? state = 'Comenzar' : state = null"
                >
                  <v-icon left color="error"> mdi-record</v-icon>Comenzar
                </v-btn>
              </v-flex>

              <v-flex xs12 md2 class="pa-1">
                <v-btn
                  :color="selected2[1].color"
                  :style="'color:' + selected2[1].text"
                  block
                  @click="state != 'Proceso' ? state = 'Proceso' : state = null"
                >
                  <v-icon left color="warning"> mdi-record</v-icon>Proceso
                </v-btn>
              </v-flex>

              <v-flex xs12 md2 class="pa-1">
                <v-btn
                  :color="selected2[2].color"
                  :style="'color:' + selected2[2].text"
                  block
                   @click="state != 'Finalizado' ? state = 'Finalizado' : state = null"
                >
                  <v-icon left color="success"> mdi-record</v-icon>Finalizado
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row wrap justify-end>

        <v-flex xs12 md2 class="pa-1">
          <v-spacer />
          <v-btn block color="primary" @click="getRequests()"
          >
            <v-icon left>mdi-magnify</v-icon> Buscar</v-btn
          >
        </v-flex>

      </v-layout>
      </v-container>
      <div style="margin:5px">
        <h4>Buscar en la tabla</h4>
        <v-row>
          <v-col cols="6">
          <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar fecha - titulo - descripción"
        single-line
        hide-details
      ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        :headers="reportsHeaders"
        :items="reports"
        :items-per-page="10"
        :search="search"
        sort-by="fecha_creacion_solicitud"
        :sort-desc="true"
      >
       <template v-slot:[`item.fecha_creacion_solicitud`]="{ item }">
          <span>
            {{ new Date(item.fecha_creacion_solicitud).toISOString().substring(8, 10) + '-' + getMonth(new Date(item.fecha_creacion_solicitud).toISOString().substring(5, 7)) + '-' + new Date(item.fecha_creacion_solicitud).toISOString().substring(0, 4) }}
          </span>
           <!--- {{ new Date(item.fecha_peticion).toISOString().substring(8, 10) + '-' + getMonth(new Date(item.fecha_peticion).toISOString().substring(5, 7)) + '-' + new Date(item.fecha_peticion).toISOString().substring(0, 4) }}----->
        </template>

        <template v-slot:[`item.fecha_peticion`]="{ item }">
          <span :class="index > 0 ? 'mt-1 mb-1': 'mt-1'" v-for="(customDate, index) in getAskDate(item)" :key="index" >{{ customDate }}</span>

        </template>

        <template v-slot:[`item.state`]="{ item }">
          <v-chip small @click="$refs.requestEditDialog.openDialog( item )" :color="item.state == 'Finalizado' ? 'success' : item.state == 'Proceso' ? 'warning' : 'error'  ">{{ item.state }}</v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon class="mr-2" @click="$refs.requestEditDialog.openDialog( item )"> mdi-pencil </v-icon>
          <v-icon class="mr-2" @click="$refs.requestDeleteDialog.openDialog( item )"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <LoaderCard v-show="loading" />
    <RequestEditDialog ref="requestEditDialog" />
    <RequestDeleteDialog ref="requestDeleteDialog" />
    <RequestAddDialog ref="requestAddDialog" />

  </v-card>
</template>

<script>
  import RequestEditDialog from '~/components/report/RequestEditDialog';
  import RequestDeleteDialog from '~/components/report/RequestDeleteDialog';
  import RequestAddDialog from '~/components/report/RequestAddDialog';
  import LoaderCard from "~/components/LoaderCard";
  import { mapActions } from 'vuex';

  export default {
    components : {
      RequestEditDialog,
      RequestAddDialog,
      RequestDeleteDialog,
      LoaderCard
    },
    data(){
      return {
        search: '',
        loading: false,
        date1 : null,
        date2 : null,
        kind : null,
        state : null,
        reports : [],
        reportsHeaders : [
          { text : 'Fecha solicitud', value : 'fecha_creacion_solicitud'},
          { text : 'Nombre del Solicitante', sortable: false, value : 'nombre'},
          { text : 'Tema', sortable: false, value : 'tema'},
          { text : 'Descripción', sortable: false, value : 'descripcion'},
          { text : 'Fecha(s) de la publicación', align:  "center", sortable: false, value : 'fecha_peticion'},
          { text : 'Tipo de archivo', sortable: false, value : 'tipoArchivo'},
          { text : 'Estado', sortable: false, align: "center", value : 'state'},
          { text: "Acciones", align:  "center", sortable: false, value: "action", sortable: false },
        ],
        select: [
          { text : '----------', value : 'Prueba'}
        ],
        selected: [
          {  color: "" },
          {  color: "" },
        ],
        selected2: [
          {  color: "" },
          {  color: "" },
          {  color: "" },
        ],
        minDate: "1864-01-01",
        //maxDate: new Date().getFullYear() + "-12-31"
        maxDate: new Date().toISOString().substring(0,10),
      }
    },
    created(){
      if(process.browser){
        this.getRequests();
      }
    },
    watch : {
      kind( newValue ){
        switch( newValue ){
          case 'inner':
            this.selected[0].color =  "#4FC3F7"
            this.selected[1].color  = '';
          break;
          case 'outter':
            this.selected[0].color = '';
            this.selected[1].color  = "#4CAF50";
          break;
          case null:
            this.selected[0].color = '';
            this.selected[1].color = '';
          break;
        }
      },
      state( newValue ){
        switch( newValue ){
          case 'Comenzar':
            this.selected2[0].color =  "error"
            this.selected2[1].color  = '';
            this.selected2[2].color  = '';
          break;
          case 'Proceso':
            this.selected2[0].color  = '';
            this.selected2[1].color =  "warning"
            this.selected2[2].color  = '';
          break;
          case 'Finalizado':
            this.selected2[0].color  = '';
            this.selected2[1].color  = '';
            this.selected2[2].color =  "success"
          break;
          case null:
            this.selected2[0].color = '';
            this.selected2[1].color = '';
            this.selected2[2].color = '';
          break;
        }
      }
    },
    methods : {
      getAskDate( dates ){
        const dateSplit = dates?.fecha_peticion;
        const newsDate = [];
        if(dateSplit.length === 0 || dateSplit === undefined) newsDate.push('Sin fechas');
        dateSplit.forEach(date => {
          let newDate = new Date();
          if(date === 'Sin fechas')  return newsDate.push('Sin fechas');
          if(date.includes('/') || date.includes(' ')){
            date = date.trim();
            date = date.replaceAll('/', '-');
            date = date.replaceAll(' ', '-');
            newDate = date.split('-');
            date = newDate[2] + '-' + newDate[1] + '-' + newDate[0];

          }
          let custom = new Date(date).toISOString().substring(0,10).split('-');
          newsDate.push(custom[2] + '-' + this.getMonth(custom[1]) + '-' + custom[0]);
        });
        console.log(newsDate)
        console.log('x - x - x')
        return newsDate;
      },
      ...mapActions(['getRequestsStore']),
      async getRequests(){
        this.getRequestsStore();
        this.loading = true;
        const response = await this.$axios.$get('/requestdocuments', {
          params : {
            kind : this.kind,
            date1 : this.date1,
            date2 : this.date2,
            status : this.state
          },
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.reports = response.data;
        this.loading = false;
      },
      limpiarFechas(){
        this.date1 = null
        this.date2 = null
      },
      getMonth( month ){

        let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[ parseInt(month -1) ];
      }
    }
  }
</script>

<style>

</style>
