<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card color="primary" dark>
        <v-card-title> Administración </v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12 id="headUse">
      <div>
      <h3> Uso del Centro de Consulta </h3>
        <v-card elevation="2" style="margin-top:12px">
             <v-tabs
     background-color="grey lighten-3"
    >
      <v-tabs-slider/>
      <v-tab>Reporte de Consultas</v-tab>
      <v-tab>Reporte de Descargas</v-tab>
      <v-tab-item>
      <UserTableDialog />
      </v-tab-item>
      <v-tab-item>
      <DownloadReport/>
      </v-tab-item>
    </v-tabs>
        </v-card>
      </div>
    </v-flex>

    <!-- <v-flex xs12 id="headStatic">
      <StaticsContent />
    </v-flex> -->

    <v-flex xs12 id="headMigra">
      <MigrationsCharts />
    </v-flex>

    <v-flex xs12>
        <v-card-title> Uso en Navegadores </v-card-title>
    </v-flex>

    <v-flex xs12 md4>
      <DeviceInformation
        :browsers="browsersDesktop"
        :title="'Navegador'"
      />
    </v-flex>

    <v-flex xs12 md4>
      <DeviceInformation
        :browsers="browsersMobil"
        :title="'Movil'"
      />
    </v-flex>

    <v-flex xs12 md4>
      <DeviceInformation
        :browsers="browsers"
        :title="'Otros'"
      />
    </v-flex>

    <v-flex xs12 md4 v-if="false">
      <v-card>
        <v-card-title>Rango de fechas</v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12 md8 v-if="false">
      <v-card>
        <v-card-title>Rango de fechas</v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import StaticsContent from '~/components/chartsAndGraphics/statics';
  import DeviceInformation from '~/components/administration/deviceInformation';
  import UserTableDialog from '~/components/chartsAndGraphics/userTableDialog';
  import DownloadReport from '~/components/chartsAndGraphics/DownloadReport';
  import MigrationsCharts from '~/components/chartsAndGraphics/migrationsCharts';


export default {
  components : {
    DeviceInformation,
    StaticsContent,
    UserTableDialog,
    MigrationsCharts,
    DownloadReport
  },
  data: () => ({
    browsers : [
      { name: "Chrome", value: 0 },
      { name: "Firefox", value: 0 },
      { name: "Safari", value: 0 },
      { name: "Edge", value: 0 },
      { name: "Otros", value: 0 },
    ],
    browsersMobil : [
      { name: "Chrome", value: 0 },
      { name: "Firefox", value: 0 },
      { name: "Safari", value: 0 },
      { name: "Edge", value: 0 },
      { name: "Otros", value: 0 },
    ],
    browsersDesktop : [
      { name: "Chrome", value: 0 },
      { name: "Firefox", value: 0 },
      { name: "Safari", value: 0 },
      { name: "Edge", value: 0 },
      { name: "Otros", value: 0 },
    ],
    arrayMobil : [],
    arrayDesktop : [],
    datosChafas :[
      {
        browser : "Google Chrome",
        device  : "Escritorio"
      },
      {
        browser : "Opera",
        device  : "Mobil"
      },
      {
        browser : "Google Chrome",
        device  : "Mobil"
      },
      {
        browser : "Mozilla Firefox",
        device  : "Mobil"
      },
      {
        browser : "Google Chrome",
        device  : "Escritorio"
      },
      {
        browser : "Apple Safari",
        device  : "Escritorio"
      },
      {
        browser : "Apple Safari",
        device  : "Escritorio"
      },
      {
        browser : "Apple Safari",
        device  : "Mobil"
      },
      {
        browser : "Apple Safari",
        device  : "Escritorio"
      },
    ],
  }),
  async created(){
    if(process.browser){
      this.getUserInformation();
    }
  },
  methods : {
    async getUserInformation(){
      const response = await this.$axios.$get('/usersInfo', {
        headers : { Authorization : 'Bearer ' + localStorage.token }
      });

      for( let i = 0; i < response.data.length; i++ ){
        if(response.data[i].device == 'Mobile'){
          this.arrayMobil.push(response.data[i]);
          console.log('ah ok');
        }else{
          this.arrayDesktop.push(response.data[i])
        }
      }
      this.getMobileInformation();
      this.getDesktopInformation();
    },
    getMobileInformation(){
      for( let i = 0; i < this.arrayMobil.length; i++ ){
        switch(this.arrayMobil[i].browser){
          case 'Google Chrome':
            this.browsersMobil[0].value += 1;
          break;
          case 'Apple Safari':
            this.browsersMobil[1].value += 1;
          break;
          case 'Opera':
            this.browsersMobil[2].value += 1;
          break;
          case 'Mozilla Firefox':
            this.browsersMobil[3].value += 1;
          break;
          case 'Microsoft Internet Explorer':
            this.browsersMobil[4].value += 1;
          break;
        }
      }
      if(this.arrayMobil.length != 0){
        for( let i  = 0; i < this.browsersMobil.length; i++ ){
          this.browsersMobil[i].value = ( this.browsersMobil[i].value * 100 ) / this.arrayMobil.length;
        }
      }
    },
    getDesktopInformation(){
      for( let i = 0; i < this.arrayDesktop.length; i++ ){
        switch(this.arrayDesktop[i].browser){
          case 'Google Chrome':
            this.browsersDesktop[0].value += 1;
          break;
          case 'Apple Safari':
            this.browsersDesktop[1].value += 1;
          break;
          case 'Opera':
            this.browsersDesktop[2].value += 1;
          break;
          case 'Mozilla Firefox':
            this.browsersDesktop[3].value += 1;
          break;
          case 'Microsoft Internet Explorer':
            this.browsersDesktop[4].value += 1;
          break;
        }
      }
      if(this.arrayDesktop.length != 0){
        for( let i  = 0; i < this.browsersDesktop.length; i++ ){
          this.browsersDesktop[i].value = ( this.browsersDesktop[i].value * 100 ) / this.arrayDesktop.length;
        }
      }
    },
  }
};
</script>

<style>
</style>
