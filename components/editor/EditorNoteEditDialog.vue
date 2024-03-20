<template>
  <div>
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
            <v-icon> mdi-newspaper-variant-outline </v-icon>
            <v-spacer />

            <v-toolbar-title>Edición de Nota</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closedialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-xl>
            <v-layout row wrap>
              <v-flex xs12 md8>
                <v-card outlined>
                  <v-card-actions>
                    <v-btn
                      color="grey lighten-2"
                      @click="$refs.editorNotePreviewDialog.openDialog()"
                      >Previsualizar nota</v-btn
                    >
                  </v-card-actions>

                  <v-card-text>
                    <v-form ref="formNota">
                      <editor
                        v-if="showEditor"
                        :api-key="'zlsfl8mrv98mfeg0jmyckhx3pwagf392svpd77b0n999imuh'"
                        :init="{
                          height: 600,
                          menubar: false,
                          plugins: [
                            'advlist autolink lists link anchor fullscreen insertdatetime paste code table wordcount',
                          ],
                          toolbar:
                            'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | link | code | fullscreen | table tabledelete | \
                            tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | \
                            tableinsertcolbefore tableinsertcolafter tabledeletecol',
                        }"
                        v-model="content"
                      />
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-flex>

              <v-flex xs12 md4>
                <v-card outlined>
                  <v-card-title>Información</v-card-title>
                  <v-card-text>
                    <v-form ref="form">
                      <v-select
                        :items="publications"
                        label="Publicación"
                        placeholder="Seleccione una opción"
                        item-text="publicationName"
                        item-value="_id"
                        outlined
                        dense
                        v-model="publicationRef"
                        class="custom-field mb-4"
                        hide-details
                        item-disabled="disable"
                      >
                        <template v-slot:item="{ item, attrs, on }">
                          <v-list-item
                            v-on="on"
                            v-bind="attrs"
                            :style="
                              item.disable == true
                                ? 'background-color : #b3b3b3'
                                : ''
                            "
                          >
                            <v-list-item-content
                              :style="
                                item.disable == true
                                  ? ''
                                  : 'padding-left : 10px'
                              "
                            >
                              <v-list-item-title
                                v-if="item.disable"
                                :class="
                                  !item.disable == true
                                    ? 'listItemTitleFalse'
                                    : 'listItemTitleTrue'
                                "
                              >
                                {{ item.publicationName }}
                              </v-list-item-title>
                              <v-list-item-title v-else>
                                <v-row no-gutters align="center">
                                  <span>{{ item.publicationName }}</span>
                                  <v-spacer></v-spacer>
                                  <!--v-chip x-small>{{
                                    "Megamedia Editorial"
                                  }}</v-chip-->
                                </v-row>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-select
                        :items="publicationRef != null ? notebooks2 : notebooks"
                        label="Cuaderno"
                        placeholder="Seleccione una opción"
                        item-text="NoteBookName"
                        item-value="_id"
                        outlined
                        dense
                        v-model="notebookRef"
                        class="custom-field mb-4"
                        hide-details
                        item-disabled="disable"
                      >
                        <template v-slot:item="{ item, attrs, on }">
                          <v-list-item
                            ripple
                            v-on="on"
                            v-bind="attrs"
                            :style="
                              item.disable == true
                                ? 'background-color : #b3b3b3'
                                : ''
                            "
                          >
                            <v-list-item-content
                              :style="
                                item.disable == true ? 'padding-left : 2px' : ''
                              "
                            >
                              <v-list-item-title
                                :class="
                                  item.disable == true
                                    ? 'listItemTitleTrue'
                                    : 'listItemTitleFalse'
                                "
                              >
                                {{ item.NoteBookName }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-select
                        label="Página"
                        placeholder="Seleccione una opción"
                        outlined
                        dense
                        v-model="page"
                        :items="pages"
                        hide-details
                        class="mb-4"
                      ></v-select>

                      <v-textarea
                        label="Titulo"
                        outlined
                        dense
                        v-model="title"
                        :rules="validations.fieldRules"
                        hide-details
                        class="mb-4"
                        height="70"
                      ></v-textarea>

                      <v-text-field
                        label="Subtítulo"
                        outlined
                        dense
                        v-model="subtitle"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

                      <v-text-field
                        label="Autor"
                        outlined
                        dense
                        v-model="autor"
                        hide-details
                        class="mb-4"
                      ></v-text-field>
                      <!-- :rules="validations.fieldRules" -->

                      <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="publishDate"
                            label="Fecha de publicación"
                            append-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                            :rules="validations.fieldRules"
                            hide-details
                            class="mb-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="publishDate"
                          @input="dateMenu = false"
                          locale="es-MX"
                        ></v-date-picker>
                      </v-menu>

                      <v-text-field
                        label="Mongo PDF ID"
                        outlined
                        dense
                        v-model="idMongoPDF"
                        hide-details
                        class="mb-4"
                      ></v-text-field>

                      <!-- <v-text-field
                        label="Imagen relacionada"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedImage"
                      ></v-text-field>

                      <v-text-field
                        label="Pdf relacionado"
                        outlined
                        dense
                        class="mb-4"
                        hide-details
                        v-model="relatedPDF"
                      ></v-text-field> -->

                      <!-- <v-textarea
                        outlined
                        label="Observaciones"
                        height="6rem"
                        v-model="observations"
                        hide-details
                      ></v-textarea> -->

                      <v-row>
                        <v-col>
                          <v-checkbox
                            v-model="isSelleable"
                            label="Vendible"
                            hide-details
                          ></v-checkbox>
                        </v-col>

                        <v-col>
                          <v-checkbox
                            v-model="isPublished"
                            label="Publicada"
                            hide-details
                          ></v-checkbox>
                        </v-col>

                        <v-col>
                          <v-checkbox
                            v-model="isYearbook"
                            label="Anuario"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pl-5 pr-5">
                    <v-layout row wrap class="pa-3">
                      <v-btn
                        block
                        class="mb-3"
                        color="primary"
                        @click="validate()"
                      >
                        Editar nota
                      </v-btn>
                      <v-btn
                        block
                        class="mb-3"
                        color="secondary"
                        @click="confirm2 = true"
                      >
                        Limpiar campos
                      </v-btn>
                      <!--- <v-btn block class="mb-3" color="#3091C5" style="color : white" @click="sendToStatics()"
                        > Ver estadísticas </v-btn> --->
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm" max-width="300" persistent>
      <v-card :loading="loading">
        <v-card-title>Advertencia</v-card-title>

        <v-card-text v-if="!loading">
          ¿Esta seguro de proceder a editar la nota?
        </v-card-text>

        <v-card-text v-else> Cargando la nota </v-card-text>

        <v-card-actions v-if="!loading">
          <v-spacer />
          <v-btn dark @click="confirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="editNote()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirm2" max-width="300" persistent>
      <v-card>
        <v-card-title>Advertencia</v-card-title>

        <v-card-text> ¿Esta seguro de limpiar todos los campos? </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn dark @click="confirm2 = false">Cancelar</v-btn>
          <v-btn color="primary" @click="resetiar(), (confirm2 = false)"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <EditorNotePreviewDialog
      ref="editorNotePreviewDialog"
      :observations="observations"
      :section="'NACIONAL - INTERNACIONAL'"
      :published="isPublished"
      :selleable="isSelleable"
      :agency="'REVISTA DE YUCATÁN'"
      :publishDate="publishDate"
      :id="cResponse.idMegamedia ? cResponse.idMegamedia : id"
      :page="page"
      :icon="icon"
      :content="content"
      :title="title"
      :subTitle="subtitle"
    />
    <v-dialog v-model="confirm1" max-width="300" persistent>
      <v-card :loading="loading1">
        <v-card-title>
          <center>Mensaje</center>
        </v-card-title>
        <v-card-text>
          Porfavor espere un momento, cargando los datos...
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EditorNotePreviewDialog from "~/components/editor/EditorNotePreviewDialog";
import Editor from "@tinymce/tinymce-vue";

import { mapState } from "vuex";
import { orderNotebooks } from "~/static/functions";

export default {
  components: {
    EditorNotePreviewDialog,
    Editor,
  },
  data: () => ({
    loading: false,
    confirm: false,
    loading1: false,
    confirm1: false,
    dialog: false,
    notebooks: [],
    notebooks2: [],
    publications: [],
    publishDate: null,
    dateMenu: false,
    publicationRef: null,
    notebookRef: null,
    title: null,
    subtitle: null,
    autor: null,
    content: null,
    isSelleable: false,
    tipo: null,
    isPublished: false,
    isYearbook: false,
    observations: null,
    page: null,
    id: null,
    relatedImage: null,
    relatedPDF: null,
    cYear: null,
    idMongoPDF: null,
    pages: [],
    cResponse: [],
    validations: {
      fieldRules: [(v) => !!v || "Campo requerido"],
      caracterLength: [
        (v) =>
          v.length <= 98800 || "El títutlo debe ser menor a 98800 caracteres",
      ],
    },
    icon: "",
    confirm2: false,
    showEditor: false,
  }),
  computed: {
    ...mapState(["notebooksStore", "publicationsStore"]),
  },
  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.showEditor = false;
      }
    },
    publicationRef(newValue) {
      this.notebooks2 = orderNotebooks(this.notebooks, newValue);
      this.tipo = "change";
    },
  },
  methods: {
    async openDialog(item, cYear) {
      this.cYear = cYear;
      this.loading1 = true;
      this.confirm1 = true;
      await this.getNotebooks();
      await this.getPublications();
      if (this.id != null) {
        if (this.id != item._id) {
          this.id = item._id;
          await this.getNote();
        }
      } else {
        this.id = item._id;
        await this.getNote();
      }

      this.loading1 = false;
      this.confirm1 = false;
      this.dialog = true;
      this.generatePages();
      setTimeout(() => {
        this.showEditor = true;
      }, 1);
    },
    async getPublications() {
      setTimeout(() => {
        this.publications = this.publicationsStore;
      }, 1);
    },
    async getNotebooks() {
      setTimeout(() => {
        this.notebooks = this.notebooksStore;
      }, 1);
    },
    async getNote() {
      this.loading = true;
      try {
        const response = await this.$axios.$get(
          "/notes/" + this.id + "/" + this.cYear,
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );

        this.cResponse = response.data.note;
        this.idMongoPDF = this.cResponse?.idMongoPDF;
        this.title = this.cResponse?.title;
        this.subtitle = this.cResponse?.subTitle;
        this.content = this.cResponse?.content;
        this.publicationRef =
          this.cResponse?.publicationRef !== undefined
          ? this.cResponse?.publicationRef?._id
          : null;
        this.notebookRef =
          this.cResponse?.noteBookRef !== undefined
          ? this.cResponse?.noteBookRef?._id
          : null;
        this.publishDate =
          this.cResponse.date !== undefined
          ? new Date(this.cResponse.date).toISOString().substring(0, 10)
          : null;
        const cPage = this.cResponse?.page ?? 0;
        this.page = cPage !== 0
          ? cPage
          : "Desconocido";
        this.autor = this.cResponse.originalAuthor;

        this.isSelleable =
          this.cResponse?.isSelleable !== undefined
          ? this.cResponse.isSelleable
          : false;
        this.isPublished =
          this.cResponse?.isPublished !== undefined
          ? this.cResponse.isPublished
          : false;
        this.isYearbook =
          this.cResponse?.isYearbook !== undefined
          ? this.cResponse.isYearbook
          : null;
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    },
    async editNote() {
      this.loading = true;
      try {
        const response = await this.$axios.$put(
          "/note",
          {
            title: this.title,
            subTitle: this.subtitle,
            publicationRef: this.publicationRef,
            noteBookRef: this.notebookRef,
            page: this.page !== "Desconocido" ? this.page : 0,
            originalAuthor: this.autor,
            date: this.publishDate,
            content: this.content,
            idMongoPDF: this.idMongoPDF?.trim(),
            isPublished: this.isPublished,
            isSelleable: this.isSelleable,
            isYearbook: this.isYearbook,
            _id: this.id,
          },
          {
            headers: { Authorization: "Bearer " + localStorage.token },
          }
        );
        // console.log(response);
        if (response) {
          this.$store.commit(
            "openSnack",
            "La nota ha sido editada exitosamente"
          );
          // this.$parent.getNotes();
          this.cleanAndClose();
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        this.$store.commit(
          "openSnack",
          "Ha ocurrido un error, por favor intente de nuevo"
        );
        return;
      }
    },
    generatePages() {
      this.pages.push("Desconocido");
      for (let i = 1; i <= 44; i++) {
        this.pages.push(i);
      }
    },
    async cleanAndClose() {
      try {
        // console.log("EJECUTO cleanAndClose");
        this.$parent.loading = true;
        let pag = this.$parent.page;

        this.$parent.page = 1;
        this.$parent.advObj.quantity = 1;
        this.$parent.saveSearchedPage = [];
        this.resetiar();
        this.confirm = false;
        this.loading = false;
        this.dialog = false;
        this.id = null;

        await this.$parent.getNotes();
        await this.$parent.getPagination();

        this.$parent.page = pag;
        this.$parent.nextPage();
        this.$parent.selected = [];
      } catch (error) {
        console.log(error);
        console.log('Error by clean and close')
      }
    },
    closedialog() {
      this.dialog = false;
      this.resetiar();
    },
    resetiar() {
      this.$refs.form.reset();
      this.$refs.formNota.reset();
      this.isSelleable = false;
      this.isPublished = false;
      this.isYearbook = false;
    },
    validate() {
      if (this.$refs.formNota.validate() && this.$refs.form.validate()) {
        this.confirm = true;
      }
    },
    sendToStatics() {
      this.$router.push({
        path: "/chartsAndGraphics",
        query: {
          content: btoa(JSON.stringify(this.id)),
          mode: "Notas",
        },
      });
    },
  },
};
</script>

<style scoped>
.listItemTitleTrue {
  text-align: left !important;
  color: White !important;
  font-size: 15px !important;
}
.listItemTitleFalse {
  padding-left: 12px !important;
}
</style>

