<template>
  <client-only>
    <line3-chart :data="chartData" :options="options"></line3-chart>
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
              data: this.valuesData,
              fill : false,
              borderColor: "#3e95cd",
            },
          ]
        },
        options : {

          maintainAspectRatio: false
        }
      }
    },
    props : ['labelsData', 'valuesData', 'color', 'title']
  }
</script>
