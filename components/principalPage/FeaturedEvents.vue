<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title> Acontecimientos Destacados </v-toolbar-title>
      <v-spacer />
      <v-btn
        color="primary"
        @click="$refs.featuredEventsAddDialog.openDialog()"
      >
        Crear Acontecimiento
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 md6 v-for="(item, index) in events2" :key="index">
          <div v-if="loading">
            <v-skeleton-loader
              class="mb-3"
              max-width="300"
              height="150"
              type="card"
              elevation="2"
            ></v-skeleton-loader>
          </div>

          <div v-if="!loading">
            <v-card
              class="mb-2 slider-card text-center"
              outlined
              elevation="2"
              @click="$refs.featuredEventsEditDialog.openDialog(item.index)"
            >
              <v-card-text class="pa-1 pt-0 evemt-card-text">
                <img
                  :src="imgPath + item.imageSrc"
                  loading="lazy"
                  height="150"
                  class="event-image"
                />

                <v-chip color="secondary" class="event-chip">
                  {{ months[parseInt(item.date.substring(5,7)) - 1] }}
                </v-chip>

                <h3 class="headline event-title">
                  {{ item.titleEvent.toUpperCase() }}
                </h3>
              </v-card-text>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>

    <v-card-text>
      <v-layout row wrap justify-center>
        <v-flex xs12 md4>
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="$vuetify.breakpoint.mobile ? 5 : 7"
            @input="nextPage()"
          ></v-pagination>
        </v-flex>

        <v-flex xs12 md2>
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

    <FeaturedEventsAddDialog ref="featuredEventsAddDialog" />
    <FeaturedEventsEditDialog ref="featuredEventsEditDialog" />
  </v-card>
</template>

<script>
import FeaturedEventsAddDialog from "~/components/principalPage/FeaturedEventsAddDialog";
import FeaturedEventsEditDialog from "~/components/principalPage/FeaturedEventsEditDialog";
export default {
  components: {
    FeaturedEventsAddDialog,
    FeaturedEventsEditDialog,
  },
  data() {
    return {
      loading: true,
      events: [],
      events2: [],
      imgPath: process.env.imgPath,
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      page: null,
      pages: [],
      amount: 4,
      totalPages: null,
    };
  },
  async created() {
    if (process.browser) {
      await this.getFeatured();
      this.getPagination();
      this.getArrayImage(1);
    }
  },
  methods: {
    async getFeatured() {
      this.loading = true;
      this.events = [];
      const response = await this.$axios.$get("/FeaturedEvents", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      this.events = response.data.FeaturedEvents;
      this.events.forEach((x, index) => {
        this.events[index].index = index;
        
      });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    getPagination() {
      this.page = 1;
      this.totalPages = Math.ceil(this.events.length / this.amount);
      this.generateArrayPages(this.totalPages);
    },
    generateArrayPages(total) {
      this.pages = Array.from(Array(total + 1).keys());
      this.pages.shift();
    },
    nextPage() {
      this.getArrayImage(this.page);
    },
    getArrayImage(page) {
      this.loading = true;
      let lastElement = page * this.amount;
      let firstElement = lastElement - this.amount;
      this.events2 = [];
      for (firstElement; firstElement < lastElement; firstElement++) {
        if (firstElement == this.events.length) {
          break;
        }
        this.events2.push(this.events[firstElement]);
      }
      // console.log(this.events2)
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.image-carousel {
  height: 200px;
  width: 20vw;
  @media screen and (min-width: 0px) and (max-width: 768px) {
    width: 92vw;
  }
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  //opacity: .8;
  position: absolute;
  width: 100%;
}

.carousel-month {
  letter-spacing: 5px !important;
}

::v-deep .VueCarousel-dot-container {
  margin-top: 0px !important;
}

::v-deep .VueCarousel-dot {
  margin-top: 0px !important;
}

.event-image {
  object-fit: cover;
  max-width: 150px;
  margin: 5px;
  margin-top: 10px;
  border-radius: 5px;
}

.evemt-card-text {
  display: flex;
  flex-direction: row;
}

.event-title {
  align-self: center;
  width: 100%;
  margin: 5px
}

.event-chip {
  position: absolute;
  font-size: 16px !important;
  top: -15px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}
</style>
