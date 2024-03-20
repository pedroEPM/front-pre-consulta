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
          <v-toolbar-title>Historial de usuario</v-toolbar-title>
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
                          label="Trabajo"
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
                    <v-layout row wrap v-if="dataShow">

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
                        <v-btn block large
                          :color="selected[3].color"
                          ><v-icon left>mdi-video-box</v-icon>Multimedia</v-btn
                        >
                      </v-flex>

                      <v-flex>
                        <v-btn block large @click="mode = 'PDF', showInformation = false, fileId = null"
                          :color="selected[4].color"
                          ><v-icon left>mdi-file</v-icon>PDF</v-btn
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
                    <v-card-text v-if="dataShow">
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                          <h3>Historial de Consultas</h3>
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
                          </v-data-table>
                        </v-flex>
                        <v-flex xs12 md6>
                           <h3>Historial de Descargas</h3>
                          <v-data-table
                            :headers="historialLogsHeaders"
                            :items="DownloadInformation"
                          >
                            <template v-slot:[`item.date`]="{ item }">
                              <span>
                                {{ new Date(item.date).toISOString().substring(0,10) }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>

              </v-layout>
              <LoaderCard v-show="!dataShow" />
            </v-flex>

          </v-layout>
        </v-container>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
  import SearchTableHistorical from '~/components/Configurations/SearchTableHistorical.vue';
  import LoaderCard from "~/components/LoaderCard";
  export default {
    components : {
      SearchTableHistorical,
      LoaderCard
    },
    data(){
      return {

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
          { text : 'Título', value : 'Datos[0].ImageTitle' }
        ],
        visitInformation : [],
        DownloadInformation : [],
      }
    },
    watch : {
      async mode( newvalue ){
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
            this.historialLogsHeaders[1].value = 'Datos[0].ImageTitle';
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
            this.historialLogsHeaders.value = 'Datos[0].title';
          break;
        }
        await this.getUserHistorialLoagVisit();
        await this.getUserHistorialLoagDownload();
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
      openDialog( id ){
        this._id = id;
        this.resetValues();
        this.dateF = new Date(this.dateF.setDate(this.dateF.getDate() - 1)).toISOString().substring(0,10)
        this.maxDate2 = new Date(this.maxDate2.setDate(this.maxDate2.getDate() - 1)).toISOString().substring(0,10)
        this.dataShow = false;
        this.dialog = true;
        this.getUser();
        this.getUserHistorialLoagVisit();
        this.getUserHistorialLoagDownload();
      },
      async getUser(){
        const response = await this.$axios.$get('/users/' + this._id, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        var idjob =  response.data.job;
        const responsejob = await this.$axios.$get('/position/' + idjob, {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.userData = {
          name : response.data.name,
          email : response.data.email,
          phone : response.data.phone,
          job : responsejob.data.position
        }
      },
      async getUserHistorialLoagVisit(){
        try {
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
          this.dataShow = true;

          console.log(response.data)
        } catch (error) {
          console.log(error.resposne)
        }

      },
      async getUserHistorialLoagDownload(){
        try {
          this.dataShow = false;
          const response = await this.$axios.$get('/chartFiles/',{
            params : {
              fileType : 'Download',
              mode : this.mode,
              noDate : true,
              userId : this._id,
              date : this.dateV,
              date2 : this.dateD,
            },
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });
          this.DownloadInformation = response.data;
          this.dataShow = true;
        } catch (error) {
          console.log(error.resposne)
        }

      },
      cleanAndClose(){
        this.dialog = false;
        this._id = null;
        this.userData = {};
      },
      resetValues(){
        this.dateV = new Date().toISOString().substring(0, 10);
        this.dateD = null;
        this.dateF = new Date();
        this.maxDate2 = new Date();
      },
      async findCharts(){
        this.dataShow = false;
        this.dateD = this.dateF;
        await this.getUserHistorialLoagVisit();
        await this.getUserHistorialLoagDownload();
        this.dataShow = true;
      }
    }
  }
</script>

<style>

</style>
