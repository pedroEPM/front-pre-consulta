<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Importar nuevos datos</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout row class="pl-5 pr-5">
        <v-file-input class="pr-5"
          v-model="files"
          @change="loadTextFromFile(files)"
          style="margin-top: -10px;"
          placeholder="Seleccionar archivo CSV"
          prepend-icon="mdi-paperclip"
        >
          <template v-slot:selection="{ text }">
            <v-chip
              small
              label
              color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
        <v-btn
          color="primary"
          @click="addMultipleData()"
        >
          <v-icon dark>
            mdi-send
          </v-icon>
        </v-btn>
      </v-layout>
      <v-layout row class="pl-5 pr-5 mt-5" v-if="type == 'Imagenes' || type == 'PDF'" >
        <v-file-input class="pr-5"
          v-model="files2"
          multiple
          style="margin-top: -10px;"
          :placeholder="`Seleccionar archivo de ${ type == 'Imagenes' ? 'imagenes' : 'pdfs' }`"
          prepend-icon="mdi-paperclip"
        >
          <template v-slot:selection="{ text }">
            <v-chip
              small
              label
              color="primary"
            >
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
      </v-layout>
      <v-btn v-if="false"
        @click="addMultipleData()"
      >
        Activar migrador
      </v-btn>
    </v-card-text>
    <v-card-text v-if="show">
      <v-flex xs12>
        <v-data-table
          :headers="headersCSV"
          :items="migrationCSV"
          :items-per-page="20"

          loading-text="Cargando... Por favor, espere"
        >
          <template v-slot:[`item.date`]="{ item }">
            <span>{{
              new Date(item.date).toISOString().substring(0, 10)
            }}</span>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              class="mr-2"
              @click="openDialog(item.index)"
              >mdi-pencil</v-icon
            >
            <v-icon
              class="mr-2"
              @click="deleteItem(item.index)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
      </v-flex>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title>Alerta</v-card-title>
        <v-card-text>
          Cargando archivo
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog2"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title> Cargando archivo... </v-card-title>
        <v-card-text>
          <v-progress-linear
            v-model="cargando"
            style="color : white"
            height="25"
          >
            <strong>{{ Math.ceil(cargando) }}%</strong>
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <MigrationEditNoteDialog ref="migrationEditNoteDialog" />
    <MigrationEditPDFDialog ref="migrationEditPDFDialog" />
    <MigrationEditImageDialog ref="migrationEditImageDialog" />
 </v-card>
</template>

