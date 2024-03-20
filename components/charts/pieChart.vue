<template>
  <client-only>
    <line2-chart :data="chartData" :options="options"></line2-chart>
  </client-only>
</template>

<script>
  export default {
    data() {
      return {
        dataLabels: [],
        dataData: [],
        chartData: {
          labels : this.labelsData,
          datasets : [
            {
              label : this.title,
              backgroundColor: this.color,
              data: this.valuesData
            },
          ]
        },
        options : {

          maintainAspectRatio: false
        }
      }
    },
    props : ['labelsData', 'valuesData', 'color', 'title'],
    created(){
      if(process.browser){
        this.chartData.datasets[0].backgroundColor = this.color;
      }
    }
  }
</script>
