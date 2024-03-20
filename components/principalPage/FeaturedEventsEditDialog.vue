<template>
  <div>
    <v-dialog
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-model="dialog"
    >
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar dark color="primary">
            <!-- <v-icon> mdi-help </v-icon> -->
            <v-spacer />
            <v-toolbar-title>Editar acontecimientos destacados</v-toolbar-title>
            <v-spacer />
            <v-btn icon dark @click="close()">
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text style="height: 68.5vh; overflow-y: auto">
          <v-container grid-list-xl v-if="!loading">
            <v-layout row wrap>
              <v-flex xs12 md4 v-for="(item, index) in events2" :key="index">
                <v-card
                  class="mx-auto"
                  max-width="344"
                >
                  <v-img
                    :src="imgPath + item.imageSrc"
                    height="200px"
                  ></v-img>

                  <v-card-title>
                    {{item.titleEvent}}
                  </v-card-title>

                  <v-card-text>
                    {{ item.Description }}
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="" icon @click="changeState(item)"><v-icon :color="item.active ? '#00ff01' : '#fe0000'"> mdi-checkbox-blank-circle</v-icon></v-btn>
                    <v-btn
                      color="secondary"
                      icon
                      @click="$refs.featuredEventsEfemeridesDelete.openDialog(item._id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      color="secondary"
                      icon
                      @click="$refs.featuredEventsEfemeridesEditDialog.openDialog(item._id)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-layout row wrap justify-center>

            <v-flex xs12 md2 >
              <v-select
                solo
                dense
                :items="pages"
                v-model="page"
                @input="nextPage()"
                hide-details
                style="width: 100px; margin: auto"
              ></v-select>
            </v-flex>

          </v-layout>
        </v-card-actions>

      </v-card>
      <FeaturedEventsEfemeridesEditDialog ref="featuredEventsEfemeridesEditDialog"/>
      <FeaturedEventsEfemeridesDelete ref="featuredEventsEfemeridesDelete" />
    </v-dialog>
    <v-dialog v-model="loading" max-width="300" persistent>
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>
        <v-card-text>Cargando</v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="changeStateM" max-width="300" persistent>
      <v-card>
        <v-card-title>Cambiando estado..</v-card-title>
        <v-card-text>Por favor espere, estamos cambiando el estado</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import FeaturedEventsEfemeridesEditDialog from '~/components/principalPage/FeaturedEventsEfemeridesEditDialog';
  import FeaturedEventsEfemeridesDelete from '~/components/principalPage/FeaturedEventsEfemeridesDelete';

  export default {
    components : {
      FeaturedEventsEfemeridesEditDialog,
      FeaturedEventsEfemeridesDelete
    },
    data(){
      return {
        imgPath: process.env.imgPath,
        dialog : false,
        loading : false,
        page : null,
        totalPages : null,
        month : null,
        pages : [],
        events : [],
        events2 : [],
        changeStateM : false,
      }
    },
    methods : {
      openDialog( month ){
        this.dialog = true;
        this.month = month;
        this.getEvents(month);
      },
      async getEvents( month ){
        console.log('featureEventEditDialog');
        this.loading = true;
        const response = await this.$axios.$get('/Efemerides', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });
        this.events = response.data.Efemerides['m'+month];
        
        this.generateArrayPages();
        this.getArrayImage(this.page);
        this.loading = false;
        this.efemeridesOrdenados(response.data.Efemerides);
      },
      efemeridesOrdenados(events){

        var nuevo_efemerides = []
        let meses = []
          /*meses.push(events.m0)
          meses.push(events.m1)
          meses.push(events.m2)
          meses.push(events.m3)
          meses.push(events.m4)
          meses.push(events.m5)
          meses.push(events.m6)
          meses.push(events.m7)
          meses.push(events.m8)
          meses.push(events.m9)
          meses.push(events.m10)
          meses.push(events.m11)*/
        /*meses.forEach((mes, index) => {
          events[mes].forEach((x,index) => {
            nuevo_efemerides.push(x);
            console.log('x'+x);
          });
          console.log('nuevos'+nuevo_efemerides)
        });*/
        events.m0.forEach( x => {
          console.log(x)
        });
        events.m1.forEach( x => {
          console.log(x)
        });
        events.m2.forEach( x => {
          console.log(x)
        });
        events.m3.forEach( x => {
          console.log(x)
        });
      },
      generateArrayPages() {
        this.pages = [];
        this.events.forEach( x => {
          this.pages.push(x.year)
        });
        this.page = this.pages[0];
        this.totalPages = this.pages.length;
      },
      nextPage() {
        this.getArrayImage( this.page );
      },
      getArrayImage( page ){
        this.loading = true;
        this.events2 = [];
        this.events2 = this.events[this.pages.indexOf(page, 0)].items;

        setTimeout(() => {
          this.loading = false;
        }, 1000);

      },
      async close(){
        this.dialog = false;
        let page = this.$parent.$parent.page;
        console.log(this.$parent.$parent.page)
        await this.$parent.$parent.getFeatured();
        this.$parent.$parent.getPagination();
        this.$parent.$parent.getArrayImage(page)
        this.$parent.$parent.page = page;
        console.log(this.$parent.$parent.page)
      },
      async changeState( item ){
        this.changeStateM = true;
        let formData = new FormData();
        const body = {
          date : item.date,
          titleEvent : item.titleEvent,
          Description : item.Description,
          active : !item.active,
          id : item._id,
          // Image64 : item.iconB64,
          Image64 : null,
          mainEvent : item.mainEvent,
          imageName: null,
        };

        formData.append('body', JSON.stringify(body));

        try {

          const response = await this.$axios.$put('/featuredEvents', formData, {
            headers : { Authorization : 'Bearer ' + localStorage.token },
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
          });
          const page = this.page;
          this.changeStateM = false;
          await this.getEvents(this.month);
          this.page = page;
          this.nextPage();
          this.changeStateM = false;
        } catch (error) {
          this.changeStateM = false;
          console.log(error.response);
          this.$store.commit(
            'openSnack',
            'Ha ocurrido un error, inténtelo de nuevo'
          );
        }
      }

    }
  }
</script>

<style>

</style>
