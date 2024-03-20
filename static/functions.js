export const removeSpecialCharacters = (word, search) => {
  const wordLC = word !== undefined ? word.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  const searchLC = search !== undefined ? search.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : search;
  return wordLC.toLowerCase().includes(searchLC.toLowerCase());
}

export const orderNotebooks = (sectionSelect, publicationId) => {
  // this.advData.noteBookRef = null;
  // for (let i = 0; i < this.publications.length; i++) {
  //   if (newValue == this.publications[i]._id) {
  //     this.icon = this.publications[i].icon;
  //   }
  // }
  console.log(sectionSelect)
  console.clear()
  let sectionSelect2 = [];
  sectionSelect.forEach((x) => {
    if (x.PublicationReference && x.PublicationReference._id == publicationId) {
      sectionSelect2.push(x);
    }
  });
  if (sectionSelect2.length == 0) {
    sectionSelect2.push({ NoteBookName: "No se encontraron cuadernos", status: true, _id: "NO-VALIDO", disable: true });
  } else {
    const newNotebooksOrder = {
      isCurrent: [],
      isNotCurrent: [],
    };
    sectionSelect2.forEach((notebook) => {
      if (
        notebook?.vigente === false ||
        notebook?.vigente === undefined ||
        notebook?.vigente === null
      ) {
        newNotebooksOrder.isNotCurrent.push(notebook);
      } else {
        newNotebooksOrder.isCurrent.push(notebook);
      }
    });

    newNotebooksOrder.isCurrent = newNotebooksOrder.isCurrent.sort(
      function (a, b) {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      }
    );

    const removeSpecialCharacters = (str) => {
      if (str === undefined || str === null)
        str = '';

      return str.replace(/[^a-zA-Z0-9 ]/g, '');
    };

    newNotebooksOrder.isNotCurrent = newNotebooksOrder.isNotCurrent.sort(
      function (a, b) {
        a = a.NoteBookName ?? '';
        b = b.NoteBookName ?? '';

        a = removeSpecialCharacters(a.trim());
        b = removeSpecialCharacters(b.trim());
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      }
    );

    sectionSelect2 = [];
    sectionSelect2.push({ NoteBookName: "Todos los cuadernos", status: true, _id: null });

    if (newNotebooksOrder.isCurrent.length > 0) {
      sectionSelect2.push({ NoteBookName: "Vigentes", status: true, _id: "Vigentes", disable: true });
      newNotebooksOrder.isCurrent.forEach(notebook => { sectionSelect2.push(notebook) });
    }
    if (newNotebooksOrder.isNotCurrent.length > 0) {
      sectionSelect2.push({ NoteBookName: "No vigentes", status: true, _id: "No vigentes", disable: true });
      newNotebooksOrder.isNotCurrent.forEach(notebook => { sectionSelect2.push(notebook) });
    }
  }
  return sectionSelect2;
}