<script>
  import XLSX from 'xlsx';
  import MigrationEditNoteDialog from '~/components/migrations/MigrationEditNoteDialog.vue';
  import MigrationEditPDFDialog from '~/components/migrations/MigrationEditPDFDialog.vue';
  import MigrationEditImageDialog from '~/components/migrations/MigrationEditImageDialog.vue';
  export default {
    components : {
      MigrationEditNoteDialog,
      MigrationEditPDFDialog,
      MigrationEditImageDialog
    },
    data(){
      return {
        dialog : false,
        files : null,
        files2 : null,
        deNuevo : null,
        migrationCSV : [],
        headersCSV : [],
        sheetRef : null,

        dialog2 : false,
        cargando : 0,
        type : null,
        show : false,
      }
    },
    watch : {
      files(){
        this.files2 = [];
      },
      files2( newValue ){
        if(this.type != 'Notas' && newValue.length > 0 ){
          this.show = true;
        }else{
          this.show = false;
        }
      }
    },
    methods : {
      loadTextFromFile( ev ){
        const vm = this;
        const file = ev;
        const reader = new FileReader();
        let x = 'No hay';

        reader.onload = function( event ) {
          x = event.target.result;
          vm.readAsXLSX( x );
        }

        this.dialog = true;
        reader.readAsBinaryString( file );
      },
      readAsXLSX( archivo ){
        let cont = 0;
        var workBook = XLSX.read( archivo , {
          type : 'binary'
        });

        workBook.SheetNames.forEach( sheet => {
          let contador = 0;
          let stop = 0;
          this.sheetRef = sheet;
          switch(sheet){
            case 'Notas':
              cont = sheet.length;
              this.generateData( contador, stop, workBook, sheet)
              console.log(this.migrationCSV)
            break;
            case 'PDF':
              cont = sheet.length;
              this.generateData( contador, stop, workBook, sheet)
              console.log(this.migrationCSV)
            break;
            case 'Imagenes':
              cont = sheet.length;
              this.generateData( contador, stop, workBook, sheet)
              console.log(this.migrationCSV)
            break;
          }
        });

        let x = {
          dataCSV : this.migrationCSV
        }
        this.deNuevo = x;
        if( x.dataCSV.length < cont ){
          x = 'No hay';
        }
        this.load(x)
      },
      load( data ){
        if( data === 'No hay'){
          return;
        }
        this.dialog = false;
      },
      enviardenuevo(){

        if( this.deNuevo === 'No hay' ){
          // alert('El archivo es muy grande o no se puede leer');
          return;
        }
        this.$emit('loaded', this.deNuevo);
      },
      async activarMigrador( data ){
        try {
          await setTimeout(() => {
            console.log('Epaaaaaaaaaaaa ' + data)
          }, 1000);
          /*const response = await this.$axios.$post('/alimentador/excel', {
            headers : { Authorization : 'Bearer ' + localStorage.token }
          });*/
        } catch (error) {
          console.log(error.response)
        }
      },
      generateData( contador, stop, workBook, sheet ){
        this.show = false;
        this.migrationCSV = [];
        let index = 0;
        do{
          contador++;
          if (!workBook.Sheets[sheet]['B' + (contador + 1)] && !workBook.Sheets[sheet]['B' + (contador + 2)] && !workBook.Sheets[sheet]['B' + (contador + 3)] && !workBook.Sheets[sheet]['B' + (contador + 4)] && !workBook.Sheets[sheet]['B' + (contador + 5)] && !workBook.Sheets[sheet]['B' + (contador + 6)] && !workBook.Sheets[sheet]['B' + (contador + 7)]) {
            stop = 2001;
            break
          }
          stop++;
        } while ( stop < 1000 );

        switch( sheet ){
          case 'Notas':
            for (let i = 2; i <= contador; i++ ){
              try {
                  this.type = sheet;
                  this.headersCSV = [
                    { text : 'Título', value : 'title' },
                    { text : 'Subtítulo', value : 'subTitle' },
                    { text : 'Fecha de publicación', value : 'date' },
                    { text : 'Autor', value : 'originalAuthor' },
                    { text : 'Acciones', value : 'action' }
                  ];
                  this.migrationCSV.push({
                    id : (workBook.Sheets[sheet]['A' + i]) ? workBook.Sheets[sheet]['A' + i].v : 0,
                    title : (workBook.Sheets[sheet]['B' + i]) ? workBook.Sheets[sheet]['B' + i].v : 0,
                    subTitle : (workBook.Sheets[sheet]['C' + i]) ? workBook.Sheets[sheet]['C' + i].v : 0,
                    publicationRef : (workBook.Sheets[sheet]['D' + i]) ? workBook.Sheets[sheet]['D' + i].v : 0,
                    noteBookRef : (workBook.Sheets[sheet]['E' + i]) ? workBook.Sheets[sheet]['E' + i].v : 0,
                    section: (workBook.Sheets[sheet]['F' + i]) ? workBook.Sheets[sheet]['F' + i].v : 0,
                    originalAuthor : (workBook.Sheets[sheet]['G' + i]) ? workBook.Sheets[sheet]['G' + i].v : 0,
                    modifierAuthor : (workBook.Sheets[sheet]['H' + i]) ? workBook.Sheets[sheet]['H' + i].v : 0,
                    page : (workBook.Sheets[sheet]['I' + i]) ? workBook.Sheets[sheet]['I' + i].v : 0,
                    date : (workBook.Sheets[sheet]['J' + i]) ? workBook.Sheets[sheet]['J' + i].v : 0,
                    content : (workBook.Sheets[sheet]['K' + i]) ? workBook.Sheets[sheet]['K' + i].v : 0,
                    index,
                  })
                  index++;
                  this.show = true;
              } catch (err) {
                console.log(err)
              }
            }
          break;
          case 'PDF':
            for (let i = 2; i <= contador; i++ ){
              try {
                  this.type = sheet;
                  this.headersCSV = [
                    { text : 'Nombre', value : 'nombre' },

                    { text : 'Fecha de publicación', value : 'date' },
                    { text : 'Página', value : 'pagina' },
                    { text : 'Acciones', value : 'action' }
                  ];
                  this.migrationCSV.push({
                    id : (workBook.Sheets[sheet]['A' + i]) ? workBook.Sheets[sheet]['A' + i].v : 0,
                    idPublicacion : (workBook.Sheets[sheet]['B' + i]) ? workBook.Sheets[sheet]['B' + i].v : 0,
                    //idCuaderno  : (workBook.Sheets[sheet]['C' + i]) ? workBook.Sheets[sheet]['C' + i].v : 0,
                    //idSeccion : (workBook.Sheets[sheet]['D' + i]) ? workBook.Sheets[sheet]['D' + i].v : 0,
                    //idNoticia : (workBook.Sheets[sheet]['E' + i]) ? workBook.Sheets[sheet]['E' + i].v : 0,
                    //idClasificacion : (workBook.Sheets[sheet]['F' + i]) ? workBook.Sheets[sheet]['F' + i].v : 0,
                    //carpeta : (workBook.Sheets[sheet]['G' + i]) ? workBook.Sheets[sheet]['G' + i].v : 0,
                    nombre: (workBook.Sheets[sheet]['H' + i]) ? workBook.Sheets[sheet]['H' + i].v : 0,
                    //descripcion : (workBook.Sheets[sheet]['I' + i]) ? workBook.Sheets[sheet]['I' + i].v : 0,
                    pagina : (workBook.Sheets[sheet]['J' + i]) ? workBook.Sheets[sheet]['J' + i].v : 0,
                    fechaPublicacion : (workBook.Sheets[sheet]['K' + i]) ? workBook.Sheets[sheet]['K' + i].v : 0,
                    date : (workBook.Sheets[sheet]['L' + i]) ? workBook.Sheets[sheet]['L' + i].v : 0,
                    //fechaEdicion : (workBook.Sheets[sheet]['M' + i]) ? workBook.Sheets[sheet]['M' + i].v : 0,
                    //paginas : (workBook.Sheets[sheet]['N' + i]) ? workBook.Sheets[sheet]['N' + i].v : 0,
                    //tamanio : (workBook.Sheets[sheet]['O' + i]) ? workBook.Sheets[sheet]['O' + i].v : 0,
                    //editado : (workBook.Sheets[sheet]['P' + i]) ? workBook.Sheets[sheet]['P' + i].v : 0,
                    //status : (workBook.Sheets[sheet]['Q' + i]) ? workBook.Sheets[sheet]['Q' + i].v : 0,
                    cuaderno : (workBook.Sheets[sheet]['R' + i]) ? workBook.Sheets[sheet]['R' + i].v : 0,
                    //discoDuro : (workBook.Sheets[sheet]['S' + i]) ? workBook.Sheets[sheet]['S' + i].v : 0,
                    index,
                  })
                  index++;
              } catch (err) {
                console.log(err)
              }
            }
          break;
          case 'Imagenes':
            for (let i = 2; i <= contador; i++ ){
              try {
                  this.type = sheet;
                  this.headersCSV = [
                    { text : 'Nombre', value : 'nombre' },

                    { text : 'Fecha de publicación', value : 'date' },
                    { text : 'Lugar', value : 'lugar'},
                    { text : 'Página', value : 'pagina' },
                    { text : 'Acciones', value : 'action' }
                  ];
                  this.migrationCSV.push({
                    //id : (workBook.Sheets[sheet]['A' + i]) ? workBook.Sheets[sheet]['A' + i].v : 0,
                    //idOriginal : (workBook.Sheets[sheet]['B' + i]) ? workBook.Sheets[sheet]['B' + i].v : 0,
                    //idSeccion  : (workBook.Sheets[sheet]['C' + i]) ? workBook.Sheets[sheet]['C' + i].v : 0,
                    seccion : (workBook.Sheets[sheet]['D' + i]) ? workBook.Sheets[sheet]['D' + i].v : 0,
                    //idEdicion : (workBook.Sheets[sheet]['E' + i]) ? workBook.Sheets[sheet]['E' + i].v : 0,
                    //idNoticia : (workBook.Sheets[sheet]['F' + i]) ? workBook.Sheets[sheet]['F' + i].v : 0,
                    idFotografo : (workBook.Sheets[sheet]['G' + i]) ? workBook.Sheets[sheet]['G' + i].v : 0,
                    idAgencia : (workBook.Sheets[sheet]['H' + i]) ? workBook.Sheets[sheet]['H' + i].v : 0,
                    idClasificacion : (workBook.Sheets[sheet]['I' + i]) ? workBook.Sheets[sheet]['I' + i].v : 0,
                    idPublicacion : (workBook.Sheets[sheet]['J' + i]) ? workBook.Sheets[sheet]['J' + i].v : 0,
                    idCuaderno : (workBook.Sheets[sheet]['K' + i]) ? workBook.Sheets[sheet]['K' + i].v : 0,
                    //carpeta : (workBook.Sheets[sheet]['L' + i]) ? workBook.Sheets[sheet]['L' + i].v : 0,
                    nombre : (workBook.Sheets[sheet]['M' + i]) ? workBook.Sheets[sheet]['M' + i].v : 0,
                    descripcion : (workBook.Sheets[sheet]['N' + i]) ? workBook.Sheets[sheet]['N' + i].v : 0,
                    //resolucionX : (workBook.Sheets[sheet]['O' + i]) ? workBook.Sheets[sheet]['O' + i].v : 0,
                    //resolucionY : (workBook.Sheets[sheet]['P' + i]) ? workBook.Sheets[sheet]['P' + i].v : 0,
                    lugar : (workBook.Sheets[sheet]['Q' + i]) ? workBook.Sheets[sheet]['Q' + i].v : 0,
                    material : (workBook.Sheets[sheet]['R' + i]) ? workBook.Sheets[sheet]['R' + i].v : 0,
                    date : (workBook.Sheets[sheet]['S' + i]) ? workBook.Sheets[sheet]['S' + i].v : 0,
                    publicationDate : (workBook.Sheets[sheet]['T' + i]) ? workBook.Sheets[sheet]['T' + i].v : 0,
                    fechaOrigen : (workBook.Sheets[sheet]['U' + i]) ? workBook.Sheets[sheet]['U' + i].v : 0,
                    tamanio : (workBook.Sheets[sheet]['V' + i]) ? workBook.Sheets[sheet]['V' + i].v : 0,
                    //idFormato : (workBook.Sheets[sheet]['W' + i]) ? workBook.Sheets[sheet]['W' + i].v : 0,
                    publicada : (workBook.Sheets[sheet]['X' + i]) ? workBook.Sheets[sheet]['X' + i].v : 0,
                    anuario : (workBook.Sheets[sheet]['Y' + i]) ? workBook.Sheets[sheet]['Y' + i].v : 0,
                    vendible : (workBook.Sheets[sheet]['Z' + i]) ? workBook.Sheets[sheet]['Z' + i].v : 0,
                    //observaciones : (workBook.Sheets[sheet]['AA' + i]) ? workBook.Sheets[sheet]['AA' + i].v : 0,
                    pagina : (workBook.Sheets[sheet]['AB' + i]) ? workBook.Sheets[sheet]['AB' + i].v : 0,
                    //editado : (workBook.Sheets[sheet]['AC' + i]) ? workBook.Sheets[sheet]['AC' + i].v : 0,
                    //status : (workBook.Sheets[sheet]['AD' + i]) ? workBook.Sheets[sheet]['AD' + i].v : 0,
                    fotografoExterno : (workBook.Sheets[sheet]['AE' + i]) ? workBook.Sheets[sheet]['AE' + i].v : 0,
                    //exportado : (workBook.Sheets[sheet]['AF' + i]) ? workBook.Sheets[sheet]['AF' + i].v : 0,
                    //carpetaOrigen : (workBook.Sheets[sheet]['AG' + i]) ? workBook.Sheets[sheet]['AG' + i].v : 0,
                    //discoDuro : (workBook.Sheets[sheet]['AH' + i]) ? workBook.Sheets[sheet]['AH' + i].v : 0,
                    //infografia : (workBook.Sheets[sheet]['AI' + i]) ? workBook.Sheets[sheet]['AI' + i].v : 0,
                    index,
                  })
                  index++;
              } catch (err) {
                console.log(err)
              }
            }
          break;
        }
      },
      async addMultipleData(){
        this.dialog2 = true;
        for(let i = 0; i <= this.migrationCSV.length; i++){
          this.cargando = ( i * 100 ) / this.migrationCSV.length;
          if( i === this.migrationCSV.length){
            this.dialog2 = false;
          }else{
            // await this.activarMigrador( i );
            // let response = await this.$axios.$get('https://jsonplaceholder.typicode.com/todos/1');
            switch(this.sheetRef){
              case 'Notas':
                let response = await this.createNote( i );
              break;
              case 'PDF':
                let response2 = await this.createPDf( i );
                console.log(response2 + ' ' + i)
              break;
              case 'Imagenes':
                let response3 = await this.createImage( i );
                console.log(response3 + ' ' + i)
                break;
            }
          }
        }
        this.files = [];
        this.files2 = [];
        // this.dialog2 = false;
      },
      async createNote( index ) {
        try {
          const response = await this.$axios.$post("/addNote", {
              title: this.migrationCSV[index]?.title,
              subTitle: this.migrationCSV[index]?.subTitle,
              publicationRef: this.migrationCSV[index]?.publicationRef,
              noteBookRef: this.migrationCSV[index]?.noteBookRef,
              section: this.migrationCSV[index]?.section, // nunca se uso
              originalAuthor: this.migrationCSV[index]?.originalAuthor,
              modifierAuthor: this.migrationCSV[index]?.modifierAuthor,
              page : this.migrationCSV[index]?.page != 'Desconocido' ? this.migrationCSV[index].page : null,
              date: this.migrationCSV[index]?.date,
              LastModifyDate: new Date(),
              content: this.migrationCSV[index]?.content,
              isSelleable : this.migrationCSV[index]?.isSelleable,
              isPublished : this.migrationCSV[index]?.isPublished,
              isYearbook : this.migrationCSV[index]?.isYearbook,
              observations : this.migrationCSV[index]?.observations
            },
            {
              headers: { Authorization: "Bearer " + localStorage.token },
            }
          );
          if (response) {
            return true;
          }
        } catch (error) {
          console.log(error.response)
          return false;
        }
      },
      async createPDf( index ) {
        let formData = new FormData();
        let body = {
          dateCreation: this.migrationCSV[index].date,
          title: this.migrationCSV[index].nombre, // titulo del pdf (este se usa para buscarlo de momento)
          page: this.migrationCSV[index].pagina,
          //agency: this.migrationCSV[index].PublishingAgencyRef,
          publication: this.migrationCSV[index].publicationRef,
          notebook: this.migrationCSV[index].notebookRef,
          lastEditionDate : new Date(),
          //observations: string, // observaciones
          //section: string, // seccion sin definir como los anteriores
          isSelleable : this.migrationCSV[index].isSelleable,
          // isPublished : this.isPublished,
          isYearbook : this.migrationCSV[index].isYearbook,
          catalogingInstitution : this.migrationCSV[index].catalogingInstitution,
          // periodicity : this.periodicity,
          language : this.migrationCSV[index].language,
          // agency: this.PublishingAgencyRef,
          imprint : this.migrationCSV[index].imprint,
          director : this.migrationCSV[index].director,
          localSeries : this.migrationCSV[index].localSeries,
        };
        console.log(body);
        formData.append("pdf", this.files2[index]);
        formData.append("body", JSON.stringify(body));

        try {
          const response = await this.$axios.$post("/pdfs", formData, {
            headers: { Authorization: "Bearer " + localStorage.token },
          });
          console.log(response);

          return true;
        } catch (e) {
          console.log(e.response)
          return false;
        }
      },
      async createImage( index ) {
        let formData = new FormData();
        let body = {
          CreationImage: this.migrationCSV[index].date,
          publicationDate: this.migrationCSV[index].publicationDate,
          imageTitle: this.migrationCSV[index].nombre,
          publicationRef: '5dd5c606b6e91800112b7953',
          noteBookRef: '5dd5c624b6e91800112b7954',
          typeExtencion: ".png",
          status: null,
          description: this.migrationCSV[index].nombre,
          page: this.migrationCSV[index].pagina,
          photographer: this.migrationCSV[index].photographer,
          section: this.migrationCSV[index].seccion,
          observations: this.migrationCSV[index].descripcion,
          place: this.migrationCSV[index].lugar,
          graphicRef: null,
          externalFotographer: this.migrationCSV[index].fotografoExterno,
          itWasExported: null,
          canSell: null,
          clasificationRef : null,
          isPublished : this.migrationCSV[index].publicada,
          isYearBook : this.migrationCSV[index].anuario,
          isSelleable : this.migrationCSV[index].vendible,
          pixels : '0 x 0',
          attributedTitle : this.migrationCSV[index].attributedTitle,
        };
        console.log(body)
        formData.append("Imagen", this.files2[index]);
        formData.append("body", JSON.stringify(body));

        try {
          const response = await this.$axios.$post("/Images", formData, {
            headers: { Authorization: "Bearer " + localStorage.token },
          });
          console.log(response);

          this.$store.commit("openSnack", "La imagen se ha cargado exitosamente");

          return true;
        } catch (error) {
          console.log(error)
          this.$store.commit(
            "openSnack",
            "Ha ocurrido un error, por favor intente de nuevo"
          );
          return false;
        }
      },
      openDialog(index){
        switch(this.type){
          case 'Notas':
            this.migrationCSV.forEach( (x, i ) => {
              if(x.index == index ){
                this.$refs.migrationEditNoteDialog.openDialog(i);
              }
            })
          break;
          case 'PDF':
            this.migrationCSV.forEach( (x, i ) => {
              if(x.index == index ){
                this.$refs.migrationEditPDFDialog.openDialog(i);
              }
            })
          break;
          case 'Imagenes':
            this.migrationCSV.forEach( (x, i ) => {
              if(x.index == index ){
                this.$refs.migrationEditImageDialog.openDialog(i);
              }
            })
          break;
        }
      },
      deleteItem(index){
        this.migrationCSV.forEach( (x, i ) => {
          if(x.index == index ){
            this.migrationCSV.splice(i, 1);
            if(this.files2.length > 0){
              this.files2.splice(i, 1);
            }
          }
        })
      }

    }
  }
</script>

<style scoped>
  .v-text-field {
    padding-top: 0px !important;
    margin-top: 0px !important;
  }
</style>
