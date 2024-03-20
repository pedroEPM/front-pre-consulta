<template>
  <client-only>
    <line-chart v-if="showThis" :data="chartData" :options="options"></line-chart>
  </client-only>
</template>

<script>
  export default {
    data() {
      return {
        showThis: false,
        dataLabels: [],
        dataData: [],
        chartData: {
          labels : this.labelsData,
          datasets : this.MoreDatasets != undefined ?
          this.MoreDatasets :
          [
            {
              label : this.title,
              backgroundColor: this.color,
              data: this.valuesData,
              minBarLength: 10,

            },
          ]
        },
        options : {
          responsive: true,
          maintainAspectRatio: false,
          tooltip:false,
          display:true,
          
        }
      }
    },
    mounted(){
      if( this.MoreDatasets != undefined ){
        // this.MoreDatasets.forEach( ( x, index ) => {
        //   this.MoreDatasets[index].backgroundColor = this.color;
        //   this.MoreDatasets[index].data = this.valuesData;
        // });

        this.MoreDatasets[0].backgroundColor = this.color;
        this.MoreDatasets[0].data = this.valuesData;
      }
      this.showThis = true;
    },
    props : ['labelsData', 'valuesData', 'color', 'title', 'MoreDatasets']
  }
</script>
