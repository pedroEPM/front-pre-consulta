<template>
  <v-dialog
    transition="dialog-bottom-transition"
    max-width="600"
    scrollable
    v-model="dialog"
  >
 <v-card>
            <v-toolbar
              color="primary"
              dark
            >vista prevía de {{modo}}</v-toolbar>
            <v-card-text>
             <v-row>
               <v-col>
                 <br>
                 <center>
                   <h2>{{titlenota}}</h2>
                  <div>
                   <h3><span class="negrita">Fecha de la {{action}} : </span> {{date}}</h3>
                    <h3><span class="negrita">Fecha de la publicación : </span> {{fechapub}}</h3>
                      <h3><span class="negrita">Clave de búsqueda en el sistema: </span> {{clavemegamedia}}</h3>
                  </div>
                 </center>
               </v-col>
             </v-row>
               <v-row>
               <v-col>
                 <center>
                <div>
                  <img v-if="ifimg" width="500" :src="imagesrc" alt="image vista previa">
                    <img v-if="ifpdf" height="450" :src="imagesrc" alt="pdf vista previa">
                </div>
                 </center>
                 <div>
                 <p>{{description}}</p>
                </div>
               </v-col>
             </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog = false"
              >Cerrar</v-btn>
            </v-card-actions>
          </v-card>
  </v-dialog>
</template>
<script>
export default {
  data(){
    return{
      dialog : false,
      ifimg : false,
      ifpdf:false,
      fechapub : null,
      imagesrc: null,
      description: null,
      modo : null,
      action : null,
      date : null,
      titlenota: null,
      clavemegamedia : null,
    }
  },
  methods :{
    abrirdialog(idmegamedia, fechaaction, fechapub, fechapubPDF,  titlenota, imagesrc, description, descriptiopdf, mode, descnote, action){
      console.log('MODOOO', mode);
       console.log('la liga img es', imagesrc);
       titlenota = null;
      let fechaformatpub = null;
      switch (mode) {

        case 'Imagenes':
        this.imagesrc = 'https://megateca.megamedia.com.mx/img'+imagesrc;
        this.description = description;
        this.ifimg = true;
        fechaformatpub = new Date(fechapub).toISOString().substring(8, 10) + '-' + this.getMonth(new Date(fechapub).toISOString().substring(5, 7)) + '-' + new Date(fechapub).toISOString().substring(0, 4);
          break;
        case 'Notas':
          this.titlenota = titlenota;
          console.log('title notas', titlenota);
          this.description = descnote;
        fechaformatpub = new Date(fechapub).toISOString().substring(8, 10) + '-' + this.getMonth(new Date(fechapub).toISOString().substring(5, 7)) + '-' + new Date(fechapub).toISOString().substring(0, 4);
          break;
           case 'PDF':
          this.imagesrc = 'https://megateca.megamedia.com.mx/img'+imagesrc;
          console.log('IMG PDF', this.imagesrc);
          if(descriptiopdf == '' || descriptiopdf == null){
            this.description = 'Sin descripción';
          }else{
          this.description = descriptiopdf;
          }
          this.ifpdf = true;
          fechaformatpub = new Date(fechapubPDF).toISOString().substring(8, 10) + '-' + this.getMonth(new Date(fechapubPDF).toISOString().substring(5, 7)) + '-' + new Date(fechapubPDF).toISOString().substring(0, 4);
          break;
      }
      this.modo = mode;
      this.action = action;
       let fechaformat = new Date(fechaaction).toISOString().substring(8, 10) + '-' + this.getMonth(new Date(fechaaction).toISOString().substring(5, 7)) + '-' + new Date(fechaaction).toISOString().substring(0, 4);

      this.date = fechaformat;
      this.fechapub = fechaformatpub;
      this.clavemegamedia = idmegamedia;
      this.dialog = true;

    },
      getMonth( month ){

        let months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[ parseInt(month -1) ];
      }
  }

}
</script>

<style scoped>
.negrita{
  font-weight: 500;
}
</style>
