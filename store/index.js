export const strict = false

export const state = () => ({
  isLoged: false,
  logged: false,
  snackText: "",
  snackBar: false,
  username: "",
  img: '',
  counters: {
    requests: 0,
    reports: 0,
    mensajero: 0
  },
  saveRoute: null,

  notebooksStore: [],
  publicationsStore: [],
})

export const mutations = {
  logIn(state) {
    state.logged = true
  },
  logOut(state) {
    // localStorage.clear();
    state.logged = false
  },
  openSnack(state, text) {
    state.snackText = text

    state.snackBar = true
    setTimeout(() => {
      state.snackBar = false
    }, 5000)
  },
  getRoutePath(state, path) {
    state.saveRoute = path;
  },
  setCount(state, obj) {
    switch (obj.mode) {
      case 'requests':
        state.counters.requests = obj.value;
        break;
      case 'reports':
        state.counters.reports = obj.value;
        break;
      case 'mensajero':
        state.counters.mensajero = obj.value;
        break;
    }
  },
  setUsername(state, text) {
    state.username = text
  },
  setUserimg(state, img) {
    state.img = img
  },


  userLoged(state, isLoged) {
    state.isLoged = isLoged;
  },
  setNotebooksStore(state, notebooks) {
    state.notebooksStore = notebooks.notebooks;
  },
  setPublicationsStore(state, publications) {
    state.publicationsStore = publications.publications;
  },
}

export const actions = {
  async getUser(context) {
    try {
      const response = await this.$axios.$get('/adminsById/' + localStorage.user_id, {
        headers: { Authorization: 'Bearer ' + localStorage.token }
      });
      context.commit('setUsername', response.data.name);
      context.commit('setUserimg', response.data.img);
    } catch (error) {
      console.log(error)
    }
  },
  async getReportsStore(context) {

    const response = await this.$axios.$get('/reportsSearch', {
      params: {
        status: 'Comenzar',
        date: null,
        date2: null
      },
      headers: { Authorization: 'Bearer ' + localStorage.token }
    });
    const reports = [];
    const reportsMensajero = [];
    response.data.forEach(x => {
      if (!x.fromMensajero) {
        reports.push(x);
      } else {
        reportsMensajero.push(x);
      }
    });
    context.commit(
      'setCount',
      {
        mode: 'reports',
        value: reports.length > 99 ? '+99' : reports.length
      }
    );
    context.commit(
      'setCount',
      {
        mode: 'mensajero',
        value: reportsMensajero.length > 99 ? '+99' : reportsMensajero.length
      }
    );
  },
  async getRequestsStore(context) {
    const response = await this.$axios.$get('/requestdocuments', {
      params: {
        kind: null,
        date1: null,
        date2: null,
        status: 'Comenzar'
      },
      headers: { Authorization: 'Bearer ' + localStorage.token }
    });
    context.commit(
      'setCount',
      {
        mode: 'requests',
        value: response.data.length > 99 ? '+99' : response.data.length
      }
    );
  },
  async getNotebooksS(context) {
    try {
      let notebooks = [];
      const response = await this.$axios.$get("/NoteBooks", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });
      notebooks = response.data.notebooks;

      context.commit('setNotebooksStore', { notebooks });
    } catch (error) {
      console.log('error notebooks store');
      console.log(error);
      context.commit('setNotebooksStore', []);

    }
  },
  async getPublicationsS(context) {
    try {

      const orderAllPublications = (lastOrder, cPublications, staticPublication, group) => {
        lastOrder.push({
          publicationName: staticPublication,
          status: false,
          _id: staticPublication,
          disable: true,
        });
        cPublications.forEach((publication) => {
          if (publication?.group === group) lastOrder.push(publication);
        });
        return lastOrder;
      };

      const response = await this.$axios.$get("/Publications", {
        headers: { Authorization: "Bearer " + localStorage.token },
      });

      let publications = response.data?.publicaciones?.sort(function (a, b) {

        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });

      let lastOrder = [];
      lastOrder.push({
        publicationName: "Todas las publicaciones",
        status: true,
        _id: null,
      });
      lastOrder = orderAllPublications(
        lastOrder,
        publications,
        "Medios tradicionales",
        1
      );
      lastOrder = orderAllPublications(
        lastOrder,
        publications,
        "Medios ligeros",
        2
      );
      lastOrder = orderAllPublications(
        lastOrder,
        publications,
        "La Factoría",
        3
      );
      lastOrder = orderAllPublications(
        lastOrder,
        publications,
        "Otras publicaciones",
        4
      );
      publications = lastOrder;

      context.commit('setPublicationsStore', { publications: publications });
    } catch (error) {
      console.log('error publications store');
      console.log(error);
      context.commit('setPublicationsStore', []);
    }
  },
}

