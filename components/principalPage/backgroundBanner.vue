<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Fondo del banner</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="$refs.backgroundBannersAddDialog.openDialog()">Agregar imagen</v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 md6 v-for="( item, index ) in banner2" :key="index">
          <v-card color="transparent" elevation="0">
            <img class="background-img" @click="$refs.backgroundBannersEditDialog.openDialog( item._id )" height="250" :src="imgPath + item.imgUrl">
          </v-card>
          <!-- <v-row class="fill-height" align="center" justify="center">
          </v-row> -->
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-layout row wrap justify-center>

        <v-flex xs12 md4 >
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="$vuetify.breakpoint.mobile ? 5 : 7"
            @input="nextPage()"
          ></v-pagination>
        </v-flex>

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
    </v-card-text>
    <BackgroundBannersAddDialog ref="backgroundBannersAddDialog" />
    <BackgroundBannersEditDialog ref="backgroundBannersEditDialog" />
  </v-card>
</template>

<script>
  import BackgroundBannersAddDialog from '~/components/principalPage/backgroundBannerAddDialog.vue';
  import BackgroundBannersEditDialog from '~/components/principalPage/backgroundBannerEditDialog.vue';
  export default {
    components : {
      BackgroundBannersAddDialog,
      BackgroundBannersEditDialog,
    },
    data(){
      return {
        imgPath: process.env.imgPath,
        loading : false,
        banner : [],
        banner2 : [],
        page : null,
        pages : [],
        amount : 4,
        totalPages : null,
      }
    },
    async created(){
      if( process.browser ){
        await this.getBackgroundBanners();
        this.getPagination();
        this.getArrayImage(1);
      }
    },
    methods : {
      async getBackgroundBanners(){
        this.banner = [];
        const response = await this.$axios.$get('/backgroundbanner', {
          headers : { Authorization : 'Bearer ' + localStorage.token }
        });

        this.banner = response.data;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      },
      getPagination(){
        this.page = 1;
        this.totalPages = Math.ceil(this.banner.length / this.amount);
        this.generateArrayPages( this.totalPages )
      },
      generateArrayPages( total ){
        this.pages = Array.from(Array(total + 1).keys());
        this.pages.shift();
      },
      nextPage(){
        this.getArrayImage( this.page );
      },
      getArrayImage( page ){
        this.loading = true;
        let lastElement = ( page * this.amount );
        let firstElement = lastElement - this.amount;
        this.banner2 = [];
        for( firstElement; firstElement < lastElement; firstElement++ ){
          if( firstElement == this.banner.length ){
            break;
          }
          this.banner2.push(this.banner[firstElement]);
          console.log(this.banner2)
        }
        // console.log(this.banner2)
        setTimeout(() => {
          this.loading = false;
        }, 500);

      }
    }
  }
</script>

<style lang="scss" scoped>
.background-img {
  cursor: pointer;
  object-fit: cover;
  width: 100%;
  border-radius: 5px;
  border: 1px solid lightgrey;
}

.background-img:hover {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
</style>
