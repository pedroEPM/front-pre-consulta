<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title> Solicitudes del mensajero </v-toolbar-title>
      <v-spacer />
      <!-- <v-btn color="primary" @click="$refs.reportAddDialog.openDialog()">
        Crear Reporte
      </v-btn> -->
    </v-toolbar>

    <v-card-text v-if="!loading">
      <v-layout row wrap>
        <v-flex xs12 class="pa-5">
          <v-layout row wrap>
            <v-flex xs12 md6 class="pa-1"
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
                    label="Fecha inicial"
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

            <v-flex xs12 md6 class="pa-1"
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

          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 md4 class="pa-1">
              <v-btn
                :color="selected2[0].color"
                :style="'color:' + selected2[0].text"
                block
                @click="state != 'Comenzar' ? state = 'Comenzar' : state = null"
              >
                <v-icon left color="error"> mdi-record</v-icon>Comenzar
              </v-btn>
            </v-flex>

            <!-- <v-flex xs12 md4 class="pa-1">
              <v-btn
                :color="selected2[1].color"
                :style="'color:' + selected2[1].text"
                block
                @click="state != 'Proceso' ? state = 'Proceso' : state = null"
              >
                <v-icon left color="warning"> mdi-record</v-icon>Proceso
              </v-btn>
            </v-flex> -->

            <v-flex xs12 md4 class="pa-1">
              <v-btn
                :color="selected2[2].color"
                :style="'color:' + selected2[2].text"
                block
                  @click="state != 'Finalizado' ? state = 'Finalizado' : state = null"
              >
                <v-icon left color="success"> mdi-record</v-icon>Finalizado
              </v-btn>
            </v-flex>
            <v-flex xs12 md4 class="pa-1">
              <v-btn block color="primary" @click="getReports()"
              >
                <v-icon left>mdi-magnify</v-icon> Buscar</v-btn
              >
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-data-table
        :headers="reportsHeaders"
        :items="reports"
        :items-per-page="12"
        sort-by="date"
        :sort-desc="true"
      >
        <template v-slot:[`item.date`]="{ item }">
          <span>
            {{ new Date(item.date).toISOString().substring(8, 10) + '-' + getMonth(new Date(item.date).toISOString().substring(5, 7)) + '-' + new Date(item.date).toISOString().substring(0, 4) }}
          </span>
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <v-chip @click="$refs.mensajeroEditDialog.openDialog( item )" small :color="item.state == 'Finalizado' ? 'success' : item.state == 'Proceso' ? 'warning' : 'error'  ">{{ item.state }}</v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon class="mr-2" @click="$refs.mensajeroEditDialog.openDialog( item )"> mdi-pencil </v-icon>
          <v-icon class="mr-2" @click="$refs.mensajeroDeleteDialog.openDialog( item )"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <LoaderCard v-show="loading" />
    <MensajeroEditDialog ref="mensajeroEditDialog" />
    <MensajeroDeleteDialog ref="mensajeroDeleteDialog" />
  </v-card>
</template>

<script>
  import MensajeroDeleteDialog from '~/components/mensajero/MensajeroDeleteDialog.vue';
  import MensajeroEditDialog from '~/components/mensajero/MensajeroEditDialog.vue';
  import LoaderCard from "~/components/LoaderCard";
  import { mapActions } from 'vuex';
  export default {
    components : {
      MensajeroDeleteDialog,
      MensajeroEditDialog,
      LoaderCard
    },
    data(){
      return {
        loading : false,
        date1 : null,
        date2 : null,
        state : null,
        reports : [],
        reports : [],
        reportsHeaders : [
          { text : 'Nombre', sortable: false, value : 'name'},
          { text : 'Fecha', value : 'date'},
          // { text : 'Email', sortable: false, value : 'email'},
          { text : 'Descripción', sortable: false, value : 'description'},
          { text : 'Estado', sortable: false, align: "center", value : 'state'},
          { text: "Acciones", sortable: false, align: "center", value: "action", sortable: false },
        ],
        selected2: [
          {  color: "" },
          {  color: "" },
          {  color: "" },
        ],
        minDate: "1864-01-01",
        maxDate: new Date().getFullYear() + "-12-31"
      }
    },
    created(){
      if(process.browser){
        this.getReports();
      }
    },
    watch : {
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
    methods: {
      ...mapActions(['getReportsStore']),
      async getReports(){
        this.getReportsStore();
        this.loading = true;
        console.log({
          status : this.state,
          date : this.date1,
          date2 : this.date2
        })

        const response = await this.$axios.$get('/reportsSearch', {
          params : {
            status : this.state,
            date : this.date1,
            date2 : this.date2
          },
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.reports = [];
       // console.log(response.data)
        response.data.forEach( x => {
          if( x.fromMensajero ){
            this.reports.push(x);
          }
        });

        this.loading = false;

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
