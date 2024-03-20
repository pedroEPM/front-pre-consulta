<template>
  <div>
    <div style="width:100%; height:800px;" id="viewer-image" ref="image"/>
  </div>
</template>
<script>
import OpenSeadragon from "openseadragon";
window.OpenSeadragon = OpenSeadragon;
export default {
  name: "Viewer",
  data() {
    return {
      viewer: null
    };
  },
  mounted() {
    this.initViewer();
  },
  methods: {
    initViewer() {

      var duomo = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Url: "//openseadragon.github.io/example-images/duomo/duomo_files/",
          Format: "jpg",
          Overlap: "2",
          TileSize: "256",
          Size: {
            Width: "13920",
            Height: "10200"
          }
        }
      };

      var source = [
        {
          type: "image",
          url:
            "https://ad84.archiviciel.io/viewer/index.php/show/full/images/images-FR075FMSH_000000001/moraze-Francfort1930.jpg"
        },
        {
          type: "image",
          url:
            "https://ad84.archiviciel.io/viewer/index.php/show/full/images/images-FR075FMSH_000000001/moraze-_classeMayence1926-7.jpg"
        },
        {
          type: "image",
          url:
            "https://ad84.archiviciel.io/viewer/index.php/show/full/images/images-FR075FMSH_000000001/moraze-_petit_classe.jpg"
        }
      ];
      var source2 = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Url: "//openseadragon.github.io/example-images/duomo/duomo_files/",
          Format: "jpg",
          Overlap: "1",
          TileSize: "254",
          Size: {
            Width: "13920",
            Height: "10200"
          }
        }
      };
      /* this.viewer = OpenSeadragon({
        id: "viewer-image",
         showNavigator:  true,
        animationTime: 0.4,
        visibilityRatio: 0.2,
        //prefixUrl: "//openseadragon.github.io/openseadragon/images/",
           sequenceMode: true,
               debugMode:  true,
        tileSources: source2
      });*/

      this.viewer = OpenSeadragon({
        id: "viewer-image",
        animationTime: 0.4,
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        showNavigator: true,
        sequenceMode: true,
        tileSources: source
      });
      //this.viewer.initializeAnnotations()
      /* OpenSeadragon({
        animationTime: 0.4,
        id: "viewer-image",
        tileSources: {
          type: "image",
          url: "https://picsum.photos/id/237/200/300"
        },
        visibilityRatio: 0.2
      });*/
    }
  }
};
</script>

